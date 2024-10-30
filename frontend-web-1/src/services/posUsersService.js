import api from "./api";

export const getPosUsers = async () => {
    try {
        const response = await api.get("/pos-users/get-pos-users");
        return response.data;
    } catch (error) {
        console.error("Error getting pos users", error);
        throw error;
    }
}

export const addPosUser = async (posUserData) => {
    try {
        const response = await api.post("/pos-users/add-pos-user", posUserData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding pos user", error);
        throw error;
    }
}

export const editPosUserName = async (posID, posUserData) => {
    try {
        const response = await api.put(`/pos-users/edit-pos-name/${posID}`, posUserData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error editing pos name", error);
        throw error;
    }
}

export const editPosUserPassword = async (posID, posUserData) => {
    try {
        const response = await api.put(`/pos-users/edit-pos-pass/${posID}`, posUserData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error editing pos password", error);
        throw error;
    }
}

export const editPosUserStatus = async (posID, posUserStatus) => {
    try {
        const response = await api.put(`/pos-users/edit-pos-status/${posID}`, {status: posUserStatus});
        return response.data;
    } catch (error) {
        console.error("Error editing pos password", error);
        throw error;
    }
}

export const deletePosUser = async (posID, posUserData) => {
    try {
        const response = await api.put(`/pos-users/delete-pos-user/${posID}`, posUserData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting pos user", error);
        throw error;
    }
}