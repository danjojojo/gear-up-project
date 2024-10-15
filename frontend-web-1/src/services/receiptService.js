import api from "./api";

export const getReceiptDates = async () => {
    try {
        const response = await api.get("/receipt/get-receipt-dates");
        return response.data;
    } catch (error) {
        console.error("Error retrieving receipt dates", error);
        throw error;
    }
}

export const getPosReceipts = async (startDate) => {
    try {
        const response = await api.get(`/receipt/get-pos-receipts/${startDate}`);
        return response.data;
    } catch (error) {
        console.error("Error retrieving receipts", error);
        throw error;
    }
}

export const getReceiptItems = async (receiptSaleId) => {
    try {
        const response = await api.get(`/receipt/get-receipt-items/${receiptSaleId}`);
        return response.data;
    } catch (error) {
        console.error("Error retrieving receipts", error);
        throw error;
    }
}

export const staffVoidReceipt = async (receiptId) => {
    try {
        const response = await api.put(`/receipt/void-receipt/${receiptId}`);
        return response.data;
    } catch (error) {
        console.error("Error voiding receipt", error);
        throw error;
    }
}

export const adminVoidReceipt = async (receiptId, retrievedReceiptItems) => {
    try {
        const response = await api.put(`/receipt/admin-void-receipt/${receiptId}`, {
            items: retrievedReceiptItems
        });
        return response.data;
    } catch (error) {
        console.error("Error voiding receipt", error);
        throw error;
    }
}

export const cancelVoidReceipt = async (receiptId) => {
    try {
        const response = await api.put(`/receipt/cancel-void-receipt/${receiptId}`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling void receipt", error);
        throw error;
    }
}