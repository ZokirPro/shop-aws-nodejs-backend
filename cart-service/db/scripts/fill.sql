INSERT INTO public.users (id,name, email, password) values
    ('8e6f31c0-730d-11ed-a1eb-0242ac120002','zokir', 'zokir@gmail.com', 'TEST_PASSWORD'),
    ('8e6f3580-730d-11ed-a1eb-0242ac120002','test', 'test@example.com', 'test');

INSERT INTO public.carts (id, user_id, created_at, updated_at) values
('8e6f3738-730d-11ed-a1eb-0242ac120002','8e6f31c0-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19'),
('8e6f39ae-730d-11ed-a1eb-0242ac120002','8e6f31c0-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19'),
('8e6f3ada-730d-11ed-a1eb-0242ac120002','8e6f3580-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19'),
('8e6f3ea4-730d-11ed-a1eb-0242ac120002','8e6f3580-730d-11ed-a1eb-0242ac120002','2022-11-19', '2022-11-19');

INSERT INTO public.cart_items (cart_id, product_id, count) values
('8e6f3738-730d-11ed-a1eb-0242ac120002', '5b625b80-61a7-4f4f-8c6e-4f623a049aa1', 2),
('8e6f39ae-730d-11ed-a1eb-0242ac120002', '5b625b80-61a7-4f4f-8c6e-4f623a049aa1', 2),
('8e6f3ada-730d-11ed-a1eb-0242ac120002', 'cb829089-e5fe-4c75-8cb0-d2039e27cba7', 1),
('8e6f3ea4-730d-11ed-a1eb-0242ac120002', '5b625b80-61a7-4f4f-8c6e-4f623a049aa1', 2);