import { useState, useEffect } from 'react';
import { getBUCartItems, updateBuCartStockCounts, getBBCartItems } from "./cartDB";

export const useCartItems = () => {
    const [bbParts, setBbParts] = useState([]);
    const [buParts, setBuParts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [checkedBuItems, setCheckedBuItems] = useState([]);
    const [checkedBbItems, setCheckedBbItems] = useState([]);
    const [checkedBuItemsTotal, setCheckedBuItemsTotal] = useState(0);
    const [checkedBbItemsTotal, setCheckedBbItemsTotal] = useState(0);

    const fetchCartItems = async () => {
        let buItems = await getBUCartItems();
        let buItemsLength = buItems.length;
        // alert(buItems.length);
        if (buItemsLength > 0) {
            buItems = await updateBuCartStockCounts();
        }
        const bbItems = await getBBCartItems();

        setBuParts(buItems.sort((a, b) => b.date_added - a.date_added));
        setBbParts(bbItems.sort((a, b) => b.date_added - a.date_added));
        setLoading(false);
    };

    const calculateTotal = () => {
        const bbTotal = bbParts.reduce((acc, part) => acc + (part.checked ? part.build_price : 0), 0);
        const buTotal = buParts.reduce((acc, part) => acc + (part.checked ? part.item_price * part.qty : 0), 0);
        setCheckedBbItemsTotal(bbTotal);
        setCheckedBuItemsTotal(buTotal);
        setTotalPrice(bbTotal + buTotal);
        
    };

    const getCheckedItems = () => {
        const checkedBuItemsList = buParts.filter(part => part.checked === 1);
        const checkedBbItemsList = bbParts.filter(part => part.checked === 1);
        setCheckedBuItems(checkedBuItemsList);
        setCheckedBbItems(checkedBbItemsList);
    }

    useEffect(() => {
        fetchCartItems();
    }, []);
    
    useEffect(() => {
        calculateTotal();
        getCheckedItems();
    }, [bbParts, buParts]);

    return { bbParts, buParts, totalPrice, loading, fetchCartItems, checkedBuItems, checkedBbItems, checkedBuItemsTotal, checkedBbItemsTotal };
}