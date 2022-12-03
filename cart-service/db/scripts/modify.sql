/**
  Insert user_id field into carts table
 */
ALTER TABLE public.carts
    ADD  user_id  uuid REFERENCES users (id);