-- FINAL REORDER POINT

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
    ROUND(MAX(lead_time_days)) AS max_lead_time_days
FROM 
	lead_times_view
WHERE lead_time_days IS NOT NULL
GROUP BY
	item_id;


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


-- FINAL QUERY
SELECT 	
	item_name,
 	avg_sold_qty,
 	avg_lead_time_days,
	max_sold_qty,
	max_lead_time_days,
	lead_time_demand,
	safety_stock,
	CASE
		WHEN
			lead_time_demand + safety_stock = 0 THEN 5
		ELSE 
			lead_time_demand + safety_stock
	END AS threshold,
	CASE
	    WHEN lead_time_demand + safety_stock = 0 THEN 'Fallback'
	    ELSE 'Calculated'
	END AS threshold_source
FROM
	items i
LEFT JOIN
	rop_summary_view rp ON rp.item_id = i.item_id
GROUP BY
	i.item_id,
	avg_sold_qty,
 	avg_lead_time_days,
	max_sold_qty,
	max_lead_time_days,
	lead_time_demand,
	safety_stock
ORDER BY threshold DESC;

-- Batch 1
INSERT INTO restock_logs (item_id, stock_added, stock_before, date_created) VALUES
-- item012
('item012', 5, 10, '2024-09-01 09:00:00'),
('item012', 6, 15, '2024-09-04 10:00:00'),
('item012', 4, 21, '2024-09-10 12:00:00'),

-- item014
('item014', 6, 18, '2024-09-02 09:30:00'),
('item014', 5, 24, '2024-09-06 14:00:00'),
('item014', 7, 29, '2024-09-12 11:00:00'),

-- item009
('item009', 3, 7, '2024-09-03 08:00:00'),
('item009', 4, 10, '2024-09-09 10:30:00'),
('item009', 5, 14, '2024-09-14 09:00:00'),

-- item-14698bcc-5a6b-4a95-8677-e8dbb929ffe8
('item-14698bcc-5a6b-4a95-8677-e8dbb929ffe8', 4, 10, '2024-09-30 15:00:00'),
('item-14698bcc-5a6b-4a95-8677-e8dbb929ffe8', 5, 14, '2024-10-04 16:30:00'),
('item-14698bcc-5a6b-4a95-8677-e8dbb929ffe8', 6, 19, '2024-10-10 14:00:00'),

-- item015
('item015', 7, 14, '2024-10-02 10:00:00'),
('item015', 6, 21, '2024-10-08 11:30:00'),
('item015', 8, 27, '2024-10-15 09:00:00'),

-- item-0872583b-a114-4fdb-9165-ebc30afee08c
('item-0872583b-a114-4fdb-9165-ebc30afee08c', 5, 12, '2024-10-01 08:30:00'),
('item-0872583b-a114-4fdb-9165-ebc30afee08c', 3, 17, '2024-10-05 09:00:00'),
('item-0872583b-a114-4fdb-9165-ebc30afee08c', 4, 20, '2024-10-11 08:30:00'),

-- item007
('item007', 4, 10, '2024-09-28 09:30:00'),
('item007', 3, 14, '2024-10-02 10:00:00'),
('item007', 6, 17, '2024-10-09 08:00:00'),

-- item006
('item006', 5, 12, '2024-10-01 09:00:00'),
('item006', 7, 17, '2024-10-07 10:00:00'),
('item006', 6, 24, '2024-10-13 09:30:00'),

-- item-7217b400-32d1-4a7b-82a2-9cf601f10c91
('item-7217b400-32d1-4a7b-82a2-9cf601f10c91', 10, 30, '2024-09-30 14:00:00'),
('item-7217b400-32d1-4a7b-82a2-9cf601f10c91', 8, 40, '2024-10-05 15:00:00'),
('item-7217b400-32d1-4a7b-82a2-9cf601f10c91', 9, 48, '2024-10-12 11:30:00'),

-- item-673f4ef4-0892-478e-8422-343fd6f12803
('item-673f4ef4-0892-478e-8422-343fd6f12803', 4, 12, '2024-10-01 10:30:00'),
('item-673f4ef4-0892-478e-8422-343fd6f12803', 5, 16, '2024-10-06 11:30:00'),
('item-673f4ef4-0892-478e-8422-343fd6f12803', 7, 21, '2024-10-14 12:30:00'),

-- item003
('item003', 5, 12, '2024-10-01 12:00:00'),
('item003', 6, 17, '2024-10-06 13:30:00'),
('item003', 7, 23, '2024-10-15 10:30:00'),

-- item001
('item001', 6, 14, '2024-09-30 10:00:00'),
('item001', 5, 20, '2024-10-04 09:00:00'),
('item001', 8, 25, '2024-10-10 11:00:00'),

-- item-0eb49c27-9999-4b2f-9785-7c60e8830696
('item-0eb49c27-9999-4b2f-9785-7c60e8830696', 4, 10, '2024-09-30 08:30:00'),
('item-0eb49c27-9999-4b2f-9785-7c60e8830696', 5, 14, '2024-10-03 09:30:00'),
('item-0eb49c27-9999-4b2f-9785-7c60e8830696', 6, 19, '2024-10-09 12:00:00'),

-- item-c0f0914d-de52-4ddc-bcb3-101a7bd24090
('item-c0f0914d-de52-4ddc-bcb3-101a7bd24090', 6, 15, '2024-10-01 10:00:00'),
('item-c0f0914d-de52-4ddc-bcb3-101a7bd24090', 4, 21, '2024-10-05 09:30:00'),
('item-c0f0914d-de52-4ddc-bcb3-101a7bd24090', 7, 25, '2024-10-10 08:00:00'),

-- item-b6175070-2d3f-4861-88d3-32f2cb7403ab
('item-b6175070-2d3f-4861-88d3-32f2cb7403ab', 5, 12, '2024-09-30 09:00:00'),
('item-b6175070-2d3f-4861-88d3-32f2cb7403ab', 6, 16, '2024-10-04 10:30:00'),
('item-b6175070-2d3f-4861-88d3-32f2cb7403ab', 4, 22, '2024-10-10 12:00:00'),

-- item002
('item002', 6, 14, '2024-09-29 14:30:00'),
('item002', 4, 20, '2024-10-03 16:00:00'),
('item002', 7, 24, '2024-10-09 15:30:00'),

-- item008
('item008', 5, 12, '2024-09-30 14:30:00'),
('item008', 4, 17, '2024-10-04 12:00:00'),
('item008', 7, 21, '2024-10-10 16:00:00'),

-- item004
('item004', 6, 15, '2024-09-29 11:00:00'),
('item004', 5, 21, '2024-10-03 13:00:00'),
('item004', 7, 26, '2024-10-08 14:30:00'),

-- item013
('item013', 4, 10, '2024-09-30 09:30:00'),
('item013', 6, 14, '2024-10-03 10:30:00'),
('item013', 5, 20, '2024-10-07 11:30:00'),

-- item010
('item010', 5, 12, '2024-09-29 08:30:00'),
('item010', 6, 17, '2024-10-02 09:00:00'),
('item010', 4, 23, '2024-10-07 13:00:00'),

-- item-2a8f11c2-64a2-4cd4-8683-c6d008fea1e3
('item-2a8f11c2-64a2-4cd4-8683-c6d008fea1e3', 5, 14, '2024-09-30 14:00:00'),
('item-2a8f11c2-64a2-4cd4-8683-c6d008fea1e3', 6, 19, '2024-10-04 16:00:00'),
('item-2a8f11c2-64a2-4cd4-8683-c6d008fea1e3', 7, 25, '2024-10-09 15:00:00'),

-- item-b696747b-2c46-4f3e-bb19-856f9a63d702
('item-b696747b-2c46-4f3e-bb19-856f9a63d702', 6, 15, '2024-09-29 12:30:00'),
('item-b696747b-2c46-4f3e-bb19-856f9a63d702', 5, 21, '2024-10-03 11:30:00'),
('item-b696747b-2c46-4f3e-bb19-856f9a63d702', 7, 26, '2024-10-08 14:00:00');

-- item-6f2766ae-2a47-4b1f-8070-88b43a6f13fd
('item-6f2766ae-2a47-4b1f-8070-88b43a6f13fd', 5, 12, '2024-09-28 09:30:00'),
('item-6f2766ae-2a47-4b1f-8070-88b43a6f13fd', 6, 17, '2024-10-02 10:30:00'),
('item-6f2766ae-2a47-4b1f-8070-88b43a6f13fd', 7, 23, '2024-10-08 11:30:00'),

-- item-46d901f1-7820-49c9-86f7-32c71ea6fe8b
('item-46d901f1-7820-49c9-86f7-32c71ea6fe8b', 5, 15, '2024-09-29 10:30:00'),
('item-46d901f1-7820-49c9-86f7-32c71ea6fe8b', 4, 20, '2024-10-02 12:30:00'),
('item-46d901f1-7820-49c9-86f7-32c71ea6fe8b', 6, 25, '2024-10-07 14:00:00'),

-- item-fbfd4b70-cb90-4d54-964b-a0b72b2bb2b1
('item-fbfd4b70-cb90-4d54-964b-a0b72b2bb2b1', 6, 14, '2024-09-30 11:30:00'),
('item-fbfd4b70-cb90-4d54-964b-a0b72b2bb2b1', 7, 20, '2024-10-03 13:00:00'),
('item-fbfd4b70-cb90-4d54-964b-a0b72b2bb2b1', 5, 27, '2024-10-08 16:30:00'),

-- item-a4a4e5fd-e0da-459d-b80a-c1c98ea5fcff
('item-a4a4e5fd-e0da-459d-b80a-c1c98ea5fcff', 10, 35, '2024-09-29 09:00:00'),
('item-a4a4e5fd-e0da-459d-b80a-c1c98ea5fcff', 8, 45, '2024-10-04 14:30:00'),
('item-a4a4e5fd-e0da-459d-b80a-c1c98ea5fcff', 6, 53, '2024-10-10 12:00:00'),

-- item-b21bff14-da31-401e-ac45-082b938c2ef0
('item-b21bff14-da31-401e-ac45-082b938c2ef0', 5, 12, '2024-09-30 10:30:00'),
('item-b21bff14-da31-401e-ac45-082b938c2ef0', 7, 18, '2024-10-03 11:30:00'),
('item-b21bff14-da31-401e-ac45-082b938c2ef0', 6, 25, '2024-10-07 14:00:00'),

-- item011
('item011', 10, 35, '2024-09-29 12:00:00'),
('item011', 8, 45, '2024-10-03 12:30:00'),
('item011', 6, 53, '2024-10-08 13:00:00'),

-- item-41c5a2ae-431e-4334-b29e-48f8df947a23
('item-41c5a2ae-431e-4334-b29e-48f8df947a23', 4, 20, '2024-09-30 13:30:00'),
('item-41c5a2ae-431e-4334-b29e-48f8df947a23', 5, 24, '2024-10-03 14:30:00'),
('item-41c5a2ae-431e-4334-b29e-48f8df947a23', 6, 29, '2024-10-07 16:30:00'),

-- item-437579b2-6df7-4a5e-a06b-6a2ce77a5af4
('item-437579b2-6df7-4a5e-a06b-6a2ce77a5af4', 6, 15, '2024-09-28 10:30:00'),
('item-437579b2-6df7-4a5e-a06b-6a2ce77a5af4', 5, 21, '2024-10-02 11:30:00'),
('item-437579b2-6df7-4a5e-a06b-6a2ce77a5af4', 7, 26, '2024-10-07 13:30:00'),

-- item-50360d3c-92b1-4e2b-94f3-533de1d42bd4
('item-50360d3c-92b1-4e2b-94f3-533de1d42bd4', 4, 14, '2024-09-30 09:00:00'),
('item-50360d3c-92b1-4e2b-94f3-533de1d42bd4', 5, 18, '2024-10-03 10:30:00'),
('item-50360d3c-92b1-4e2b-94f3-533de1d42bd4', 6, 23, '2024-10-08 11:30:00'),

-- item-9e1838f5-1391-434a-90dc-2e12fde0d67e
('item-9e1838f5-1391-434a-90dc-2e12fde0d67e', 5, 12, '2024-09-28 10:00:00'),
('item-9e1838f5-1391-434a-90dc-2e12fde0d67e', 4, 17, '2024-10-02 12:30:00'),
('item-9e1838f5-1391-434a-90dc-2e12fde0d67e', 6, 21, '2024-10-06 13:00:00'),

-- item005
('item005', 6, 15, '2024-09-29 08:30:00'),
('item005', 5, 21, '2024-10-02 09:30:00'),
('item005', 7, 26, '2024-10-07 11:30:00');