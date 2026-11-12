-- Run once to add branding/settings table
-- psql -U postgres -d coffeedb -f server/database/schema_brand.sql

CREATE TABLE IF NOT EXISTS brand_settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT         NOT NULL,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_brand_updated_at
  BEFORE UPDATE ON brand_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Default values
INSERT INTO brand_settings (key, value) VALUES
  ('shop_name',        'Black & Brown Coffee Shop'),
  ('tagline',          'Handcrafted Ethiopian Coffee Experience'),
  ('phone',            '+251 9XX XXX XXX'),
  ('email',            'info@blackandbrown.coffee'),
  ('address',          'Addis Ababa, Ethiopia'),
  ('instagram',        ''),
  ('telegram',         ''),
  ('facebook',         ''),
  ('delivery_fee',     '50'),
  ('free_delivery_min','500'),
  ('currency',         'birr'),
  ('exchange_rate',    '144.5'),
  ('hero_tagline',     'Experience the finest Ethiopian coffee'),
  ('about_text',       'We source the best beans from Ethiopian highlands and brew them with love.')
ON CONFLICT (key) DO NOTHING;
