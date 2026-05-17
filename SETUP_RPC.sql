-- Run this in your Supabase SQL editor to create the onboarding RPC function

CREATE OR REPLACE FUNCTION setup_new_user_business(
  new_business_name VARCHAR,
  new_first_name VARCHAR,
  new_last_name VARCHAR
) RETURNS JSONB AS $$
DECLARE
  new_business_id UUID;
  new_role_id UUID;
  user_id UUID;
  new_branch_id UUID;
  result JSONB;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Ensure profile exists
  INSERT INTO profiles (id, first_name, last_name)
  VALUES (user_id, new_first_name, new_last_name)
  ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name;

  -- Create Business
  INSERT INTO businesses (name) VALUES (new_business_name) RETURNING id INTO new_business_id;

  -- Create an Admin role
  INSERT INTO roles (business_id, name, description) VALUES (new_business_id, 'Admin', 'System Administrator') RETURNING id INTO new_role_id;

  -- Create a default branch
  INSERT INTO branches (business_id, name, type) VALUES (new_business_id, 'Main Branch', 'retail') RETURNING id INTO new_branch_id;

  -- Link user
  INSERT INTO business_users (business_id, user_id, branch_id, role_id) VALUES (new_business_id, user_id, new_branch_id, new_role_id);
  
  -- Create default categories
  INSERT INTO categories (business_id, name) VALUES (new_business_id, 'General');

  -- Create default subscription record
  INSERT INTO subscriptions (business_id, plan_name, status, start_date, end_date) 
  VALUES (new_business_id, 'free_trial', 'active', NOW(), NOW() + INTERVAL '7 days');
  
  result := jsonb_build_object(
    'business_id', new_business_id,
    'branch_id', new_branch_id,
    'role_id', new_role_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
