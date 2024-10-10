import api from "./api";


// Get all items
export const getAllItems = async () => {
  try {
    const response = await api.get("/pos/get-items");
    return response.data;
  } catch (error) {
    console.error('Error retrieving items', error);
    throw error;
  }
};

export const getAllMechanics = async () => {
  try {
    const response = await api.get("/pos/get-mechanics");
    return response.data;
  } catch (error) {
    console.error("Error retrieving mechanics", error);
    throw error;
  }
};

export const confirmSale = async (
  items,
  mechanics,
  totalPrice,
  amountReceived,
  change
) => {
  try {
    const response = await api.post("/pos/confirm-sale", {
      items,
      mechanics,
      totalPrice,
      amountReceived,
      change
    });
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};