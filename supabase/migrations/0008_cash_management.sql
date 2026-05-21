CREATE TABLE cash_drawer_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- opening_float, expense, restock, owner_collection, closing_count
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE cash_drawer_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cash drawer logs in their business"
    ON cash_drawer_logs FOR SELECT
    USING (business_id IN (
        SELECT business_id FROM user_profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can insert cash drawer logs in their business"
    ON cash_drawer_logs FOR INSERT
    WITH CHECK (business_id IN (
        SELECT business_id FROM user_profiles WHERE id = auth.uid()
    ));
