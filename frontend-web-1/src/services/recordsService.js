import api from './api';

export const getDashboardData = async (selectedRecord, selectedDate) => {
    try {
        // Pass data as query parameters
        const response = await api.get(`/records/get-dashboard-data?reference=${selectedRecord}&date=${selectedDate}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving dashboard data', error);
        throw error;
    }
}

export const getRecords = async (selectedRecord, selectedDate) => {
    try {
        // Pass data as query parameters
        const response = await api.get(`/records/get-records?reference=${selectedRecord}&date=${selectedDate}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving dashboard data', error);
        throw error;
    }
}

export const getHighlightDates = async (selectedRecord) => {
    try {
        // Pass data as query parameters
        const response = await api.get(`/records/get-highlight-dates?reference=${selectedRecord}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving dashboard data', error);
        throw error;
    }
}

export const getInnerRecords = async (selectedRecord, id) => {
    try {
        // Pass data as query parameters
        const response = await api.get(`/records/get-inner-records?reference=${selectedRecord}&id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving dashboard data', error);
        throw error;
    }
}

export const getLeaderBoards = async (selectedRecord, start, end) => {
    try {
        // Pass data as query parameters
        const response = await api.get(`/records/get-leader-boards?reference=${selectedRecord}&start=${start}&end=${end}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving dashboard data', error);
        throw error;
    }
}