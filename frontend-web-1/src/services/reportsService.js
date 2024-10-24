import api from './api';

export const getSalesReport = async (month, year) => {
    try {
        const response = await api.get(`/reports/sales-report?month=${month}&year=${year}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving sales report data:', error);
        throw error;
    }
};