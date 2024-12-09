const pool = require('../config/db');

const getSettings = async (req, res) => {
    try {
        const query = `
            SELECT * 
            FROM settings
        `
        const { rows } = await pool.query(query);
        res.status(200).json({ settings : rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAdminSettings = async (req, res) => {
    try {
        const query = `
            SELECT
                admin_id,
                admin_name,
                admin_email
            FROM admin;
        `
        const { rows } = await pool.query(query);
        res.status(200).json({ admin : rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const setNewAdminName = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { newName } = req.body;
        const query = `
            UPDATE admin
            SET admin_name = $1
            WHERE admin_id = $2;
        `
        const values = [newName, admin_id];
        await pool.query(query, values);
        res.status(200).json({ message: 'Admin name updated successfully' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setNewStoreName = async (req, res) => {
    try {
        const { storeName } = req.body;
        const query = `
            UPDATE settings
            SET setting_value = $1
            WHERE setting_key = 'store_name';
        `
        const values = [storeName];
        await pool.query(query, values);
        res.status(200).json({ message: 'Store name updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setNewStoreAddress = async (req, res) => {
    try {
        const { storeAddress } = req.body;
        const query = `
            UPDATE settings
            SET setting_value = $1
            WHERE setting_key = 'store_address';
        `
        const values = [storeAddress];
        await pool.query(query, values);
        res.status(200).json({ message: 'Store address updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setMechanicPercentage = async (req, res) => {
    try {
        console.log(req.body);
        const { percentage } = req.body;
        const query = `UPDATE settings SET setting_value = $1 WHERE setting_key = 'mechanic_percentage'`;
        const values = [percentage];
        await pool.query(query, values);
        res.status(200).json({ message: 'Mechanic percentage updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setDisplayStockLevelPOS = async (req, res) => {
    try {
        const { displayValue } = req.body;
        const query = `UPDATE settings SET setting_value = $1 WHERE setting_key = 'display_stock_level_pos'`;
        const values = [displayValue];
        await pool.query(query, values);
        res.status(200).json({ message: 'Display stock level for POS items updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setDisplayExpenses = async (req, res) => {
    try {
        const { displayValue }  = req.body;
        const query = `
            UPDATE settings
            SET setting_value = $1
            WHERE setting_key = 'display_expenses'
        `
        const values = [displayValue];
        await pool.query(query, values);
        res.status(200).json({ message: 'Display expenses updated successfully'})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getStoreAddress = async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM settings
            WHERE setting_key = 'store_address';
        `
        const { rows } = await pool.query(query);
        res.status(200).json({ storeAddress : rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getSettings,
    getAdminSettings,
    setMechanicPercentage,
    setNewAdminName,
    setDisplayStockLevelPOS,
    setDisplayExpenses,
    setNewStoreName,
    setNewStoreAddress,
    getStoreAddress
}