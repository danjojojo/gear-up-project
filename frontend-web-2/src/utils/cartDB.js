import Dexie from 'dexie';
import api from '../services/api';

const db = new Dexie('BikeShopDB');
db.version(2).stores({
    bbCart: '++id, build_id, frame, fork, groupset, wheelset, seat, cockpit, image, checked', // Store for Bike Builder items
    buCart: '++id, item_id, item_name, item_price, qty, stock_count, checked',  // Store for Bike Upgrader items,
});

// BIKE UPGRADER
export async function addToBUCart(part) {
    const existingItem = await db.buCart.get({ item_id: part.item_id });
    if (existingItem) {
        alert("This part is already in the Bike Upgrader cart!");
        return;
    }
    alert("Added to cart!");
    await db.buCart.add({ ...part, qty: 1, checked: 0 });
}

export async function getBUCartItems() {
    return await db.buCart.toArray();
}

export async function getBuCartIdsFromIndexedDB() {
    const buCartItems = await db.buCart.toArray();
    return buCartItems.map(item => item.item_id); // Extract item_ids only
}

export async function fetchBuCartIdsUpdatedStockCounts(ids) {
    try {
        const response = await api.post("/bike-builder/stock-count", { ids });
        return response.data;
    } catch (error) {
        console.error("Error in fetchBuCartIdsUpdatedStockCounts:", error.message);
        throw new Error("Error fetching updated stock counts:", error);
    }
}

export async function updateBuCartStockCounts() {
    const ids = await getBuCartIdsFromIndexedDB();
    const updatedStocks = await fetchBuCartIdsUpdatedStockCounts(ids);

    for (let stock of updatedStocks) {
        await db.buCart.where("item_id").equals(stock.item_id).modify({
            stock_count: stock.stock_count
        });
    }

    return await db.buCart.toArray();
}

export async function removeFromBUCart(id) {
    await db.buCart.delete(id);
}

export async function checkPartInBUCart(id) {
    const part = await db.buCart.get(id);
    if (!part) {
        console.error("Part not found in Bike Upgrader cart.");
        return;
    }
    const newCheckedValue = part.checked === 0 ? 1 : 0;
    await db.buCart.update(id, { checked: newCheckedValue });
}

export async function updateBuPartQty(id, newQty) {
    const { qty, stock_count } = await db.buCart.get(id);
    if(qty + newQty < 1) {
        return;
    }
    if(qty + newQty > stock_count) {
        return;
    }
    await db.buCart.update(id, { qty: qty + newQty });
}

// BIKE BUILDER
export async function addToBBCart(build) {
    try {
        const existingBuild = await db.bbCart.get({ build_id: build.build_id });
        if (existingBuild) {
            alert("This build is already in the Bike Builder cart!");
            return false; // Indicates the build was not added due to duplication
        }
        await db.bbCart.add({ ...build, checked: 0 });
        console.log("Build added to BB cart:", build);
        return true; // Indicates the build was successfully added
    } catch (error) {
        console.error("Error adding build to BB cart:", error);
        return false;
    }
}

export async function getBBCartItems(){
    return await db.bbCart.toArray();
}
export async function checkPartInBBCart(id) {
    const part = await db.bbCart.get(id);
    if (!part) {
        console.error("Part not found in Bike Upgrader cart.");
        return;
    }
    const newCheckedValue = part.checked === 0 ? 1 : 0;
    await db.bbCart.update(id, { checked: newCheckedValue });
}
export async function removeFromBBCart(id) {
    await db.bbCart.delete(id);
}