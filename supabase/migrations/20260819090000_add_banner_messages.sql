-- Scheduled customer-facing announcements.
CREATE TABLE public.banner_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL CHECK (length(trim(message)) > 0),
  link_label text,
  link_url text,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at > starts_at)
);

ALTER TABLE public.banner_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scheduled_banners_public_select" ON public.banner_messages
  FOR SELECT USING (starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

CREATE POLICY "banners_admin_all" ON public.banner_messages
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE INDEX banner_messages_schedule_idx
  ON public.banner_messages (starts_at, ends_at);
