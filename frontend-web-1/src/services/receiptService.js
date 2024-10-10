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

export const getReceiptMechanics = async (receiptSaleId) => {
    try {
        const response = await api.get(`/receipt/get-receipt-mechanics/${receiptSaleId}`);
        return response.data;
    } catch (error) {
        console.error("Error retrieving receipts", error);
        throw error;
    }
}