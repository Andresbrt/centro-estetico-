-- RLS policy setup for Centro de Experiencia Afro Maira Vásquez
-- Put this in Supabase SQL editor after applying the schema.

ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
      AND r.name = 'admin'
  );
$$;

-- Public data: allow public read on active items
CREATE POLICY "services_public_select" ON services
FOR SELECT USING (active = true);

CREATE POLICY "products_public_select" ON products
FOR SELECT USING (active = true);

CREATE POLICY "gallery_public_select" ON gallery
FOR SELECT USING (active = true);

CREATE POLICY "testimonials_public_select" ON testimonials
FOR SELECT USING (active = true);

CREATE POLICY "site_settings_public_select" ON site_settings
FOR SELECT USING (true);

CREATE POLICY "seo_pages_public_select" ON seo_pages
FOR SELECT USING (true);

CREATE POLICY "instagram_posts_public_select" ON instagram_posts
FOR SELECT USING (true);

CREATE POLICY "business_hours_public_select" ON business_hours
FOR SELECT USING (true);

CREATE POLICY "profiles_self_read" ON profiles
FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles_self_upsert" ON profiles
FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_self_update" ON profiles
FOR UPDATE USING (id = auth.uid() OR is_admin());

CREATE POLICY "services_admin_all" ON services
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "service_images_admin_all" ON service_images
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "products_admin_all" ON products
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "product_images_admin_all" ON product_images
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "gallery_admin_all" ON gallery
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "testimonials_admin_all" ON testimonials
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "transformations_admin_all" ON transformations
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "site_settings_admin_all" ON site_settings
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "seo_pages_admin_all" ON seo_pages
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "analytics_daily_admin_all" ON analytics_daily
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "bookings_customer_select" ON bookings
FOR SELECT USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "bookings_customer_insert" ON bookings
FOR INSERT WITH CHECK (customer_id = auth.uid() OR is_admin());

CREATE POLICY "bookings_customer_update" ON bookings
FOR UPDATE USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "orders_customer_select" ON orders
FOR SELECT USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "orders_customer_insert" ON orders
FOR INSERT WITH CHECK (profile_id = auth.uid() OR is_admin());

CREATE POLICY "orders_customer_update" ON orders
FOR UPDATE USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "cart_owner_all" ON cart_items
FOR ALL USING (profile_id = auth.uid() OR is_admin()) WITH CHECK (profile_id = auth.uid() OR is_admin());

CREATE POLICY "contact_messages_insert_public" ON contact_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_messages_admin_read" ON contact_messages
FOR SELECT USING (is_admin());

CREATE POLICY "contact_messages_admin_update" ON contact_messages
FOR UPDATE USING (is_admin());

CREATE POLICY "blocked_dates_admin_all" ON blocked_dates
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "business_hours_admin_all" ON business_hours
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "roles_admin_read" ON roles
FOR SELECT USING (is_admin());

CREATE POLICY "roles_admin_write" ON roles
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Admin seed values for initial setup.
-- Usa Supabase Auth para crear el usuario admin y luego vincula ese `id` con `profiles.role_id`.
