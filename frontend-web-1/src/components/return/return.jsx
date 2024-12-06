import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import {
    returnItem
} from '../../services/receiptService';

const Return = ({
    setReturnView,
    receiptDetails,
    retrievedReceiptItems,
    PesoFormat,
    getReceipts,
    startDate
}) => {
    const returnReasons = ['Damaged', 'Defective', 'Expired'];

    const [returnItemView, setReturnItemView] = useState(false);
    const [selectedReturnItem, setSelectedReturnItem] = useState({});
    const [selectedReturnQty, setSelectedReturnQty] = useState(1);
    const [returnReason, setReturnReason] = useState(returnReasons[0]);

    const [confirmReturnModal, setConfirmReturnModal] = useState(false);

    const handleReturnItemView = (item) => {
        setReturnItemView(true);
        setSelectedReturnItem(item);
    }

    const handleReturnItem = (item) => {
        setConfirmReturnModal(true);
        setSelectedReturnItem(item);
        // alert(
        //     `Item: ${item.item_name}\n` +
        //     `Item ID: ${item.item_id}\n` +
        //     `Receipt ID: ${receiptDetails.receipt_id}\n` +
        //     `Sale ID: ${receiptDetails.sale_id}\n` +
        //     `Qty: ${selectedReturnQty}\n` +
        //     `Unit Price: ${item.item_unit_price}\n` +
        //     `Reason: ${returnReason}`
        // )
    }

    const handleConfirmReturnItem = async (item) => {
        try {
            await returnItem(
                receiptDetails.receipt_id,
                receiptDetails.sale_id,
                selectedReturnItem.item_id,
                selectedReturnItem.item_unit_price,
                selectedReturnQty,
                returnReason
            );
            setReturnItemView(false);
            setConfirmReturnModal(false);
            await getReceipts(startDate);
        } catch (error) {
            console.error(error);
        }
    }

    const ConfirmModal = ({ onConfirm, onHide, ...props}) => {
        return (
            <Modal
                show={confirmReturnModal}
                onHide={() => setReturnItemView(false)}
                backdrop="static"
                keyboard={false}
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Return Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to return this item?</p>
                    <ul>
                        <li>Sale amount of returned items will be deducted from the receipt.</li>
                        <li>Returned damaged, defective, and expired items will not be added back to the inventory.</li>
                    </ul>
                    <p>This cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onConfirm()}>Return</Button>
                    <Button variant="danger" onClick={() => setConfirmReturnModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div>
            <ConfirmModal
                show={confirmReturnModal}
                onHide={() => setConfirmReturnModal(false)}
                onConfirm={handleConfirmReturnItem}
            />
            {!returnItemView && 
                <>
                    <div className="receipt-nav">
                        <h4>Returns</h4>
                        <div className="print-close">
                            <i className="fa-solid fa-xmark"
                            onClick={() => {
                                setReturnView(false);
                            }}
                            ></i>
                        </div>
                    </div>
                    <div className="receipt-details-info">
                        <div className="receipt-details-info-content">
                            {retrievedReceiptItems.filter((item) => item.record_type === 'item' && item.return_qty !== item.qty).length === 0 &&
                                <div className='receipt-details-item'>
                                    <p>All items in this receipt were already refunded.</p>
                                </div>
                            }
                            {retrievedReceiptItems.length > 0 &&
                                retrievedReceiptItems.filter((item) => item.record_type === 'item').map((item, itemIndex) => {
                                return (
                                    <div className='receipt-details-item' key={itemIndex}>
                                        {/* <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChangeReturn(item)}  // Toggle the checkbox state
                                        disabled={item.refund_qty === item.qty || item.return_qty === item.qty || item.refund_qty + item.return_qty === item.qty? true : false}
                                        /> */}
                                        <div className="left">    
                                            <p className="name">{item.item_name} <span id='item-qty'>x {item.qty}</span></p>
                                            {item.return_qty > 0 && <p className="qty-unit-price">Returned x {item.return_qty}</p>}
                                            {item.refund_qty > 0 && <p className="qty-unit-price">Refunded x {item.refund_qty}</p>}
                                            {/* {returnItems[item.item_id] &&                         
                                            <div className='refund-input'>
                                                <div className="refund-qty">
                                                { returnItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty >= 2 ?
                                                <button
                                                    onClick={() => {
                                                    handleReturnQty(item.item_id, returnItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty -1);
                                                    }}
                                                >-</button> : 
                                                <button className="no-decrease">-</button>
                                                }
                                                <input
                                                    type="number"
                                                    value={returnItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty}
                                                    min={1}
                                                    onChange={(e) => {
                                                    const newQty = Number(e.target.value);
                                                    const referenceQty = item.return_qty > 0 ? item.qty - item.return_qty : item.qty;
                                                    if(newQty <= referenceQty){
                                                        handleReturnQty(item.item_id, e.target.value);
                                                    }
                                                    }}
                                                    />
                                                { returnItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty < (item.return_qty > 0 ? item.qty - item.return_qty : item.qty) ?
                                                <button
                                                    onClick={() => {
                                                    handleReturnQty(item.item_id, returnItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty + 1);
                                                    }}
                                                >+</button> : 
                                                <button className="no-decrease">+</button>
                                                }
                                                <p>Return x {returnItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty}</p>
                                                </div>
                                            </div>
                                            } */}
                                        </div>
                                        <div className="total-price">
                                        {/* {(() => {
                                            const refundItem = returnItemsDetails.find(
                                            (refundItem) => refundItem.id === item.item_id
                                            );
                                            return (
                                            <p>
                                                {PesoFormat.format((refundItem?.qty || 0) * item.item_unit_price)}
                                            </p>
                                            );
                                        })()} */}
                                        <button 
                                            onClick={() => handleReturnItemView(item)} 
                                            disabled={item.refund_qty === item.qty || item.return_qty === item.qty || item.refund_qty + item.return_qty === item.qty ? true : false} 
                                            className={item.refund_qty === item.qty || item.return_qty === item.qty || item.refund_qty + item.return_qty === item.qty ? 'button disable' : ''}
                                        >Process Return</button>
                                        </div>
                                    </div>
                                );
                                })}
                        </div>
                    </div>
                </>
            }   
            {returnItemView && 
                <>
                    <div className="receipt-nav">
                        <h4>Return Item</h4>
                        <div className="print-close">
                            <i className="fa-solid fa-xmark"
                            onClick={() => {
                                setReturnItemView(false);
                                setReturnView(true);
                            }}
                            ></i>
                        </div>
                    </div>
                    <div className="receipt-details-info">
                        <div className="receipt-details-info-content">
                            <div className='refund-details-item'>
                                <div className="left">    
                                    <p className="name">{selectedReturnItem.item_name} <span id='item-qty'>x {selectedReturnItem.qty}</span></p>
                                           
                                    <div className='refund-input'>
                                        <div className="return-qty">

                                        {selectedReturnQty >= 2 ?
                                            <button
                                                onClick={() => {
                                                    setSelectedReturnQty(selectedReturnQty - 1);
                                                }}
                                            >-</button>
                                                :
                                            <button className="no-decrease">-</button>
                                        }
                                        <input 
                                            type="number"
                                            min={1}   
                                            value={selectedReturnQty} 
                                            onChange={(e) => {
                                                const newQty = Number(e.target.value);
                                                const referenceQty = selectedReturnItem.return_qty > 0 ? selectedReturnItem.qty - selectedReturnItem.return_qty : selectedReturnItem.qty;
                                                if(newQty <= referenceQty){
                                                    setSelectedReturnQty(newQty);
                                                }
                                            }}
                                        />
                                        {
                                            selectedReturnQty < (selectedReturnItem.return_qty > 0 ? selectedReturnItem.qty - selectedReturnItem.return_qty : selectedReturnItem.qty) ?
                                            <button
                                                onClick={() => {
                                                    setSelectedReturnQty(selectedReturnQty + 1);
                                                }}
                                            >+</button> :
                                            <button className="no-decrease">+</button>

                                        }
                                        
                                        </div>

                                        {selectedReturnItem.return_qty > 0 && <p className="qty-unit-price">Returned x {selectedReturnItem.return_qty}</p>}
                                        
                                        <p className="qty-unit-price">Return x {selectedReturnQty}</p>
                                    </div>
                                    
                                </div>
                                <div className="total-price">
                                {/* {(() => {
                                    const refundItem = returnItemsDetails.find(
                                    (refundItem) => refundItem.id === item.item_id
                                    );
                                    return (
                                    <p>
                                        {PesoFormat.format((refundItem?.qty || 0) * item.item_unit_price)}
                                    </p>
                                    );
                                })()} */}
                                {/* <button 
                                    onClick={() => handleReturnItem(selectedReturnItem)} 
                                >Return</button> */}
                                    <div className="return-amount">
                                        <p>{PesoFormat.format(selectedReturnQty * selectedReturnItem.item_unit_price)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="return-reason">
                            <label htmlFor="return-reason">Return Reason</label>
                            <select name="return-reason" id="return-reason" onChange={(e) => setReturnReason(e.target.value)}>
                               {returnReasons.map((reason, index) => {
                                      return <option key={index} value={reason}>{reason}</option>
                               })}
                            </select>
                        </div>
                        
                        <button 
                            className="return-button"
                            onClick={() => handleReturnItem(selectedReturnItem)} 
                        >Return</button>
                    </div>
                </>
            }
        </div>
    )
}

export default Return