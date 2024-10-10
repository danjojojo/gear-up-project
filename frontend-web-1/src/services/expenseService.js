import api from "./api";

export const addExpense = async (expenseData) => {
    try {
        const response = await api.post("/expense/add-expense", expenseData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding expense", error);
        throw error;
    }
}

export const getExpenses = async (startDate) => {
    try {
        const response = await api.get(`/expense/get-expenses/${startDate}`);
        return response.data;
    } catch (error) {
        console.error("Error getting expenses", error);
        throw error;
    }
}

export const getExpensesDates = async () => {
    try {
        const response = await api.get("/expense/get-expenses-dates");
        return response.data;
    } catch (error) {
        console.error("Error getting expenses", error);
        throw error;
    }
}

export const editExpense = async (expenseId, expenseData) => {
    try {
        const response = await api.put(`/expense/edit-expense/${expenseId}`, expenseData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error editing expense", error);
        throw error;
    }
}

export const archiveExpense = async (expenseId, startDate) => {
    try {
        const response = await api.put(`/expense/archive-expense/${expenseId}`);
        return response.data;
    } catch (error) {
        console.error("Error editing expense", error);
        throw error;
    }
}