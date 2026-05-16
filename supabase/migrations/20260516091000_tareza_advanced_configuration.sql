-- Migration for deep advanced settings
-- Includes: exchange rates, notification settings, languages, and theme preferences

-- Exchange rates history
CREATE TABLE IF NOT EXISTS exchange_rate_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_id UUID NOT NULL REFERENCES currencies(id) ON DELETE CASCADE,
    rate DECIMAL(15, 6) NOT NULL,
    rate_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Alter profiles to support localization and theme
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'Tareza Gold',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "sms": false}'::jsonb;

-- Notifications configuration (business level)
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'low_stock', 'daily_summary', 'new_user'
    channels JSONB NOT NULL DEFAULT '{"in_app": true, "email": false, "sms": false}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, type)
);

-- User Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pos Settings
CREATE TABLE IF NOT EXISTS pos_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    allow_offline BOOLEAN DEFAULT TRUE,
    require_pin_for_discount BOOLEAN DEFAULT FALSE,
    max_discount_percentage DECIMAL(5,2) DEFAULT 100.00,
    receipt_template JSONB DEFAULT '{"show_logo": true, "show_barcode": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id)
);

-- Security Settings
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    require_2fa BOOLEAN DEFAULT FALSE,
    session_timeout_minutes INTEGER DEFAULT 120,
    password_expiry_days INTEGER DEFAULT 90,
    allowed_ips TEXT[], 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id)
);

-- Seed defaults function for when a new business is created
CREATE OR REPLACE FUNCTION initialize_business_defaults()
RETURNS TRIGGER AS $$
DECLARE
    usd_id UUID;
    zig_id UUID;
    zar_id UUID;
BEGIN
    -- Only run for new inserts
    
    -- Insert Default Currencies
    INSERT INTO currencies (business_id, code, name, symbol, exchange_rate, is_base)
    VALUES (NEW.id, 'USD', 'US Dollar', '$', 1.0, TRUE)
    RETURNING id INTO usd_id;

    INSERT INTO currencies (business_id, code, name, symbol, exchange_rate, is_base)
    VALUES (NEW.id, 'ZWG', 'Zimbabwe Gold', 'ZiG', 13.56, FALSE)
    RETURNING id INTO zig_id;

    INSERT INTO currencies (business_id, code, name, symbol, exchange_rate, is_base)
    VALUES (NEW.id, 'ZAR', 'South African Rand', 'R', 18.50, FALSE)
    RETURNING id INTO zar_id;

    -- Update Business Base Currency
    UPDATE businesses SET base_currency_id = usd_id WHERE id = NEW.id;

    -- Insert Security Settings
    INSERT INTO security_settings (business_id) VALUES (NEW.id);

    -- Insert Default POS Settings for any existing branches
    INSERT INTO pos_settings (business_id, branch_id)
    SELECT NEW.id, id FROM branches WHERE business_id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to businesses
DROP TRIGGER IF EXISTS trg_initialize_business_defaults ON businesses;
CREATE TRIGGER trg_initialize_business_defaults
AFTER INSERT ON businesses
FOR EACH ROW
EXECUTE FUNCTION initialize_business_defaults();

-- RLS
ALTER TABLE exchange_rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view exchange rate history" ON exchange_rate_history FOR SELECT USING (
    currency_id IN (SELECT id FROM currencies WHERE business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid()))
);

CREATE POLICY "Users can view notification settings" ON notification_settings FOR SELECT USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (
    user_id = auth.uid()
);

CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (
    user_id = auth.uid()
);

CREATE POLICY "Users can view pos settings" ON pos_settings FOR SELECT USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can view security settings" ON security_settings FOR SELECT USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
);
