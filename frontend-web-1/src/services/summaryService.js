import api from './api';

export const getSummaryRecords = async(startDate) => {
    try {
        const response = await api.get('/summary/get-summary-records', {
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

export const getHighlightDates = async() => {
    try {
        const response = await api.get('/summary/get-highlight-dates');
        return response.data;
    } catch (error) {
        console.error('Error getting highlight dates: ', error);
        throw error;
    }
}

export const getReceiptDetails = async(saleId) => {
    try {
        const response = await api.get('/summary/get-receipt-details', {
            params: {
                saleId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting receipt details: ', error);
        throw error;
    }
}

export const getReceiptItems = async(saleId) => {
    try {
        const response = await api.get('/summary/get-receipt-items', {
            params: {
                saleId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting receipt items: ', error);
        throw error;
    }
}

export const getReceiptMechanics = async(saleId) => {
    try {
        const response = await api.get('/summary/get-receipt-mechanics', {
            params: {
                saleId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting receipt mechanics: ', error);
        throw error;
    }
}

export const getExpenseImage = async(expenseId) => {
    try {
        const response = await api.get('/summary/get-expense-image', {
            params: {
                expenseId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting expense image: ', error);
        throw error;
    }
}