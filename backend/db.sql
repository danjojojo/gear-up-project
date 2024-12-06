
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

-- RESTOCK LOGS
CREATE TABLE restock_logs (
    restock_id SERIAL PRIMARY KEY,
    item_id VARCHAR(255),
    stock_added INT,
    stock_before INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES items(item_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
)

-- Settings
CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,          
    setting_key VARCHAR(255) UNIQUE NOT NULL, 
    setting_value TEXT NOT NULL,                                  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                 
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,     
    name VARCHAR(255),                      
    profile_picture TEXT,                   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,                   
    user_id VARCHAR(255) NOT NULL,
    item_id VARCHAR(255),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,                       
    image BYTEA,              
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES items(item_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Alter table orders
ALTER TABLE orders
ADD COLUMN user_id VARCHAR(255) DEFAULT NULL REFERENCES users(google_id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Alter table order_items
ALTER TABLE order_items
ADD COLUMN review_id INT DEFAULT NULL REFERENCES reviews(review_id) ON UPDATE CASCADE ON DELETE SET NULL; -- Link to reviews

-- Add image on reviews
ALTER TABLE reviews
ADD COLUMN image BYTEA;


-- Add total rating and reviews_count on items
ALTER TABLE items
ADD COLUMN total_rating INT DEFAULT 0;
ALTER TABLE items
ADD COLUMN reviews_count INT DEFAULT 0;


-- New orders
CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) DEFAULT NULL REFERENCES users(google_id) ON UPDATE CASCADE ON DELETE SET NULL, -- NULL for guest orders
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
    bb_option VARCHAR(255),
    bu_option VARCHAR(255),
    tracking_number VARCHAR(50),
    courier VARCHAR(50),
    pickup_ready_date TIMESTAMP DEFAULT NULL,
    shipped_at TIMESTAMP DEFAULT NULL,
    processed_at TIMESTAMP DEFAULT NULL,
    completed_at TIMESTAMP DEFAULT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Insert settings
INSERT INTO settings (setting_key, setting_value)
VALUES
    ('default_threshold', '5'),
	('mechanic_percentage', '80'),
    ('display_stock_level_pos', 'yes')

-- Bike types
CREATE TABLE bike_types (
	bike_type_id SERIAL PRIMARY KEY,
	bike_type_name VARCHAR(50),
	bike_type_tag VARCHAR(10),
	bike_type_image BYTEA
)

-- Insert bike types
INSERT INTO bike_types (bike_type_name, bike_type_tag) VALUES 
('Mountain Bike', 'mtb'),
('Road Bike', 'rb');

-- Linking table
CREATE TABLE part_compatibility (
    compatibility_id SERIAL PRIMARY KEY,       -- Unique ID for each relationship
    bike_type_id INT REFERENCES bike_types(bike_type_id) ON DELETE CASCADE,  -- Link to bike_types table
    part_id VARCHAR(255) NOT NULL,            -- Unique ID of the specific part (e.g., frame_id, fork_id)
    part_type VARCHAR(50) NOT NULL,           -- The type of part (e.g., 'frame', 'fork')
    UNIQUE (bike_type_id, part_id, part_type) -- Ensure no duplicate relationships
);

-- Insert parts with bike types
INSERT INTO part_compatibility (bike_type_id, part_id, part_type)
VALUES
-- Frames
(1, 'frame-1b78bfc0-1951-4033-90ef-7f6976ea1b0e', 'frame'),
(1, 'frame-5cdf8d3e-35ec-40dc-8bca-971ae2e380cb', 'frame'),
(1, 'frame-cd2d3ae1-e80f-4cc1-867e-6def6a86ee0b', 'frame'),
(1, 'frame-91c0118b-8b0e-49d3-8ce4-ab2dbf53ef2a', 'frame'),
(1, 'frame-8e3b382c-18fd-4691-a344-b57f7122b88b', 'frame'),
(1, 'frame-e8a78c46-b703-468d-9fa8-e3754c5a28e8', 'frame'),
-- Forks
(1, 'fork-39ea4bd6-28eb-48e7-a584-16e10ddceac1', 'fork'),
(1, 'fork-8f6a425a-b390-4566-9517-0944c5c1d734', 'fork'),
(1, 'fork-c4de257d-3360-4cd3-ae16-0f3004532627', 'fork'),
-- Groupsets
(1, 'groupset-279a02c0-9967-4c68-ba2c-9c302fdf38d1', 'groupset'),
-- Wheelsets
(1, 'wheelset-72818ba9-8404-4024-88d5-237d1e5c3f4a', 'wheelset'),
-- Seats
(1, 'seat-3c98ae1c-7645-423e-ae72-e99ba1a2b1dc', 'seat'),
-- Cockpits
(1, 'cockpit-91d239f8-b73d-41c9-ad0a-e93485cd2787', 'cockpit');

-- Add is_deleted column to all tables
ALTER TABLE frame
ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE fork
ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE groupset
ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE wheelset
ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE seat
ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE cockpit
ADD COLUMN is_deleted BOOLEAN DEFAULT false;

CREATE TABLE compatibility (
    compatibility_id SERIAL PRIMARY KEY,
    ind_part VARCHAR(128) NOT NULL,
    dep_part VARCHAR(128) NOT NULL,
    ind_spec VARCHAR(128) NOT NULL,
    dep_spec VARCHAR(128) NOT NULL,
    operation VARCHAR(128) NOT NULL
)

CREATE TABLE all_parts (
	part_id SERIAL PRIMARY KEY,
	part_name VARCHAR(128) NOT NULL
)

INSERT INTO all_parts (part_name) VALUES
('Frame'),
('Fork'),
('Groupset'),
('Wheelset'),
('Seat'),
('Cockpit');

-- Bike Upgrader Specs Set
CREATE TABLE compatibility_specs (
    spec_id SERIAL PRIMARY KEY,
	bike_type_id INT REFERENCES bike_types(bike_type_id) ON DELETE CASCADE,  -- Link to bike_types table,
	ref_spec_id INT,
    part_type_from VARCHAR(50) NOT NULL, -- e.g., "frame"
    part_type_to VARCHAR(50) NOT NULL,   -- e.g., "fork"
    attribute_from VARCHAR(50) NOT NULL, -- e.g., "purpose"
    attribute_to VARCHAR(50) NOT NULL    -- e.g., "fork_travel"
);

CREATE TABLE form_options (
    option_id SERIAL PRIMARY KEY,           -- Unique ID for each option
    attribute_name VARCHAR(50) NOT NULL,    -- Attribute name (e.g., "purpose")
    option_value VARCHAR(255) NOT NULL      -- Possible value for the attribute (e.g., "Cross-country (XC)")
);

CREATE TABLE part_attributes (
    attribute_id SERIAL PRIMARY KEY,        -- Unique ID for each attribute
    part_type VARCHAR(50) NOT NULL,         -- Part type (e.g., "frame")
    attribute_name VARCHAR(50) NOT NULL     -- Attribute name (e.g., "purpose")
);

CREATE TABLE bike_builds (
    build_id VARCHAR(255) PRIMARY KEY,
    build_name VARCHAR(255),
    build_image BYTEA,
    build_price DECIMAL(10, 2),
    frame_id VARCHAR(255) REFERENCES frame(frame_id),
    fork_id VARCHAR(255) REFERENCES fork(fork_id),
    groupset_id VARCHAR(255) REFERENCES groupset(groupset_id),
    wheelset_id VARCHAR(255) REFERENCES wheelset(wheelset_id),
    seat_id VARCHAR(255) REFERENCES seat(seat_id),
    cockpit_id VARCHAR(255) REFERENCES cockpit(cockpit_id),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


-- #####################
-- ###  VIEWS  VER 1 ###
-- #####################


-- POS SOLD ITEMS
CREATE OR REPLACE VIEW pos_sales_view AS
SELECT 
    i.item_id,
    SUM(
        CASE 
            WHEN refund_qty = 0 THEN item_qty
            WHEN refund_qty = item_qty THEN 0
            ELSE (item_qty - refund_qty)
        END
    ) AS sold_qty,
    SUM(
        CASE 
            WHEN refund_qty = 0 THEN item_qty
            WHEN refund_qty = item_qty THEN 0
            ELSE (item_qty - refund_qty)
        END
    ) / 30 AS avg_sold_qty,
    MAX(
        CASE 
            WHEN refund_qty = 0 THEN item_qty
            WHEN refund_qty = item_qty THEN 0
            ELSE (item_qty - refund_qty)
        END
    ) AS max_sold_qty
FROM 
    sales_items si
LEFT JOIN 
    items i ON si.item_id = i.item_id
LEFT JOIN 
    sales s ON si.sale_id = s.sale_id
WHERE
    si.date_created >= CURRENT_DATE - INTERVAL '30 days'
    AND s.status = true 
    AND si.sale_item_type = 'sale'
GROUP BY
    i.item_id;


-- ORDER ITEMS
CREATE OR REPLACE VIEW order_sales_view AS
SELECT
	i.item_id,
	SUM(item_qty) AS sold_qty,
	SUM(item_qty) / 30 AS avg_sold_qty,
	MAX(item_qty) AS max_sold_qty
FROM
	order_items oi
LEFT JOIN
	items i ON oi.item_id = i.item_id
WHERE
	oi.date_created >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY
	i.item_id;


-- COMBINED POS AND ORDER ITEMS
CREATE OR REPLACE VIEW sold_qty_view AS
SELECT
	i.item_id,
	COALESCE(ps.max_sold_qty, 0) + COALESCE(os.max_sold_qty, 0) AS max_sold_qty,
	(COALESCE(ps.sold_qty, 0) + COALESCE(os.sold_qty, 0)) / 30 AS avg_sold_qty
FROM
	items i
LEFT JOIN
	pos_sales_view ps ON i.item_id = ps.item_id
LEFT JOIN
	order_sales_view os ON i.item_id = os.item_id
GROUP BY
	i.item_id, ps.max_sold_qty, os.max_sold_qty, ps.sold_qty, os.sold_qty;


-- LEAD TIME FROM RESTOCK LOGS
CREATE OR REPLACE VIEW lead_times_view AS
SELECT 
	rl.item_id,
	EXTRACT(EPOCH FROM rl.date_created - LAG(rl.date_created) OVER (PARTITION BY rl.item_id ORDER BY rl.date_created)) / 86400 AS lead_time_days
FROM 
	restock_logs rl;


-- LEAD TIME SUMMARY
CREATE OR REPLACE VIEW lead_time_summary_view AS
SELECT 
    item_id,
    ROUND(AVG(lead_time_days)) AS avg_lead_time_days,
    ROUND(MAX(lead_time_days)) AS max_lead_time_days,
    ROUND(
        EXTRACT(epoch FROM (MAX(date_created) - MAX(prev_date_created))) / 86400::numeric
    ) AS recent_lead_time_days
FROM (
    SELECT 
        item_id,
        date_created,
        LAG(date_created) OVER (PARTITION BY item_id ORDER BY date_created ASC) AS prev_date_created,
        EXTRACT(epoch FROM date_created - LAG(date_created) OVER (PARTITION BY item_id ORDER BY date_created ASC)) / 86400::numeric AS lead_time_days
    FROM restock_logs
) lead_times
WHERE lead_time_days IS NOT NULL
GROUP BY item_id;


-- REORDER POINT
CREATE OR REPLACE VIEW rop_summary_view AS
SELECT
	i.item_id,
	COALESCE(sq.avg_sold_qty, 0) * COALESCE(lts.avg_lead_time_days, 0) AS lead_time_demand,
	(COALESCE(sq.max_sold_qty, 0) * COALESCE(lts.max_lead_time_days, 0)) - (COALESCE(sq.avg_sold_qty, 0) * COALESCE(lts.avg_lead_time_days, 0)) AS safety_stock
FROM 
	items i
LEFT JOIN
	sold_qty_view sq ON i.item_id = sq.item_id
LEFT JOIN
	lead_time_summary_view lts ON i.item_id = lts.item_id
GROUP BY i.item_id, max_sold_qty, avg_sold_qty, avg_lead_time_days, max_lead_time_days;

-- #####################
-- ###  VIEWS  VER 2 ###
-- #####################

-- POS ITEMS
CREATE OR REPLACE VIEW pos_sales_view AS
    WITH recent_data AS (
        SELECT 
            i.item_id,
            SUM(
                CASE 
                    WHEN refund_qty = 0 THEN item_qty
                    WHEN refund_qty = item_qty THEN 0
                    ELSE (item_qty - refund_qty)
                END
            ) AS recent_sold_qty,
            MAX(
                CASE 
                    WHEN refund_qty = 0 THEN item_qty
                    WHEN refund_qty = item_qty THEN 0
                    ELSE (item_qty - refund_qty)
                END
            ) AS recent_max_sold_qty,
            COUNT(DISTINCT DATE(si.date_created)) AS recent_sale_days
        FROM 
            sales_items si
        JOIN 
            items i ON si.item_id = i.item_id
        WHERE
            si.date_created >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY 
            i.item_id
    ),
    all_time_data AS (
        SELECT 
            i.item_id,
            SUM(
                CASE 
                    WHEN refund_qty = 0 THEN item_qty
                    WHEN refund_qty = item_qty THEN 0
                    ELSE (item_qty - refund_qty)
                END
            ) AS all_time_sold_qty,
            MAX(
                CASE 
                    WHEN refund_qty = 0 THEN item_qty
                    WHEN refund_qty = item_qty THEN 0
                    ELSE (item_qty - refund_qty)
                END
            ) AS all_time_max_sold_qty,
            COUNT(DISTINCT DATE(si.date_created)) AS all_time_sale_days
        FROM 
            sales_items si
        JOIN 
            items i ON si.item_id = i.item_id
        GROUP BY 
            i.item_id
    )
    SELECT 
        i.item_id,
        i.item_name,
        COALESCE(r.recent_sold_qty, 0) AS recent_sold_qty,
        COALESCE(r.recent_max_sold_qty, 0) AS recent_max_sold_qty,
        COALESCE(r.recent_sale_days, 0) AS recent_sale_days,
        COALESCE(a.all_time_sold_qty, 0) AS all_time_sold_qty,
        COALESCE(a.all_time_max_sold_qty, 0) AS all_time_max_sold_qty,
        COALESCE(a.all_time_sale_days, 0) AS all_time_sale_days,
        -- Weighted Average Daily Sold Units
        GREATEST(
            COALESCE(r.recent_max_sold_qty, 0),
            COALESCE(a.all_time_max_sold_qty, 0)
        ) AS max_sold_qty,
        ROUND(
            0.7 * COALESCE(r.recent_sold_qty, 0) / NULLIF(r.recent_sale_days, 0) + 
            0.3 * COALESCE(a.all_time_sold_qty, 0) / NULLIF(a.all_time_sale_days, 0),
            2
        ) AS avg_sold_qty
    FROM 
        recent_data r
    LEFT JOIN 
        all_time_data a
    ON 
        r.item_id = a.item_id
    LEFT JOIN
        items i
    ON 
        r.item_id = i.item_id
    ORDER BY 
        avg_sold_qty DESC;

-- ORDER ITEMS
CREATE OR REPLACE VIEW order_sales_view AS
    WITH recent_data AS (
        SELECT 
            i.item_id,
            SUM(item_qty) AS recent_sold_qty,
            MAX(item_qty) AS recent_max_sold_qty,
            COUNT(DISTINCT DATE(si.date_created)) AS recent_sale_days
        FROM 
            order_items oi
        JOIN 
            items i ON oi.item_id = i.item_id
        WHERE
            oi.date_created >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY 
            i.item_id
    ),
    all_time_data AS (
        SELECT 
            i.item_id,
            SUM(item_qty) AS all_time_sold_qty,
            MAX(item_qty) AS all_time_max_sold_qty,
            COUNT(DISTINCT DATE(oi.date_created)) AS all_time_sale_days
        FROM 
            order_items oi
        JOIN 
            items i ON oi.item_id = i.item_id
        GROUP BY 
            i.item_id
    )
    SELECT 
        i.item_id,
        i.item_name,
        COALESCE(r.recent_sold_qty, 0) AS recent_sold_qty,
        COALESCE(r.recent_max_sold_qty, 0) AS recent_max_sold_qty,
        COALESCE(r.recent_sale_days, 0) AS recent_sale_days,
        COALESCE(a.all_time_sold_qty, 0) AS all_time_sold_qty,
        COALESCE(a.all_time_max_sold_qty, 0) AS all_time_max_sold_qty,
        COALESCE(a.all_time_sale_days, 0) AS all_time_sale_days,
        -- Weighted Average Daily Sold Units
        GREATEST(
            COALESCE(r.recent_max_sold_qty, 0),
            COALESCE(a.all_time_max_sold_qty, 0)
        ) AS max_sold_qty,
        ROUND(
            0.7 * COALESCE(r.recent_sold_qty, 0) / NULLIF(r.recent_sale_days, 0) + 
            0.3 * COALESCE(a.all_time_sold_qty, 0) / NULLIF(a.all_time_sale_days, 0),
            2
        ) AS avg_sold_qty
    FROM 
        recent_data r
    LEFT JOIN 
        all_time_data a
    ON 
        r.item_id = a.item_id
    LEFT JOIN
        items i
    ON 
        r.item_id = i.item_id
    ORDER BY 
        avg_sold_qty DESC;


-- COMBINED POS AND ORDER ITEMS
CREATE OR REPLACE VIEW sold_qty_view AS
    SELECT
        i.item_id,
        GREATEST(
            COALESCE(ps.recent_max_sold_qty, 0),
            COALESCE(ps.all_time_max_sold_qty, 0),
            COALESCE(os.recent_max_sold_qty, 0),
            COALESCE(os.all_time_max_sold_qty, 0)
        ) AS max_sold_qty,
        ROUND(
            (
                0.7 * COALESCE(ps.avg_sold_qty, 0) +
                0.3 * COALESCE(os.avg_sold_qty, 0)
            ),
            2
        ) AS avg_sold_qty
    FROM
        items i
    LEFT JOIN
        pos_sales_view ps ON i.item_id = ps.item_id
    LEFT JOIN
        order_sales_view os ON i.item_id = os.item_id
    GROUP BY
        i.item_id, i.item_name, ps.recent_max_sold_qty, ps.all_time_max_sold_qty,
        os.recent_max_sold_qty, os.all_time_max_sold_qty,
        ps.avg_sold_qty, os.avg_sold_qty;

-- LEAD TIME FROM RESTOCK LOGS
CREATE OR REPLACE VIEW lead_times_view AS
SELECT 
	rl.item_id,
	EXTRACT(EPOCH FROM rl.date_created - LAG(rl.date_created) OVER (PARTITION BY rl.item_id ORDER BY rl.date_created)) / 86400 AS lead_time_days
FROM 
	restock_logs rl;


-- LEAD TIME SUMMARY
CREATE OR REPLACE VIEW lead_time_summary_view AS
SELECT 
    item_id,
    ROUND(AVG(lead_time_days)) AS avg_lead_time_days,
    ROUND(MAX(lead_time_days)) AS max_lead_time_days,
    ROUND(
        FIRST_VALUE(lead_time_days) OVER (PARTITION BY item_id ORDER BY date_created DESC)
    ) AS recent_lead_time_days
FROM (
    SELECT 
        item_id,
        date_created,
        LAG(date_created) OVER (PARTITION BY item_id ORDER BY date_created ASC) AS prev_date_created,
        EXTRACT(EPOCH FROM date_created - LAG(date_created) OVER (PARTITION BY item_id ORDER BY date_created ASC)) / 86400::numeric AS lead_time_days
    FROM restock_logs
) lead_times
WHERE lead_time_days IS NOT NULL
GROUP BY item_id;


-- REORDER POINT
CREATE OR REPLACE VIEW rop_summary_view AS
SELECT
	i.item_id,
	COALESCE(sq.avg_sold_qty, 0) * COALESCE(lts.avg_lead_time_days, 0) AS lead_time_demand,
	(COALESCE(sq.max_sold_qty, 0) * COALESCE(lts.max_lead_time_days, 0)) - (COALESCE(sq.avg_sold_qty, 0) * COALESCE(lts.avg_lead_time_days, 0)) AS safety_stock
FROM 
	items i
LEFT JOIN
	sold_qty_view sq ON i.item_id = sq.item_id
LEFT JOIN
	lead_time_summary_view lts ON i.item_id = lts.item_id
GROUP BY i.item_id, max_sold_qty, avg_sold_qty, avg_lead_time_days, max_lead_time_days;