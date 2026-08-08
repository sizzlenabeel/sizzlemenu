-- Only users with protected App Metadata { "role": "admin" } may write.
-- Public/read policies are intentionally left unchanged.

DROP POLICY IF EXISTS "products_auth_insert" ON public.products;
DROP POLICY IF EXISTS "products_auth_update" ON public.products;
DROP POLICY IF EXISTS "products_auth_delete" ON public.products;

CREATE POLICY "products_admin_insert" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "products_admin_update" ON public.products
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "products_admin_delete" ON public.products
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "locations_auth_insert" ON public.locations;
DROP POLICY IF EXISTS "locations_auth_update" ON public.locations;
DROP POLICY IF EXISTS "locations_auth_delete" ON public.locations;

CREATE POLICY "locations_admin_insert" ON public.locations
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "locations_admin_update" ON public.locations
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "locations_admin_delete" ON public.locations
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "production_auth_insert" ON public.production;
DROP POLICY IF EXISTS "production_auth_update" ON public.production;
DROP POLICY IF EXISTS "production_auth_delete" ON public.production;

CREATE POLICY "production_admin_insert" ON public.production
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "production_admin_update" ON public.production
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "production_admin_delete" ON public.production
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "allocations_auth_insert" ON public.allocations;
DROP POLICY IF EXISTS "allocations_auth_update" ON public.allocations;
DROP POLICY IF EXISTS "allocations_auth_delete" ON public.allocations;

CREATE POLICY "allocations_admin_insert" ON public.allocations
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "allocations_admin_update" ON public.allocations
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "allocations_admin_delete" ON public.allocations
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "requirements_auth_insert" ON public.requirements;
DROP POLICY IF EXISTS "requirements_auth_update" ON public.requirements;
DROP POLICY IF EXISTS "requirements_auth_delete" ON public.requirements;

CREATE POLICY "requirements_admin_insert" ON public.requirements
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "requirements_admin_update" ON public.requirements
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "requirements_admin_delete" ON public.requirements
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
