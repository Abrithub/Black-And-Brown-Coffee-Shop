-- ============================================================
-- Black & Brown Coffee Shop — PostgreSQL Schema
-- Run once: psql -U postgres -d coffeedb -f schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── COFFEES / PRODUCTS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS coffees (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(150) NOT NULL,
  origin         VARCHAR(100) DEFAULT 'Unknown',
  price          NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  description    TEXT,
  image          VARCHAR(255),
  category       VARCHAR(50)  DEFAULT 'Beverage'
                   CHECK (category IN (
                     'Coffee Beans','Brewing Equipment','Accessories',
                     'Additives','Coffee Capsules','Subscription','Decor','Beverage'
                   )),
  rating         NUMERIC(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  stock          INTEGER      DEFAULT 0 CHECK (stock >= 0),
  featured       BOOLEAN      DEFAULT FALSE,
  weight         VARCHAR(50),
  roast_level    VARCHAR(20)  DEFAULT ''
                   CHECK (roast_level IN ('Light','Medium','Dark','')),
  flavor_profile TEXT[]       DEFAULT '{}',
  material       VARCHAR(100),
  capacity       VARCHAR(50),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name    VARCHAR(150) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(30)  DEFAULT '',
  shipping_address TEXT         DEFAULT '',
  total            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  status           VARCHAR(20)  NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','processing','completed','cancelled')),
  payment_method   VARCHAR(20)  NOT NULL
                     CHECK (payment_method IN ('Card','Telebirr','CBE','Cash','Chapa')),
  payment_meta     JSONB        DEFAULT '{}',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── ORDER ITEMS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  coffee_id  UUID REFERENCES coffees(id) ON DELETE SET NULL,
  name       VARCHAR(150) NOT NULL,
  quantity   INTEGER      NOT NULL CHECK (quantity >= 1),
  price      NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_customer_id  ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at   ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_coffees_category    ON coffees(category);
CREATE INDEX IF NOT EXISTS idx_coffees_featured    ON coffees(featured);

-- ─── AUTO-UPDATE updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_coffees_updated_at
  BEFORE UPDATE ON coffees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
