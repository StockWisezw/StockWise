-- Advanced Customer Management Schema (CRM)

-- Enhanced Customers Table
CREATE TABLE customers_crm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) CHECK (type IN ('INDIVIDUAL', 'BUSINESS', 'WHOLESALE')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  shipping_address TEXT,
  vat_number VARCHAR(100),
  national_id VARCHAR(100),
  credit_limit DECIMAL(12,2) DEFAULT 0.00,
  balance DECIMAL(12,2) DEFAULT 0.00,
  loyalty_points INT DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'STANDARD' CHECK (tier IN ('STANDARD', 'SILVER', 'GOLD', 'VIP', 'WHOLESALE_PARTNER')),
  status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'INACTIVE')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Activity & Notes
CREATE TABLE customer_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers_crm(id),
  activity_type VARCHAR(50) CHECK (activity_type IN ('NOTE', 'CALL', 'EMAIL', 'MEETING', 'PURCHASE', 'PAYMENT', 'SUPPORT')),
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Loyalty Transactions
CREATE TABLE customer_loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers_crm(id),
  points INT NOT NULL,
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('EARNED', 'REDEEMED', 'EXPIRED', 'ADJUSTED')),
  reference_id UUID, -- Sale ID or Redemption ID
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications Log
CREATE TABLE customer_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers_crm(id),
  type VARCHAR(50) CHECK (type IN ('SMS', 'WHATSAPP', 'EMAIL')),
  status VARCHAR(50) CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'DELIVERED')),
  subject VARCHAR(255),
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
