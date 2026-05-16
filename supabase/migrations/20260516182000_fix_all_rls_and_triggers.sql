-- Fix RLS Policies for all tenant tables and add auto-business_id trigger.

-- 1. Auto-assign business_id on insert for tenant tables
CREATE OR REPLACE FUNCTION auto_assign_business_id()
RETURNS TRIGGER AS $$
DECLARE
  v_business_id UUID;
BEGIN
  IF NEW.business_id IS NULL THEN
    -- Get the first business the user belongs to
    SELECT business_id INTO v_business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid() AND deleted_at IS NULL
    LIMIT 1;
    
    IF v_business_id IS NOT NULL THEN
      NEW.business_id := v_business_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables
DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON products;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON products FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON categories;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON categories FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON inventory;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON inventory FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON customers;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON customers FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON suppliers;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON suppliers FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON sales;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON sales FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON purchases;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON purchases FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON expenses;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON expenses FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();

DROP TRIGGER IF EXISTS trg_auto_assign_business_id ON branches;
CREATE TRIGGER trg_auto_assign_business_id BEFORE INSERT ON branches FOR EACH ROW EXECUTE FUNCTION auto_assign_business_id();


-- 2. Add full RLS policies (SELECT, INSERT, UPDATE, DELETE) to all core tables

-- Drop existing restricted policies to recreate them cleanly
DROP POLICY IF EXISTS "Users can view products in their business" ON products;
DROP POLICY IF EXISTS "Users can insert products in their business" ON products;
DROP POLICY IF EXISTS "Users can update products in their business" ON products;
DROP POLICY IF EXISTS "Users can view sales in their business" ON sales;
DROP POLICY IF EXISTS "Users can insert sales in their business" ON sales;
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;

-- Drop old Tenant policies just in case
DO $$ 
DECLARE
    t_name text;
BEGIN
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Tenant Select" ON %I', t_name);
        EXECUTE format('DROP POLICY IF EXISTS "Tenant Insert" ON %I', t_name);
        EXECUTE format('DROP POLICY IF EXISTS "Tenant Update" ON %I', t_name);
        EXECUTE format('DROP POLICY IF EXISTS "Tenant Delete" ON %I', t_name);
    END LOOP;
END $$;


CREATE OR REPLACE FUNCTION create_tenant_policies(table_name text) RETURNS void AS $$
BEGIN
    EXECUTE format('
        CREATE POLICY "Tenant Select" ON %I FOR SELECT 
        USING (business_id IN (SELECT auth_user_businesses()));
        
        CREATE POLICY "Tenant Insert" ON %I FOR INSERT 
        WITH CHECK (business_id IN (SELECT auth_user_businesses()));
        
        CREATE POLICY "Tenant Update" ON %I FOR UPDATE 
        USING (business_id IN (SELECT auth_user_businesses()));
        
        CREATE POLICY "Tenant Delete" ON %I FOR DELETE 
        USING (business_id IN (SELECT auth_user_businesses()));
    ', table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- For businesses:
CREATE POLICY "Tenant Select" ON businesses FOR SELECT USING (id IN (SELECT auth_user_businesses()));
CREATE POLICY "Tenant Update" ON businesses FOR UPDATE USING (id IN (SELECT auth_user_businesses()));

-- For the rest with business_id:
SELECT create_tenant_policies('branches');
SELECT create_tenant_policies('roles');
SELECT create_tenant_policies('categories');
SELECT create_tenant_policies('products');
SELECT create_tenant_policies('inventory');
SELECT create_tenant_policies('stock_movements');
SELECT create_tenant_policies('stocktakes');
SELECT create_tenant_policies('customers');
SELECT create_tenant_policies('suppliers');
SELECT create_tenant_policies('sales');
SELECT create_tenant_policies('purchases');
SELECT create_tenant_policies('expenses');

-- Apply RLS to items tables:
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocktake_items ENABLE ROW LEVEL SECURITY;

-- Policies for children without business_id:
-- sale_items
CREATE POLICY "Tenant Select" ON sale_items FOR SELECT USING (sale_id IN (SELECT id FROM sales WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Insert" ON sale_items FOR INSERT WITH CHECK (sale_id IN (SELECT id FROM sales WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Update" ON sale_items FOR UPDATE USING (sale_id IN (SELECT id FROM sales WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Delete" ON sale_items FOR DELETE USING (sale_id IN (SELECT id FROM sales WHERE business_id IN (SELECT auth_user_businesses())));

-- purchase_items
CREATE POLICY "Tenant Select" ON purchase_items FOR SELECT USING (purchase_id IN (SELECT id FROM purchases WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Insert" ON purchase_items FOR INSERT WITH CHECK (purchase_id IN (SELECT id FROM purchases WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Update" ON purchase_items FOR UPDATE USING (purchase_id IN (SELECT id FROM purchases WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Delete" ON purchase_items FOR DELETE USING (purchase_id IN (SELECT id FROM purchases WHERE business_id IN (SELECT auth_user_businesses())));

-- stocktake_items
CREATE POLICY "Tenant Select" ON stocktake_items FOR SELECT USING (stocktake_id IN (SELECT id FROM stocktakes WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Insert" ON stocktake_items FOR INSERT WITH CHECK (stocktake_id IN (SELECT id FROM stocktakes WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Update" ON stocktake_items FOR UPDATE USING (stocktake_id IN (SELECT id FROM stocktakes WHERE business_id IN (SELECT auth_user_businesses())));
CREATE POLICY "Tenant Delete" ON stocktake_items FOR DELETE USING (stocktake_id IN (SELECT id FROM stocktakes WHERE business_id IN (SELECT auth_user_businesses())));
