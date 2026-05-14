-- Advanced Inventory Schema

-- Branches & Warehouses
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location TEXT,
  type VARCHAR(50) CHECK (type IN ('STORE', 'WAREHOUSE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced Products
CREATE TABLE products_advanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100) UNIQUE,
  category_id UUID,
  brand_id UUID,
  supplier_id UUID,
  retail_price DECIMAL(12,2) NOT NULL,
  wholesale_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  tax_class VARCHAR(50) DEFAULT 'standard',
  uom VARCHAR(50) DEFAULT 'pcs', -- Unit of measure
  reorder_level INT DEFAULT 0,
  min_stock_level INT DEFAULT 0,
  max_stock_level INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory (Stock by Branch)
CREATE TABLE inventory_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products_advanced(id),
  branch_id UUID REFERENCES branches(id),
  quantity INT NOT NULL DEFAULT 0,
  location_bin VARCHAR(100),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, branch_id)
);

-- Stock Movements (Audit Trail)
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products_advanced(id),
  branch_id UUID REFERENCES branches(id),
  movement_type VARCHAR(50) CHECK (movement_type IN ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'SCRAP', 'RETURN')),
  quantity INT NOT NULL,
  reference_id UUID, -- Sale ID, Transfer ID, etc.
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfers
CREATE TABLE inventory_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_branch_id UUID REFERENCES branches(id),
  to_branch_id UUID REFERENCES branches(id),
  status VARCHAR(50) CHECK (status IN ('DRAFT', 'PENDING', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED')),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stocktake
CREATE TABLE stocktakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  status VARCHAR(50) CHECK (status IN ('DRAFT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED')),
  type VARCHAR(50) CHECK (type IN ('FULL', 'PARTIAL', 'CYCLE')),
  created_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);
