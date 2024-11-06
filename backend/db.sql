
-- ADMINS
CREATE TABLE public.admin (
    admin_id character varying(255) NOT NULL,
    admin_name character varying(30),
    admin_email character varying(255),
    admin_password character varying(255),
    admin_2fa_secret VARCHAR(255),
    admin_2fa_enabled BOOLEAN DEFAULT false,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(10) DEFAULT 'admin'::character varying
);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (admin_id);



-- POS USERS
CREATE TABLE public.pos_users (
    pos_id character varying(255) NOT NULL,
    pos_name character varying(30),
    pos_password character varying(255),
    pos_status character varying(255),
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(10) DEFAULT 'staff'::character varying
    is_deleted BOOLEAN DEFAULT FALSE
);
ALTER TABLE ONLY public.pos_users
    ADD CONSTRAINT pos_users_pkey PRIMARY KEY (pos_id);



-- POS LOGS
CREATE TABLE pos_logs (
    log_id SERIAL PRIMARY KEY,
    pos_id VARCHAR(255) REFERENCES pos_users(pos_id),
    pos_name VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP
);


-- CATEGORY
CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL
);



-- ITEMS
CREATE TABLE items (
  item_id VARCHAR(255) PRIMARY KEY,
  category_id INT REFERENCES category(category_id),
  item_name VARCHAR(255) NOT NULL,
  item_price NUMERIC NOT NULL,
  item_cost NUMERIC NOT NULL,
  stock_count INT NOT NULL,
  low_stock_alert BOOLEAN,
  low_stock_count INT,
  add_part BOOLEAN,
  bike_parts VARCHAR(255),
  item_image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bb_bu_status BOOLEAN DEFAULT FALSE,
  status BOOLEAN DEFAULT TRUE
  is_deleted BOOLEAN DEFAULT FALSE
);



-- WAITLIST
CREATE TABLE waitlist (
  waitlist_item_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- FRAME
CREATE TABLE frame (
  frame_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  frame_size VARCHAR(50) NOT NULL,
  head_tube_type VARCHAR(50) NOT NULL,
  head_tube_upper_diameter VARCHAR(50) NOT NULL,
  head_tube_lower_diameter VARCHAR(50) NOT NULL,
  seatpost_diameter VARCHAR(50) NOT NULL,
  axle_type VARCHAR(50) NOT NULL,
  axle_diameter VARCHAR(50) NOT NULL,
  bottom_bracket_type VARCHAR(50) NOT NULL,
  bottom_bracket_width VARCHAR(50) NOT NULL,
  rotor_size VARCHAR(50) NOT NULL,
  max_tire_width FLOAT NOT NULL,
  rear_hub_width VARCHAR(50) NOT NULL,
  material VARCHAR(100) NOT NULL,
  image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);



-- FORK
CREATE TABLE fork (
  fork_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  fork_size VARCHAR(50) NOT NULL,
  fork_tube_type VARCHAR(50) NOT NULL,
  fork_tube_upper_diameter VARCHAR(50) NOT NULL,
  fork_tube_lower_diameter VARCHAR(50) NOT NULL,
  fork_travel VARCHAR(50) NOT NULL,
  axle_type VARCHAR(50) NOT NULL,
  axle_diameter VARCHAR(50) NOT NULL,
  suspension_type VARCHAR(50) NOT NULL,
  rotor_size VARCHAR(50) NOT NULL,
  max_tire_width FLOAT() NOT NULL,
  front_hub_width VARCHAR(50) NOT NULL,
  material VARCHAR(100) NOT NULL,
  image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);



-- GROUSET
CREATE TABLE groupset (
  groupset_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  chainring_speed VARCHAR(50) NOT NULL,
  crank_arm_length VARCHAR(50) NOT NULL,
  front_derailleur_speed VARCHAR(50) NOT NULL,
  rear_derailleur_speed VARCHAR(50) NOT NULL,
  cassette_type VARCHAR(50) NOT NULL,
  cassette_speed VARCHAR(50) NOT NULL,
  chain_speed VARCHAR(50) NOT NULL,
  bottom_bracket_type VARCHAR(50) NOT NULL,
  bottom_bracket_width VARCHAR(50) NOT NULL,
  brake_type VARCHAR(50) NOT NULL,
  rotor_mount_type VARCHAR(50) NOT NULL,
  rotor_size VARCHAR(50) NOT NULL,
  image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);



-- WHEELSET
CREATE TABLE wheelset (
  wheelset_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  hub_rotor_type VARCHAR(50) NOT NULL,
  hub_cassette_type VARCHAR(50) NOT NULL,
  hub_holes VARCHAR(50) NOT NULL,
  front_hub_width VARCHAR(50) NOT NULL,
  front_hub_axle_type VARCHAR(50) NOT NULL,
  front_hub_axle_diameter VARCHAR(50) NOT NULL,
  rear_hub_width VARCHAR(50) NOT NULL,
  rear_hub_axle_type VARCHAR(50) NOT NULL,
  rear_hub_axle_diameter VARCHAR(50) NOT NULL,
  rear_hub_speed VARCHAR(50) NOT NULL,
  tire_size VARCHAR(50) NOT NULL,
  tire_width FLOAT() NOT NULL,
  rim_spokes VARCHAR(50) NOT NULL,
  image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);



-- SEAT
CREATE TABLE seat (
  seat_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  seatpost_diameter VARCHAR(50) NOT NULL,
  seatpost_length VARCHAR(50) NOT NULL,
  seat_clamp_type VARCHAR(50) NOT NULL,
  saddle_material VARCHAR(50) NOT NULL,
  image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);



-- COCKPIT
CREATE TABLE cockpit (
  cockpit_id VARCHAR(255) PRIMARY KEY,
  item_id VARCHAR(255) REFERENCES items(item_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  handlebar_length VARCHAR(50) NOT NULL,
  handlebar_clamp_diameter VARCHAR(50) NOT NULL,
  handlebar_type VARCHAR(50) NOT NULL,
  stem_clamp_diameter VARCHAR(50) NOT NULL,
  stem_length VARCHAR(50) NOT NULL,
  stem_angle VARCHAR(50) NOT NULL,
  stem_fork_diameter VARCHAR(50) NOT NULL,
  headset_type VARCHAR(50) NOT NULL,
  headset_cup_type VARCHAR(50) NOT NULL,
  headset_upper_diameter VARCHAR(50) NOT NULL,
  headset_lower_diameter VARCHAR(50) NOT NULL,
  image BYTEA,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);



-- MECHANICS
CREATE TABLE public.mechanics (
    mechanic_id character varying(255) NOT NULL,
    mechanic_name character varying(255),
    mechanic_image BYTEA,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status boolean DEFAULT true
    is_deleted BOOLEAN DEFAULT FALSE
);
ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT mechanics_pkey PRIMARY KEY (mechanic_id);



-- SALES
CREATE TABLE public.sales (
    sale_id character varying(255) NOT NULL,
    pos_id character varying(255),
    sale_amount integer,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status boolean DEFAULT true
);
ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);
ALTER TABLE ONLY public.sales
    ADD CONSTRAINT pos_id FOREIGN KEY (pos_id) REFERENCES public.pos_users(pos_id) ON UPDATE CASCADE ON DELETE CASCADE;



-- SALES MECHANICS
CREATE TABLE public.sales_mechanics (
    sale_service_id character varying(255) NOT NULL,
    sale_id character varying(255),
    pos_id character varying(255),
    mechanic_id character varying(255),
    service_price integer,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE ONLY public.sales_mechanics
    ADD CONSTRAINT sales_mechanics_pkey PRIMARY KEY (sale_service_id);
ALTER TABLE ONLY public.sales_mechanics
    ADD CONSTRAINT mechanic_id FOREIGN KEY (mechanic_id) REFERENCES public.mechanics(mechanic_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.sales_mechanics
    ADD CONSTRAINT pos_id FOREIGN KEY (pos_id) REFERENCES public.pos_users(pos_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.sales_mechanics
    ADD CONSTRAINT sale_id FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON UPDATE CASCADE ON DELETE CASCADE;



-- SALES ITEMS
CREATE TABLE public.sales_items (
    sale_item_id character varying(255) NOT NULL,
    sale_id character varying(255),
    pos_id character varying(255),
    item_id character varying(255),
    item_qty integer,
    item_unit_price integer,
    item_total_price integer,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sale_item_type character varying(10) DEFAULT 'sale'::character varying,
    refund_qty integer DEFAULT 0
);
ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_pkey PRIMARY KEY (sale_item_id);
ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT item_id FOREIGN KEY (item_id) REFERENCES public.items(item_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT pos_id FOREIGN KEY (pos_id) REFERENCES public.pos_users(pos_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sale_id FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON UPDATE CASCADE ON DELETE CASCADE;



-- RECEIPTS
CREATE TABLE public.receipts (
    receipt_id character varying(255) NOT NULL,
    sale_id character varying(255),
    pos_id character varying(255),
    receipt_name character varying(255),
    receipt_total_cost integer,
    receipt_paid_amount integer,
    receipt_change integer,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(10) DEFAULT 'active'::character varying,
    receipt_type character varying(10) DEFAULT 'sale'::character varying,
    refund_id character varying(255) DEFAULT 'none'::character varying
);
ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (receipt_id);
ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT pos_id FOREIGN KEY (pos_id) REFERENCES public.pos_users(pos_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT sale_id FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON UPDATE CASCADE ON DELETE CASCADE;



-- EXPENSES
CREATE TABLE public.expenses (
    expense_id character varying(255) NOT NULL,
    pos_id character varying(255),
    expense_name character varying(128),
    expense_amount integer,
    expense_image bytea,
    status character varying(10) DEFAULT 'active'::character varying,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);
ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT pos_id FOREIGN KEY (pos_id) REFERENCES public.pos_users(pos_id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY,
    payment_id VARCHAR(255),
	checkout_session_id VARCHAR(255),
	order_name VARCHAR(255),
    order_amount DECIMAL(10, 2) DEFAULT 0,
    cust_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
	payment_type VARCHAR(128) DEFAULT 'gcash',
    cust_address VARCHAR(255),
    payment_status VARCHAR(255),
    order_status VARCHAR(255), -- pending, processed
    bb_option VARCHAR(255), -- store-pickup or n/a
    bu_option VARCHAR(255), -- store-pickup or delivery
    tracking_number VARCHAR(50),
    courier VARCHAR(50),
    pickup_ready_date TIMESTAMP DEFAULT NULL,
    shipped_at TIMESTAMP DEFAULT NULL,
    processed_at TIMESTAMP DEFAULT NULL,
    completed_at TIMESTAMP DEFAULT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    item_id VARCHAR(255), 
    item_qty INTEGER,
    item_price DECIMAL(10, 2),
    build_id VARCHAR(255) DEFAULT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	part_type VARCHAR(255), -- bike builder or upgrader
	part VARCHAR(255), -- frame or fork or etc
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(order_id)
	ON UPDATE CASCADE 
	ON DELETE CASCADE,
    CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES items(item_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);


-- Forgot pass
CREATE TABLE password_reset_tokens (
	email VARCHAR(255),
	token VARCHAR(255),
	expires_at TIMESTAMP
)
