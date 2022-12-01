create extension if not exists "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.carts
(
    id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at date not null,
    updated_at date not null
);
CREATE TABLE IF NOT EXISTS public.cart_items
(
    cart_id    uuid REFERENCES carts (id),
    product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    count      int not null     default 0
);
CREATE TABLE IF NOT EXISTS public.users
(
    id       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name     text,
    email    text,
    password text
);