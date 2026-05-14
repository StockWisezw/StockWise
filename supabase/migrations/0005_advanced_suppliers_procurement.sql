-- Advanced Supplier & Procurement Schema

-- Suppliers Table
CREATE TABLE suppliers_advanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  alt_phone VARCHAR(50),
  address TEXT,
  tax_number VARCHAR(100),
  bank_details TEXT,
  payment_terms VARCHAR(100), -- e.g., Net 30, COD
  credit_limit DECIMAL(12,2) DEFAULT 0.00,
  balance DECIMAL(12,2) DEFAULT 0.00, -- Outstanding payable balance
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')),
  notes TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00, -- Supplier performance rating 0-5
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Orders (PO)
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers_advanced(id),
  branch_id UUID REFERENCES branches(id), -- Receiving branch/warehouse
  status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'PARTIAL_RECEIVED', 'RECEIVED', 'CANCELLED')),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  subtotal DECIMAL(12,2) DEFAULT 0.00,
  tax_total DECIMAL(12,2) DEFAULT 0.00,
  shipping_cost DECIMAL(12,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) DEFAULT 0.00,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PO Items
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products_advanced(id),
  quantity_ordered INT NOT NULL DEFAULT 0,
  quantity_received INT NOT NULL DEFAULT 0,
  unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  notes TEXT
);

-- Goods Received Notes (GRN)
CREATE TABLE goods_received_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grn_number VARCHAR(100) UNIQUE NOT NULL,
  po_id UUID REFERENCES purchase_orders(id),
  supplier_id UUID REFERENCES suppliers_advanced(id),
  branch_id UUID REFERENCES branches(id),
  received_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'COMPLETED', 'DISCREPANCY')),
  supplier_invoice_ref VARCHAR(100),
  received_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GRN Items
CREATE TABLE grn_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grn_id UUID REFERENCES goods_received_notes(id) ON DELETE CASCADE,
  po_item_id UUID REFERENCES purchase_order_items(id),
  product_id UUID REFERENCES products_advanced(id),
  quantity_received INT NOT NULL DEFAULT 0,
  quantity_accepted INT NOT NULL DEFAULT 0,
  quantity_rejected INT NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  batch_number VARCHAR(100),
  expiry_date DATE
);

-- Supplier Ledger (Accounts Payable)
CREATE TABLE supplier_ledgers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers_advanced(id),
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('INVOICE', 'PAYMENT', 'CREDIT_NOTE', 'DEBIT_NOTE', 'OPENING_BALANCE')),
  reference_id UUID, -- References PO, GRN, or Payment
  reference_number VARCHAR(100), -- Invoice number, Receipt number
  amount DECIMAL(12,2) NOT NULL, -- Positive for Payable (Invoice), Negative for Payment/Credit Note
  balance DECIMAL(12,2) NOT NULL, -- Running balance
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id)
);

-- Supplier Payments
CREATE TABLE supplier_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers_advanced(id),
  amount DECIMAL(12,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method VARCHAR(50) CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE', 'OTHER')),
  payment_source VARCHAR(50) CHECK (payment_source IN ('TILL', 'BANK_ACCOUNT', 'OWNER_INJECTION')),
  reference_number VARCHAR(100), -- Bank ref or receipt number
  status VARCHAR(50) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id)
);

-- Supplier Returns
CREATE TABLE supplier_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers_advanced(id),
  grn_id UUID REFERENCES goods_received_notes(id), -- Optional: Link to specific receipt
  branch_id UUID REFERENCES branches(id),
  status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  total_amount DECIMAL(12,2) DEFAULT 0.00,
  return_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason VARCHAR(255),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
