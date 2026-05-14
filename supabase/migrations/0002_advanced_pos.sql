-- Advanced POS Schema
-- Includes Credit Sales, Refunds & Returns, and Auditing

-- Credit Accounts
CREATE TABLE customer_credit_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id), -- Assuming customers table exists
  credit_limit DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  current_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Transactions / Statements
CREATE TABLE customer_credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES customer_credit_accounts(id),
  sale_id UUID, -- References sales table
  amount DECIMAL(12,2) NOT NULL,
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('CHARGE', 'PAYMENT', 'REFUND')),
  reference VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds & Returns
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_sale_id UUID,
  refunded_by UUID REFERENCES auth.users(id),
  authorized_by UUID REFERENCES auth.users(id), -- If manager approval was needed
  total_refunded DECIMAL(12,2) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE refund_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refund_id UUID REFERENCES refunds(id),
  product_id UUID,
  quantity INT NOT NULL,
  refund_amount DECIMAL(12,2) NOT NULL,
  return_to_stock BOOLEAN DEFAULT TRUE,
  condition VARCHAR(50) DEFAULT 'GOOD'
);

-- Price Override Audits
CREATE TABLE price_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID,
  product_id UUID,
  original_price DECIMAL(12,2),
  new_price DECIMAL(12,2),
  authorized_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
