

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
)

CREATE TABLE orders_bb (
    build_id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    build_name VARCHAR(255),
    build_image BYTEA,
	build_price DECIMAL(10, 2),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(order_id)
	ON UPDATE CASCADE 
	ON DELETE CASCADE;
)

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
)

ALTER TABLE order_items
ADD COLUMN part VARCHAR(255);

SELECT * FROM orders;
SELECT * FROM orders_bb;
SELECT * FROM order_items;
SELECT * FROM items;
SELECT image FROM frame;



 SELECT  
	i.item_name, 
	CASE 
		WHEN oi.part = 'Frame' THEN f.image
		WHEN oi.part = 'Fork' THEN fk.image
		WHEN oi.part = 'Groupset' THEN g.image
		WHEN oi.part = 'Wheelset' THEN w.image
		WHEN oi.part = 'Seat' THEN s.image
		WHEN oi.part = 'Cockpit' THEN c.image
		ELSE i.item_image
	END AS image
FROM order_items oi
JOIN items i ON oi.item_id = i.item_id
LEFT JOIN frame f ON i.item_id = f.item_id AND i.bike_parts = 'Frame'
LEFT JOIN fork fk ON i.item_id = fk.item_id AND i.bike_parts = 'Fork'
LEFT JOIN groupset g ON i.item_id = g.item_id AND i.bike_parts = 'Groupset'
LEFT JOIN wheelset w ON i.item_id = w.item_id AND i.bike_parts = 'Wheelset'
LEFT JOIN seat s ON i.item_id = s.item_id AND i.bike_parts = 'Seat'
LEFT JOIN cockpit c ON i.item_id = c.item_id AND i.bike_parts = 'Cockpit'