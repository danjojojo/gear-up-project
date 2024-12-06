import './summaries.scss'
import PageLayout from '../../components/page-layout/page-layout';
import { AuthContext } from '../../context/auth-context';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from 'react';
import { getSummaryRecords, getHighlightDates, getReceiptDetails, getReceiptItems, getExpenseImage } from '../../services/summaryService';
import {Modal} from 'react-bootstrap'
import LoadingPage from '../../components/loading-page/loading-page';
import ErrorLoad from '../../components/error-load/error-load';
import { useContext } from 'react';

const Summaries = () => {
    const { displayExpenses } = useContext(AuthContext);
    const todayDate = new Date();
    const [startDate, setStartDate] = useState(moment(todayDate).format("YYYY-MM-DD"));
    const formattedDate = moment(startDate).format('MMMM DD, YYYY');
    const [selectedPOSUser, setSelectedPOSUser] = useState('all');
    const [summaryRecords, setSummaryRecords] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [distinctPOSUsers, setDistinctPOSUsers] = useState([]);
    const [filteredRecordsByPOSUser, setFilteredRecordsByPOSUser] = useState([]);
    const [netSales, setNetSales] = useState(0);
    const [deductedNetLabor, setDeductedNetLabor] = useState(0);
    const [originalNetLabor, setOriginalNetLabor] = useState(0);
    const [netExpenses, setNetExpenses] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [currentMechanicPercentage, setCurrentMechanicPercentage] = useState(0);

    const [recordName, setRecordName] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);   
    const [receiptChange, setReceiptChange] = useState(0);
    const [recordDate, setRecordDate] = useState('');
    const [recordPOSUser, setRecordPOSUser] = useState('');
    const [selectedID, setSelectedID] = useState('');
    const [selectedName, setSelectedName] = useState('');

    const [receiptItems, setReceiptItems] = useState([]);
    const [openRecordDetails, setOpenRecordDetails] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);
    const [recordType, setRecordType] = useState('');

    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorLoad, setErrorLoad] = useState(false);

    const [newReceiptTotal, setNewReceiptTotal] = useState(0);

    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Attached proof
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={`data:image/png;base64,${previewImage}`}
                alt="Expense"
                style={{ width: "100%", height: "auto" }}/>
            </Modal.Body>
            </Modal>
        );
    }

    const handleGetSummaryRecords = async (startDate) => {
        try {
            const { records, mechanicPercentage } = await getSummaryRecords(startDate);
            setDistinctPOSUsers([...new Set(records.map(record => record.pos_name))].sort());

            if(displayExpenses){
                setFilteredRecordsByPOSUser(records);
                setSummaryRecords(records);
            } else {
                setFilteredRecordsByPOSUser(records.filter(record => record.record_type !== 'expense'));
                setSummaryRecords(records.filter(record => record.record_type !== 'expense'));
            }

            setSummaryData();
            setCurrentMechanicPercentage(mechanicPercentage);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            console.error('Error getting summary records: ', error);
        }
    }

    const handleGetHighlightDates = async () => {
        try {
            const { dates } = await getHighlightDates();

            let retrievedDates = dates;
            if(!displayExpenses){
                retrievedDates = dates.filter(date => date.record_type !== 'expense');
            }

            const formattedDates = retrievedDates.map((date) =>
                moment(date.date).toDate()
            );
            setHighlightedDates(formattedDates);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            console.error('Error getting highlight dates: ', error);
        }
    }

    const handleGetReceiptDetails = async (saleId) => {
        try {
            const { 
                receiptName,
                totalCost,
                paidAmount,
                change 
            } = await getReceiptDetails(saleId);
            setRecordName(receiptName);
            setTotalCost(totalCost);
            setPaidAmount(paidAmount);
            setReceiptChange(change);
        } catch (error) {
            console.error('Error getting receipt details: ', error);
        }
    }

    const handleGetReceiptItems = async (saleId) => { 
        try {
            const { items } = await getReceiptItems(saleId);
            setReceiptItems(items);
            let newTotal = items.reduce((acc, item) => {
                if(item.refund_qty > 0) {
                    acc += (item.qty - item.refund_qty) * item.item_unit_price
                } else if (item.return_qty > 0) {
                    acc += (item.qty - item.return_qty) * item.item_unit_price
                } else {  
                    acc += item.item_total_price
                }

                return acc;
            }, 0);
            setNewReceiptTotal(newTotal);
        } catch (error) {
            console.error('Error getting receipt items: ', error);
        }
    }

    const handleGetExpenseImage = async (expenseId) => {
        try {
            const { image } = await getExpenseImage(expenseId);
            setPreviewImage(image);
        } catch (error) {
            console.error('Error getting expense image: ', error);
        }
    }

    useEffect(() => {
        handleGetSummaryRecords(startDate);
    }, [startDate])

    useEffect(() => {
        handleGetHighlightDates();
    }, [])

    useEffect(() => {
        setSummaryData();
    }, [filteredRecordsByPOSUser])

    function handleNoRecords(){
        return (
            <div className='no-records'>
                <p>No recorded sales, labor, and expenses.</p>
            </div>
        )
    }

    function handleChangePOSUser(value){
        if(value !== 'all'){
            setSelectedPOSUser(value);
            setFilteredRecordsByPOSUser(summaryRecords.filter((record) => record.pos_name === value))
            // records.filter((record) => record.pos_name === value) returns an array of records with the selected POS user
        } else{
            setSelectedPOSUser('all');
            setFilteredRecordsByPOSUser(summaryRecords);
        }
    }

    function setSummaryData() {
        let filteredRecords = [];
        if (selectedPOSUser === 'all') {
            filteredRecords = summaryRecords.filter((record) => moment(record.date).format("YYYY-MM-DD") === startDate);
        } else {
            filteredRecords = summaryRecords.filter((record) => record.pos_name === selectedPOSUser && moment(record.date).format("YYYY-MM-DD") === startDate);
        }
        const currentNetSales =
            filteredRecords
                .filter((record) => record.record_type === 'items')
                .reduce((acc, record) => {
                    const qty = record.item_qty || 0; // Default to 0 if undefined
                    const refundQty = record.refund_qty || 0; // Default to 0 if undefined
                    const itemTotalPrice = record.item_total_price || 0; // Default to 0 if undefined
                    const itemUnitPrice = record.item_unit_price || 0; // Default to 0 if undefined
                    const returnQty = record.return_qty || 0; // Default to 0 if undefined

                    // Log values to understand what's happening
                    // console.log(`Processing Record:`, { qty, refundQty, itemTotalPrice, itemUnitPrice });
                    return acc + (qty - refundQty - returnQty) * itemUnitPrice;       
                }, 0); // Initial value of acc set to 0

        const currentOriginalNetLabor = filteredRecords.filter((record) => record.record_type === 'mechanic').reduce((acc, record) => acc + record.item_total_price, 0);

        const currentNetLaborWithMechanicPercentage = filteredRecords.filter((record) => record.record_type === 'mechanic').reduce((acc, record) => acc + (record.item_total_price * currentMechanicPercentage / 100), 0);
        const currentNetExpenses = filteredRecords.filter((record) => record.record_type === 'expense').reduce((acc, record) => acc + record.item_total_price, 0);

        setNetSales(currentNetSales + currentOriginalNetLabor);
        setOriginalNetLabor(currentOriginalNetLabor);
        setDeductedNetLabor(currentNetLaborWithMechanicPercentage);
        setNetExpenses(currentNetExpenses);

        setNetProfit((currentNetSales + currentOriginalNetLabor) - (currentNetLaborWithMechanicPercentage + currentNetExpenses));
    }

    function handleItemClick(record){
        if(selectedID === record.record_item_id) {
            return;
        }
        if(record.record_type === 'expense') {
            setRecordType('expense');
            setRecordName(record.item_name)
            handleGetExpenseImage(record.record_id)
            setTotalCost(record.item_total_price);
        } else{
            setRecordType('receipt');
            handleGetReceiptDetails(record.record_id)
            handleGetReceiptItems(record.record_id)
        }
        setSelectedID(record.record_item_id);
        setRecordDate(moment(record.date).format("LL") + " - " + moment(record.date).format("LT"));
        setRecordPOSUser(record.pos_name);
        setSelectedName(record.item_name);
        setOpenRecordDetails(true);
    }

    function closeRecordDetails(){
        setOpenRecordDetails(false);
        setSelectedID('');
    }
    
    let negativeMessages = [
        // 'Expenses exceeded earnings.',
        'Loss recorded.'
    ]

    let neutralMessages = [
        'No profit, no loss.',
        // 'No gains, no losses.'
    ]

    let PositiveMessages = [
        // 'Made a profit.',
        'Positive net profit recorded.'
    ]

    let HighPositiveMessages = [
        'Fantastic! Your shop is highly profitable this period.',
        "You're on a roll! The shop is making a lot of money."
    ]
    
    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>
    if(errorLoad) return <ErrorLoad classStyle={"error-in-page"}/>

    return (
        <div className='summaries p-3'>
            <PageLayout
                leftContent={
                    <div className='summaries-container'>
                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                        <div className='upper-container d-flex'>
                            <div className='left-container'>
                                <div className="summary-content">
                                    <div className="header">
                                        <h4>Summary</h4>
                                        <select name="" id="" defaultValue={'all'} onChange={(e) => handleChangePOSUser(e.target.value)}>
                                            <option value="all">All users</option>
                                            {distinctPOSUsers.map((posUser, index) => (
                                                <option key={index} value={posUser}>{posUser}</option>
                                            ))}          
                                        </select>                            
                                    </div>
                                    <p className="date">
                                        For {formattedDate}
                                    </p>
                                    <div className="message">
                                        {netProfit < 0 && <p className="red">{negativeMessages[Math.floor(Math.random() * negativeMessages.length)]}</p>}
                                        {netProfit === 0 && <p className="neutral">{neutralMessages[Math.floor(Math.random() * neutralMessages.length)]}</p>}
                                        {netProfit > 0 && netProfit < 5000 && <p className="green">{PositiveMessages[Math.floor(Math.random() * PositiveMessages.length)]}</p>}
                                        {netProfit > 5000 && <p className="green">{HighPositiveMessages[Math.floor(Math.random() * HighPositiveMessages.length)]}</p>}
                                    </div>
                                    <div className="four">
                                        <div className="green">
                                            <p className="left">Receipt Sales</p>
                                            <p className="right">{netSales}</p>
                                        </div>
                                        <div className="red">
                                            <p className="left">Labor Cost</p>
                                            <p className="right">({deductedNetLabor.toFixed(0)})</p>
                                        </div>
                                        {displayExpenses && 
                                            <div className="red">
                                                <p className="left">Expenses</p>
                                                <p className="right">({netExpenses})</p>
                                            </div>
                                        }
                                        <div className="net">
                                            <p className="left">Net Revenue</p>
                                            <p className={netProfit === 0 ? "right" : (netProfit > 0 ? "right green" : "right red")}>{PesoFormat.format(netProfit)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='right-container'>
                                 <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(moment(date).format("YYYY-MM-DD"))
                                        setOpenRecordDetails(false)
                                        setSelectedID('');
                                    }}
                                    maxDate={todayDate}
                                    calendarClassName='calendar'
                                    todayButton="Today"
                                    highlightDates={highlightedDates}
                                    inline
                                />
                            </div>
                        </div>

                        <div className='lower-container'>
                            <div className='content'>
                                <div className="list">
                                    {filteredRecordsByPOSUser.length === 0 && handleNoRecords()}
                                    {filteredRecordsByPOSUser.filter(filRecord => (filRecord.item_qty > filRecord.refund_qty) && (filRecord.item_qty > filRecord.return_qty)).map((record, index) => (
                                        <div key={index} className="list-item" onClick={() => handleItemClick(record)}>
                                            <div className="left">
                                                {record.record_type === 'items' && <i className="fa-solid fa-tag"></i>}
                                                {record.record_type === 'mechanic' && <i className="fa-solid fa-wrench"></i>}
                                                {record.record_type === 'expense' && <i className="fa-solid fa-receipt"></i>}
                                                <p className='pos'>{record.pos_name}</p>
                                            </div>
                                            <div className="mid">
                                                <p className='name'>{record.item_name.length > 30 ? record.item_name.substring(0, 30) + '...' : record.item_name}</p>     
                                            </div>
                                            <div className="right">
                                                {record.record_type !== 'mechanic' && <p className='amount'>{PesoFormat.format((record.item_qty - record.refund_qty) * record.item_unit_price)}</p>}
                                                {record.record_type === 'mechanic' && <p className='amount'>{PesoFormat.format(record.item_unit_price * currentMechanicPercentage / 100)}</p>}
                                                {moment(record.date).format("LL") === formattedDate ?
                                                    <p className='date'>{moment(record.date).startOf('minute').fromNow()}</p>
                                                    :
                                                    <p className='date'>{moment(record.date).format("LT")}</p>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>  
                            </div>
                        </div>
                    </div>

                }

                rightContent={
                <div className='rightmost-content'>
                    {!openRecordDetails && <div className="content">
                            <div className="top">
                                <h4>Summary Details</h4>
                                <p>Select a record below to view details.</p>
                            </div>
                    </div>}
                    {(openRecordDetails && recordType === 'receipt' )  && <div className="content">
                        <div className="top">
                            <div className="nav">
                                <h4>{recordName}</h4>
                                <i className="fa-solid fa-xmark" onClick={() => {
                                    closeRecordDetails();
                                }}></i>
                            </div>
                            <p>{recordDate}</p>
                            <p>{recordPOSUser}</p>
                        </div>
                        <div className="bottom">
                            <div className="total">
                                <h4 className="value">{PesoFormat.format(totalCost)}</h4>
                                {newReceiptTotal !== totalCost && <p className="new-total">Now {PesoFormat.format(newReceiptTotal)}</p>}
                                <p>Total</p>
                            </div>
                            <div className="items">
                                {receiptItems.map((item, index) => (
                                    <div className={selectedName === item.item_name ? "item selected" : "item"} key={index}> 
                                        <div className="left">    
                                            <p className="name">{item.item_name}</p>
                                            {item.record_type === 'item' && 
                                            <p className="qty-unit-price">{item.qty} x {item.item_unit_price}
                                                <span className='refund-qty'> {item.refund_qty > 0 && 'Refunded x' + item.refund_qty}</span>
                                                <span className='refund-qty'> {item.return_qty > 0 && 'Returned x' + item.return_qty}</span>
                                            </p>}
                                            {item.record_type === 'mechanic' && <p className="qty-unit-price">Mechanic Service</p>}
                                        </div>
                                        <div className="right">
                                            <p className='total-price'>{PesoFormat.format(item.item_total_price)}</p>
                                            {item.refund_qty > 0 && <p className='refund-total'>Now {PesoFormat.format((item.qty - item.refund_qty) * item.item_unit_price)}</p>}
                                            {item.return_qty > 0 && <p className='refund-total'>Now {PesoFormat.format((item.qty - item.return_qty) * item.item_unit_price)}</p>}
                                            {item.record_type === 'mechanic' && 
                                                <p className='refund-total'>
                                                    Earned {currentMechanicPercentage}% {PesoFormat.format(item.item_unit_price * currentMechanicPercentage / 100)}
                                                </p>
                                            }
                                        </div>
                                    </div>    
                                ))}
                            </div>
                        </div>
                        <div className="total-paid-change">
                            <div className="total-cost">
                                <p>Total</p>
                                <p>{PesoFormat.format(totalCost)}</p>
                            </div>
                            <div className="paid">
                                <p>Paid</p>
                                <p>{PesoFormat.format(paidAmount)}</p>
                            </div>
                            <div className="change">
                                <p>Change</p>
                                <p>{PesoFormat.format(receiptChange)}</p>
                            </div>
                        </div>
                    </div>}
                    {(openRecordDetails && recordType === 'expense' )  && <div className="content">
                        <div className="top">
                            <div className="nav">
                                <h4>{recordName}</h4>
                                <i className="fa-solid fa-xmark" onClick={() => {
                                    closeRecordDetails();
                                }}></i>
                            </div>
                            <p>{recordDate}</p>
                            <p>{recordPOSUser}</p>
                        </div>
                        <div className="bottom">
                            <div className="total">
                                <h4 className="value">{PesoFormat.format(totalCost)}</h4>
                                <p>Expense Amount</p>
                            </div>
                            <div className="items">
                                <p>Attached proof</p>
                                <img src={`data:image/png;base64,${previewImage}`} alt="Expense" onClick={() => setModalShow(true)}/>
                            </div>
                        </div>
                    </div>}
                </div>
                }
            />
        </div>
    );
};

export default Summaries;