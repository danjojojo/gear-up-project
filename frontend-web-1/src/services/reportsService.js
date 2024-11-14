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

export const getExpensesReport = async (month, year) => {
    try {
        const response = await api.get(`/reports/expenses-report?month=${month}&year=${year}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving expenses report data:', error);
        throw error;
    }
};

export const getLaborReport = async (month, year) => {
    try {
        const response = await api.get(`/reports/labor-report?month=${month}&year=${year}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving labor report data:', error);
        throw error;
    }
};

export const getOrderReport = async (month, year) => {
    try {
        const response = await api.get(`/reports/order-report?month=${month}&year=${year}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving order report data:', error);
        throw error;
    }
};