
-- =============================================
-- Restrict all write operations to authenticated users only
-- Keep public SELECT access for the menu display
-- =============================================

-- PRODUCTS: Drop the permissive ALL policy, replace with read-only public + auth writes
DROP POLICY IF EXISTS "access" ON products;
CREATE POLICY "products_public_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_auth_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_auth_update" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "products_auth_delete" ON products FOR DELETE TO authenticated USING (true);

-- LOCATIONS: Drop write policies, keep select
DROP POLICY IF EXISTS "locations_public_delete" ON locations;
DROP POLICY IF EXISTS "locations_public_insert" ON locations;
DROP POLICY IF EXISTS "locations_public_update" ON locations;
CREATE POLICY "locations_auth_insert" ON locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "locations_auth_update" ON locations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "locations_auth_delete" ON locations FOR DELETE TO authenticated USING (true);

-- PRODUCTION: Drop write policies, keep select
DROP POLICY IF EXISTS "production_public_delete" ON production;
DROP POLICY IF EXISTS "production_public_insert" ON production;
DROP POLICY IF EXISTS "production_public_update" ON production;
CREATE POLICY "production_auth_insert" ON production FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "production_auth_update" ON production FOR UPDATE TO authenticated USING (true);
CREATE POLICY "production_auth_delete" ON production FOR DELETE TO authenticated USING (true);

-- ALLOCATIONS: Drop write policies, keep select
DROP POLICY IF EXISTS "allocations_public_delete" ON allocations;
DROP POLICY IF EXISTS "allocations_public_insert" ON allocations;
DROP POLICY IF EXISTS "allocations_public_update" ON allocations;
CREATE POLICY "allocations_auth_insert" ON allocations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "allocations_auth_update" ON allocations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "allocations_auth_delete" ON allocations FOR DELETE TO authenticated USING (true);

-- REQUIREMENTS: Drop write policies, keep select
DROP POLICY IF EXISTS "requirements_public_delete" ON requirements;
DROP POLICY IF EXISTS "requirements_public_insert" ON requirements;
DROP POLICY IF EXISTS "requirements_public_update" ON requirements;
CREATE POLICY "requirements_auth_insert" ON requirements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "requirements_auth_update" ON requirements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "requirements_auth_delete" ON requirements FOR DELETE TO authenticated USING (true);
