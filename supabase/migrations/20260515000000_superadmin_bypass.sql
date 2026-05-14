-- Setup Superadmin bypass for tapiwagahadza54@gmail.com

CREATE OR REPLACE FUNCTION auth_user_businesses()
RETURNS SETOF UUID AS $$
BEGIN
  IF (auth.jwt() ->> 'email') = 'tapiwagahadza54@gmail.com' THEN
    -- Superadmin gets access to all business IDs
    RETURN QUERY SELECT id FROM public.businesses;
  ELSE
    -- Normal user gets access to their assigned businesses
    RETURN QUERY SELECT business_id FROM public.business_users WHERE user_id = auth.uid() AND deleted_at IS NULL;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;
