-- Remove email column from profiles table (it duplicates auth.users.email)
-- This reduces PII exposure surface

ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Add validation constraints to portfolios table to prevent invalid data
ALTER TABLE public.portfolios 
  ADD CONSTRAINT portfolios_shares_positive CHECK (shares > 0),
  ADD CONSTRAINT portfolios_avg_cost_positive CHECK (avg_cost > 0),
  ADD CONSTRAINT portfolios_symbol_format CHECK (symbol ~ '^[A-Z]{1,5}$');

-- Add validation constraints to vehicle_orders to ensure data integrity  
ALTER TABLE public.vehicle_orders
  ADD CONSTRAINT vehicle_orders_total_price_positive CHECK (total_price > 0);

-- Add a DELETE policy for vehicle_orders so users can cancel their own orders
CREATE POLICY "Users can cancel their own orders"
ON public.vehicle_orders
FOR DELETE
USING (auth.uid() = user_id);