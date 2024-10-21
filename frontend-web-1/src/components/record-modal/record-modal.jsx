import React, { useEffect, useState } from 'react'
import {Modal} from 'react-bootstrap'
import './record-modal.scss'

export default function RecordModal({name, date, posName, subtotal, items, selectedRecord, ...props}) {
    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    const [recordTabName, setRecordTabName] = useState('');

    function changeSelectedRecord(selectedRecord){
        if(selectedRecord === 'sales'){
            setRecordTabName('Items')
        } else if(selectedRecord === 'labor'){
            setRecordTabName('Labor')
        } else if(selectedRecord === 'expenses'){
            setRecordTabName('Expense')
        }
    }

    
    useEffect(() => {
        changeSelectedRecord(selectedRecord);
    },[selectedRecord]);

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            contentClassName='record-modal'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {recordTabName} Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="custom-content">
                    <div className="info">
                        <h4>{name}</h4>
                        <p>{date}</p>
                        <p>{posName}</p>
                    </div>
                    <div className="subtotal">
                        <p className='value'>{subtotal}</p>
                        <p className='label'>
                            {recordTabName} {selectedRecord !== 'expenses' ? 'Subtotal' : 'Amount'}
                        </p>
                    </div>
                    <div className="items">
                        {(selectedRecord === 'sales' && Array.isArray(items)) && items.map((item, index) => (
                            <div key={index} className="item">
                                <div className="top">
                                    <p>{item.item_name}</p>
                                    <p className="total-price">{PesoFormat.format(item.item_total_price)}</p>
                                </div>
                                <div className="bottom">
                                    <p>{item.item_qty} x {PesoFormat.format(item.item_unit_price)} {}
                                        <span className='refund-qty'> 
                                            {item.refund_qty > 0 && 'Refunded' +  (item.refund_qty === item.item_qty ? ' All' : ' x' + item.refund_qty)}
                                        </span>
                                    </p>
                                    {item.refund_qty > 0 && <p className='refund-total'>Now {PesoFormat.format((item.item_qty - item.refund_qty) * item.item_unit_price)}</p>}
                                </div>
                            </div>
                        ))}
                        {(selectedRecord === 'labor' && Array.isArray(items)) && items.map((item, index) => (
                            <div key={index} className="item">
                                <div className="top">
                                    <p>{item.mechanic_name}</p>
                                    <p className="total-price">{PesoFormat.format(item.service_price)}</p>
                                </div>
                                <div className="bottom">
                                    <p>Mechanic Service</p>
                                </div>
                            </div>
                        ))}
                        {(selectedRecord === 'expenses' && !Array.isArray(items)) && (
                            <div className="item">
                                <div className="top">
                                    {/* <p>{items.expense_image}</p> */}
                                </div>
                                <div className="bottom">

                                {items.expense_image ? (
                                    <img
                                    src={`data:image/png;base64,${items.expense_image}`}
                                    alt="Expense"
                                    style={{ width: "100%", height: "auto" }} // Adjust the styling as needed
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
