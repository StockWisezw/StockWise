-- 0006_advanced_settings.sql

-- Add some columns to businesses
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS vat_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS company_registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS invoice_footer TEXT,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'Africa/Harare',
ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{"theme": "light", "primaryColor": "#6366f1"}'::jsonb;

-- Currencies
CREATE TABLE IF NOT EXISTS currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    code VARCHAR(3) NOT NULL, -- USD, ZWG, ZAR
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    exchange_rate DECIMAL(15, 6) NOT NULL DEFAULT 1.0,
    is_base BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alter businesses to reference currencies
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS base_currency_id UUID REFERENCES currencies(id);

-- Tax Rates
CREATE TABLE IF NOT EXISTS tax_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., VAT Standard, VAT Zero, Exempt
    rate DECIMAL(5, 2) NOT NULL, -- 15.00 for 15%
    type VARCHAR(50) NOT NULL DEFAULT 'percentage', 
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branch enhancements
ALTER TABLE branches
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'retail', -- retail, warehouse, etc
ADD COLUMN IF NOT EXISTS tax_group_id UUID REFERENCES tax_rates(id),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- Cash, EcoCash, Swipe, USD Cash
    type VARCHAR(50) NOT NULL, -- cash, mobile_money, card, etc.
    currency_id UUID REFERENCES currencies(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fiscalisation Settings (ZIMRA)
CREATE TABLE IF NOT EXISTS fiscal_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'zimra',
    api_url TEXT,
    api_key TEXT,
    cert_path TEXT,
    device_model VARCHAR(100),
    device_serial VARCHAR(100),
    receipt_header TEXT,
    receipt_footer TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id)
);

-- Chat System (Internal Communication)
CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'public', -- public, private, direct
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
