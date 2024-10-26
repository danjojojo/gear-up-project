import api from './api';


export const dashboardData = async () => {
    try {
        const response = await api.get('/dashboard/dashboard-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchProductLeaderboard = async (start, end) => {
    try {
        const response = await api.get('/dashboard/product-data', {
            params: { start, end }
        });
        return response.data.leaderBoards;
    } catch (error) {
        console.error('Error fetching product leaderboard data:', error);
        throw error;
    }
};

export const getSummaryRecords = async (startDate) => {
    try {
        const response = await api.get('/dashboard/summary-data', {
            params: {
                date: startDate
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting summary records: ', error);
        throw error;
    }
}

export const fetchReceiptOverview = async () => {
    try {
        const response = await api.get('/dashboard/receipt-data');
        return response.data.data; // Assuming the data is returned under `data` key
    } catch (error) {
        console.error('Error fetching receipt data:', error);
        throw error;
    }
};