-- Add Subscription columns to businesses table
ALTER TABLE public.businesses
ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'TRIAL',
ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'TRIAL',
ADD COLUMN subscription_end_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
ADD COLUMN max_users INT DEFAULT 2,
ADD COLUMN max_branches INT DEFAULT 1;

-- To make things easy for superadmin, lets set the existing business to active and unlimited 
-- if they use tapiwagahadza54@gmail.com. We can just set all existing ones to have a grace period just in case.
UPDATE public.businesses
SET subscription_status = 'TRIAL',
    subscription_end_date = NOW() + INTERVAL '7 days';

-- We will also want a generic table for subscription invoices or history later, 
-- but for now these columns on business are sufficient.
