import React from 'react'
import './reorder-modal.scss'
import { Modal } from 'react-bootstrap'

const ReorderModal = ({ 
    itemName, 
    posSoldUnits, 
    orderSoldUnits, 
    averageLeadTime, 
    maxLeadTime, 
    averageSoldQty,
    maxSoldQty,
    leadTime,
    posMaxSoldQty,
    orderMaxSoldQty,
    ...props
}) => {
    let reorderPoint = Number(averageSoldQty) * Number(averageLeadTime) + Number(maxSoldQty) * Number(maxLeadTime) - Number(averageSoldQty) * Number(averageLeadTime);
    let safetyStock = Number(maxSoldQty) * Number(maxLeadTime) - Number(averageSoldQty) * Number(averageLeadTime);
  return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='reorder-modal'
        centered
    >
        <Modal.Body>
            <div className="custom-content">
                <div className="info">
                    <h4>{itemName}</h4> 
                </div>
                <div className='guide-1'>
                    <h5><span><i className="fa-solid fa-circle-exclamation"></i></span>  Note</h5>
                    <p>Reorder Point of items will dynamically change as its restock date differences and sold quantity for the past 30 days changes.</p>
                </div>
                <p className='guide-2'>
                    <span><i className="fa-solid fa-lightbulb"></i></span> Reorder Point determines when you should restock your item. 
                    <br />
                    The computation for Reorder Point is Lead Time Demand + Safety Stock.
                </p>
                <div className="stats">
                    <div className="stat">
                        <h5>Lead Time Demand</h5>
                        <details>
                            <summary>View Formula</summary>
                            <p className='formula-2'>Lead Time Demand = Average Daily Sold Units * Average Lead Time</p>
                        </details>
                        <div className="stat-content">
                            <div className="var1">
                                <p>This Item's Sales for the past 30 days</p>
                                <p>Sold Units from POS: <b>{posSoldUnits}</b></p>
                                <p>Sold Units from Orders: <b>{orderSoldUnits}</b></p>
                                <p>Total Sold Units: <b>{Number(posSoldUnits) + Number(orderSoldUnits)}</b></p>
                                <p>Average Daily Sold Units: <b>{averageSoldQty}</b></p>
                            </div>
                            <div className="var2">
                                <p>From Restock logs (in days)</p>
                                <p>Lead Time for the Recent Restock: <b>{leadTime} days</b></p>
                                <p>Average Lead Time: <b>{averageLeadTime} days</b></p>
                            </div>
                        </div>
                    </div>
                    <div className="stat">
                        <h5>Safety Stock</h5>
                        <details>
                            <summary>View Formula</summary>
                            <p className='formula-2'>Safety Stock = (Max Daily Sold Units * Max Lead Time) - (Average Daily Sold Units * Average Lead Time)</p>
                        </details>
                        <div className="stat-content">
                            <div className="var1">
                                <p>This Item's Sales for the past 30 days</p>
                                <p>Max Daily Sold Units from POS: <b>{posMaxSoldQty}</b></p>
                                <p>Max Daily Sold Units from Orders: <b>{orderMaxSoldQty}</b></p>
                                <p>Max Daily Sold Units: <b>{maxSoldQty}</b></p>
                                <p>Average Daily Sold Units: <b>{averageSoldQty}</b></p>
                            </div>
                            <div className="var2">
                                <p>From Restock logs (in days)</p>
                                <p>Average Lead Time: <b>{averageLeadTime} days</b></p>
                                <p>Max Lead Time: <b>{maxLeadTime} days</b></p>
                            </div>
                        </div>
                    </div>
                    <div className="stat">
                        <h5>Reorder Point</h5>
                        <details>
                            <summary>View Formula</summary>
                            <p className='formula-2'>Reorder Point = Lead Time Demand + Safety Stock</p>
                        </details>
                        <div className="stat-content">
                            <div className="var1">
                                <p>COMPUTATION</p>
                                <p>Lead Time Demand <span>= {averageSoldQty} * {averageLeadTime} = <b>{Number(averageSoldQty) * Number(averageLeadTime)}</b></span> </p>
                                <p>Safety Stock <span>= ({maxSoldQty} * {maxLeadTime}) - ({averageSoldQty} * {averageLeadTime}) = <b>{safetyStock}</b></span> </p>
                                <p>
                                    Reorder Point <span>= {Number(averageSoldQty) * Number(averageLeadTime)} + {Number(maxSoldQty) * Number(maxLeadTime) - Number(averageSoldQty) * Number(averageLeadTime)} = <b>{reorderPoint} units</b></span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {reorderPoint > 0 && 
                        <p className='formula-1'>
                            <b>Verdict:</b> You should reorder stocks for this item when its stock level reaches <b>{reorderPoint} units</b>.
                        </p>
                    }
                    {reorderPoint === 0 && 
                        <p className='formula-1'>
                            <b>Verdict:</b> Since reorder point is unavailable,
                            you can reorder stocks for this item when it reaches the default buffer threshold of <span><b>5 units</b></span>.
                        </p>
                    }
                </div>
            </div>
        </Modal.Body>
    </Modal>
  )
}

export default ReorderModal;