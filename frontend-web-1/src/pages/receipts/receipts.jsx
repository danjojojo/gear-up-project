import './receipts.scss'
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import { useEffect, useState, forwardRef, useContext } from 'react';
import { 
  getPosReceipts, 
  getReceiptItems, 
  getReceiptDates, 
  staffVoidReceipt, 
  cancelVoidReceipt, 
  adminVoidReceipt, 
  refundReceipt, 
  adminCancelRefundReceipt,
  getReceiptsDashboard
} from '../../services/receiptService';
import { AuthContext } from '../../context/auth-context';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingPage from '../../components/loading-page/loading-page';
import SearchBar from "../../components/search-bar/search-bar";
import {Modal, Button} from 'react-bootstrap';
import Return from '../../components/return/return';
import {
  getSettings
} from '../../services/settingsService';

const Receipts = () => {
    // SOME STUFF
    const todayDate = new Date();

    // RECEIPTS
    const [allReceipts, setAllReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [retrievedReceipts, setRetrievedReceipts] = useState([]);

    // GET ALL DATES THAT HAVE RECEIPTS
    const [retrievedReceiptDates, setRetrievedReceiptDates] = useState([]);

    // RECEIPT DETAILS
    const [receiptDetails, setReceiptDetails] = useState([]);
    const [retrievedReceiptItems, setRetrievedReceiptItems] = useState([]);
    const [receiptID, setReceiptID] = useState('');
    const [receiptStatus, setReceiptStatus] = useState('active');
    const [receiptVoidDate, setReceiptVoidDate] = useState('');
    const [dashboardData, setDashboardData] = useState([]);
    const [showDashboardDataToday, setShowDashboardDataToday] = useState(true);

    // VIEWS
    const [refundView, setRefundView] = useState(false);
    const [returnView, setReturnView] = useState(false);

    // REFUND
    const [refundItems, setRefundItems] = useState({});
    const [refundItemsDetails, setRefundItemsDetails] = useState([]);

    // RETURN
    const [returnItems, setReturnItems] = useState({});
    const [returnItemsDetails, setReturnItemsDetails] = useState([]);

    // DATE FOR REACT-DATEPICKER
    const [startDate, setStartDate] = useState(moment(todayDate).format("YYYY-MM-DD"));
    const nowDate = moment(todayDate).format("YYYY-MM-DD");
    // SEARCH VALUE
    const [searchValue, setSearchValue] = useState("");

    // LOADING
    const [loading, setLoading] = useState(true);
    
    // MOBILE RESPONSIVENESS
    const [isVisible, setIsVisible] = useState(true);
    const [receiptDetailsContainer, setReceiptDetailsContainer] = useState("receipt-container");
    const [receiptsContainer, setReceiptsContainer] = useState("receipts-container");
    const [rightContainerStyle, setRightContainerStyle] = useState("right-container");
    
    // SORTING SHIT
    const [receiptSort, setReceiptSort] = useState("date");
    const [sortReceiptAmountDESCClicked, setSortReceiptAmountDESCClicked] = useState(false);
    const [sortReceiptDateDESCClicked, setSortReceiptDateDESCClicked] = useState(false);

    const [distinctPOSUsers, setDistinctPOSUsers] = useState([]);

    const [selectedPosUser, setSelectedPosUser] = useState('all');

    // DISABLE REACT DATEPICKER INPUT SHIT
    const DisabledDateInput = forwardRef(
      ({ value, onClick, className }, ref) => (
        <h4 className={className} onClick={onClick} ref={ref}>
          {value}
        </h4>
      )
    );

    // FORMAT SHIT TO PHILIPPINE PESO
    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    const { userRole } = useContext(AuthContext);

    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');

    // FETCH SHIT FROM DATABASE
    const getReceipts = async (startDate) => {
        try{
            const { receipts } = await getPosReceipts(startDate);
            const { settings } = await getSettings();
            setStoreAddress(settings.find(setting => setting.setting_key === 'store_address').setting_value);
            setStoreName(settings.find(setting => setting.setting_key === 'store_name').setting_value);
            setRetrievedReceipts(receipts);
            setFilteredReceipts(receipts);
            setAllReceipts(receipts);
            setDistinctPOSUsers([...new Set(receipts.map((record) => record.pos_name))].sort());
            setSortReceiptDateDESCClicked(true);
            setTimeout(() => {
              setLoading(false);
            }, 500);
        }
        catch(err){
            console.error('Error retrieving receipts', err);
            setLoading(true);
        }
    }
    const handleGetReceiptsDashboard = async(startDate) => {
      try{
        const { dashboard } = await getReceiptsDashboard(startDate);
        setDashboardData(dashboard[0]);
        console.log(dashboard[0]);
      } catch (err) {
        console.error('Error retrieving receipts', err);
      }
    }
    const getDates = async () =>{
      try {
        const { dates } = await getReceiptDates();
        const formattedDates = dates.map((date) =>
          moment(date.date_created).toDate()
        );
        setRetrievedReceiptDates(formattedDates);
      } catch (error) {
        console.error("Error retrieving receipt dates", error);
      }
    }
    const getItems = async (receiptSaleId) => {
        try {
            const { items } = await getReceiptItems(receiptSaleId);
            setRetrievedReceiptItems(items);
            console.log(items);
        }
        catch(err) {
            console.error('Error retrieving items', err);
        }
    }
    const handleVoidReceipt = async () => {
      try {
        if(userRole === 'staff'){
          const {status, dateRequested} = await staffVoidReceipt(receiptID);
          if(status === 'error'){
            setModalRefundErrorShow(true);
            setModalVoidShow(false);
            return;
          } 
          setReceiptStatus(status);
          setReceiptVoidDate(moment(dateRequested).format("LLL"));
          console.log("Receipt voided");
          setModalVoidShow(false);
          await getReceipts(startDate);
        } else if(userRole === 'admin'){
          const retrievedItems = retrievedReceiptItems.filter((item) => item.record_type === 'item'); 
          const {status, dateVoided} = await adminVoidReceipt(receiptID, retrievedItems);
          if(status === 'error'){
            setModalRefundErrorShow(true);
            setModalVoidShow(false);
            return;
          }
          setReceiptStatus(status);
          setReceiptVoidDate(moment(dateVoided).format("LLL"));
          console.log("Receipt voided");
          setModalVoidShow(false);
          await getReceipts(startDate);
        }
      } catch (error) {
          console.error("Error voiding receipt:", error.message);
      }
    }
    const handleCancelVoidReceipt = async (receiptIDValue) => {
      try {
        const {status} = await cancelVoidReceipt(receiptIDValue);
        setReceiptStatus(status);
        console.log("Receipt voided");
        await getReceipts(startDate);
      } catch (error) {
        console.error("Error voiding receipt", error);
      }
    }
    const handleRefundReceipt = async () => {
      setModalRefundShow(false)
      setRefundView(false);
      setRefundItems({});
      setRefundItemsDetails([]);
      setReceiptDetails([]);
      console.log("Refund receipt");
      try {
        await refundReceipt(receiptDetails.receipt_id, receiptDetails.sale_id, refundItemsDetails);
        await getReceipts(startDate);
      } catch (error) {
        console.error("Error refunding receipt", error);
      }
    }
    const handleCancelRefundReceipt = async () => {
      try {
        if(userRole === 'admin'){
          console.log("Cancel refund receipt");
          console.log(receiptDetails.receipt_id);
          const retrievedItems = retrievedReceiptItems.filter((item) => item.record_type === 'item'); 
          const {status, dateVoided} = await adminCancelRefundReceipt(receiptID, receiptDetails.original_receipt_name, retrievedItems);
          setReceiptStatus(status);
          setReceiptVoidDate(moment(dateVoided).format("LLL"));
          console.log("Receipt voided");
          setModalCancelRefundShow(false);
          await getReceipts(startDate);
        } else {
          console.log("Cancel refund receipt");
          console.log(receiptDetails.receipt_id);
          const {status, dateRequested} = await staffVoidReceipt(receiptID);
          setReceiptStatus(status);
          setReceiptVoidDate(moment(dateRequested).format("LLL"));
          console.log("Receipt voided");
          setModalCancelRefundShow(false);
          await getReceipts(startDate);
        }
      } catch (error) {
        console.error("Error cancelling refund receipt", error);
      }
    }

    // DO SOME MOBILE RESPONSIVE SHIT
    const handleResize = () => {
      if(window.innerWidth < 900){
          setReceiptDetailsContainer("receipt-container-close");
          setReceiptsContainer("receipts-container");
          setRightContainerStyle("right-container-close");
          setIsVisible(true);
      }
      else{
          setReceiptDetailsContainer("receipt-container");
          setReceiptsContainer("receipts-container");
          setRightContainerStyle("right-container");
          setIsVisible(true);
      }
    }
    const closeReceiptDetails = () => {
        if(window.innerWidth < 900){
            setRightContainerStyle("right-container-close");
            setReceiptsContainer("receipts-container");
        }
    }
    const closeReceipts = () => {
        if(window.innerWidth < 900){
          setReceiptsContainer("receipts-container-close");
          setRightContainerStyle("right-container");
        }
    }

    // FOR SEARCHING AND SORTING SHIT
    function searchReceipt(searchValue){
      if(selectedPosUser === 'all'){
          if(!searchValue){
            setFilteredReceipts(allReceipts);
            return;
          } else {
            setRetrievedReceipts(allReceipts);
            const searchResults = retrievedReceipts.filter((allReceipt) => 
              allReceipt.receipt_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())
            );
            setFilteredReceipts(searchResults);
          }
      } else if (selectedPosUser !== 'all'){
          if(!searchValue){
            setFilteredReceipts(allReceipts.filter((receipt) => receipt.pos_name === selectedPosUser));
            return;
          } else {
            const searchResults = allReceipts.filter((receipt) => receipt.pos_name === selectedPosUser &&
              receipt.receipt_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())
            );
            setFilteredReceipts(searchResults);
          }
      }
    }
    function showReceiptByAmount(sortValue){
      let sortedReceipts;
      if(sortValue === "asc"){
        sortedReceipts = [...retrievedReceipts].sort((a,b) => a.receipt_total_cost - b.receipt_total_cost);
        setSortReceiptAmountDESCClicked(false);
      } else if(sortValue === "desc"){
        sortedReceipts = [...retrievedReceipts].sort((a,b) => b.receipt_total_cost - a.receipt_total_cost);
        setSortReceiptAmountDESCClicked(true);
      }
      setFilteredReceipts(sortedReceipts);
      setReceiptSort("amount");
    }
    function showReceiptByDate(sortValue){
      let sortedReceipts;
      if(sortValue === "asc"){
        sortedReceipts = [...retrievedReceipts].sort((a,b) => new Date(a.date_created) - new Date(b.date_created));
        setSortReceiptDateDESCClicked(false);
      } else if(sortValue === "desc"){
        sortedReceipts = [...retrievedReceipts].sort((a,b) => new Date(b.date_created) - new Date(a.date_created));
        setSortReceiptDateDESCClicked(true);
      }
      setFilteredReceipts(sortedReceipts);
      setReceiptSort("date");
    }
    function handleChangePOSUser(value){
        if(value !== 'all'){
            setSelectedPosUser(value);
            setFilteredReceipts(retrievedReceipts.filter((receipt) => receipt.pos_name === value))
            // records.filter((record) => record.pos_name === value) returns an array of records with the selected POS user
        } else{
            setSelectedPosUser('all');
            setFilteredReceipts(allReceipts);
        }
        console.log(value)
    }
  
    // GET RECEIPTS ON PAGE LOAD
    useEffect(() => {
      getReceipts(startDate);
      handleGetReceiptsDashboard(startDate);
    }, [startDate]);

    // GET DATES ON PAGE LOAD
    useEffect(() => {
      getDates();
    }, []);

    // RESIZE EVENT LISTENER
    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
    }, [isVisible]);

    function handleRefundQty(itemId, qtyValue){
      try {
        const updatedRefundItemsDetails = refundItemsDetails.map((refundItem) => {
          if(refundItem.id === itemId && qtyValue > 0){
            return { ...refundItem, qty: qtyValue};
          } else if (refundItem.id === itemId && qtyValue <= 0) {
            return { ...refundItem, qty: qtyValue};
          }
          return refundItem;
        })
        setRefundItemsDetails(updatedRefundItemsDetails);
      } catch (error) {
        console.log("Error updating refund qty", error);
      }
    }

    const handleCheckboxChange = (item) => {
      setRefundItems((prevState) => ({
        ...prevState,
        [item.item_id]: !prevState[item.item_id]
      }));

      if(!refundItems[item.item_id]){
        setRefundItemsDetails(oldArray => [...oldArray,{
          id: item.item_id,
          qty: item.refund_qty > 0 ? item.qty - item.refund_qty : item.qty,
          stock_count: item.item_stock_count,
          unit_price: item.item_unit_price,
        }]);
      } 
      else {
        setRefundItemsDetails(refundItemsDetails.filter((refundItem) => refundItem.id !== item.item_id));
      }
    }
    
    function VoidConfirmation({ onHide, onConfirm, ...props }) {
      return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userRole === 'staff' && <p>Are you sure you want to cancel this receipt? If yes, admin's approval will be required.</p>}
            {userRole === 'admin' && 
            <div>
              <p>Are you sure you want to cancel this receipt?</p>
              <ul>
                <li>Items will be returned to stock.</li>
                <li>Receipt will not be accounted in records and reports.</li>
              </ul>
            </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
                onConfirm();
            }}>
              Confirm
            </Button>
            <Button variant="danger" onClick={() => {
                onHide();
              }}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    function RefundConfirmation({ onHide, onConfirm, ...props }) {
      return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userRole === 'staff' && 
            <div>
              <p>Are you sure you want to refund these items?</p>
            </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
                onHide();
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {
                onConfirm();
              }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    function RefundError({ ...props }) {
      return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Message
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Refunded receipts must be cancelled first.</p>
          </Modal.Body>
        </Modal>
      );
    }
    function CancelRefundConfirmation({ onHide, onConfirm, ...props }) {
      return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userRole === 'staff' && <p>Are you sure you want to cancel this refund? If yes, admin's approval will be required.</p>}
            {userRole === 'admin' && 
            <div>
              <p>Are you sure you want to cancel this refund?</p>
              <ul>
                <li>Items will be deducted from stock.</li>
                <li>Receipt will not be accounted in records and reports.</li>
              </ul>
            </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
                onConfirm();
            }}>
              Confirm
            </Button>
            <Button variant="primary" onClick={() => {
                onHide();
              }}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [modalVoidShow, setModalVoidShow] = useState(false);
    const [modalRefundShow, setModalRefundShow] = useState(false);
    const [modalCancelRefundShow, setModalCancelRefundShow] = useState(false);
    const [modalRefundErrorShow, setModalRefundErrorShow] = useState(false);

    const handleReturnView = () => {
        setReturnView(true);
    }

    // DISPLAY LOADING IF SHIT AINT WORKING
    if(loading) return <LoadingPage classStyle="loading-in-page"/>

    // DISPLAY THIS IF SHIT WORKS
    return (
      <div className="receipts p-3">
        <ResponsivePageLayout
          rightContainer={rightContainerStyle}
          leftContent={
            <div className={receiptsContainer}>
              <VoidConfirmation
                show={modalVoidShow}
                onHide={() => setModalVoidShow(false)}
                onConfirm={handleVoidReceipt}
              />
              <RefundConfirmation
                show={modalRefundShow}
                onHide={() => setModalRefundShow(false)}
                onConfirm={handleRefundReceipt}
              />
              <CancelRefundConfirmation
                show={modalCancelRefundShow}
                onHide={() => setModalCancelRefundShow(false)}
                onConfirm={handleCancelRefundReceipt}
              />
              <RefundError
                show={modalRefundErrorShow}
                onHide={() => setModalRefundErrorShow(false)}
              />
              <div className="receipts-nav">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(moment(date).format("YYYY-MM-DD"));
                    getReceipts(
                      moment(date).format("YYYY-MM-DD")
                    );
                    setReceiptDetails([]);
                    setRefundView(false);
                    setShowDashboardDataToday(true);
                    setReturnView(false);
                  }}
                  dateFormat="MMMM d, yyyy"
                  maxDate={new Date()}
                  isClearable={false}
                  todayButton="Today"
                  scrollableYearDropdown={true}
                  highlightDates={retrievedReceiptDates}
                  customInput={<DisabledDateInput className="date-picker" />}
                />
                <div className="search-sorting">
                  <SearchBar
                      value={searchTerm}
                      onChange={(e) => {
                          searchReceipt(e.target.value);
                          setSearchTerm(e.target.value)
                      }}
                      placeholder="Search for receipt name"
                  />
                  <div className="sorting">
                    <button
                      className={receiptSort === "amount" ? "active" : ""}
                      onClick={() => {
                        if (sortReceiptAmountDESCClicked) {
                          showReceiptByAmount("asc");
                        } else {
                          showReceiptByAmount("desc");
                        }
                      }}
                    >
                      {!sortReceiptAmountDESCClicked && (
                        <i className="fa-solid fa-arrow-down-1-9"></i>
                      )}
                      {sortReceiptAmountDESCClicked && (
                        <i className="fa-solid fa-arrow-down-9-1"></i>
                      )}
                    </button>
                    <button
                      className={receiptSort === "date" ? "active" : ""}
                      onClick={() => {
                        if (!sortReceiptDateDESCClicked) {
                          showReceiptByDate("desc");
                        } else {
                          showReceiptByDate("asc");
                        }
                      }}
                    >
                      {!sortReceiptDateDESCClicked && ("Oldest")}
                      {sortReceiptDateDESCClicked && ("Latest")}
                    </button>
                  </div>
                </div>
              </div>
              {userRole === 'admin' && 
              <div className="pos-users">
                  <p>Filter by:</p> 
                  <select name="" id="" onChange={(e) => handleChangePOSUser(e.target.value)} defaultValue={'all'}> 
                      <option value="all">All users</option>
                      {distinctPOSUsers.map((posUser, index) => (
                          <option key={index} value={posUser}>{posUser}</option>
                      ))}
                  </select>
              </div>}
              <div className="list">
                {filteredReceipts.length === 0 &&
                  (startDate === moment(todayDate).format("YYYY-MM-DD") ? (
                    <div className="empty-list">
                      <p>{searchValue !== "" ? "No receipts found." : "There are no receipts today."}</p>
                    </div>
                  ) : (
                    <div className="empty-list">
                      <p>No receipts found.</p>
                    </div>
                  ))}
                {filteredReceipts.length > 0 &&
                  filteredReceipts.map((receipt, receiptIndex) => {
                    return (
                      <div
                        key={receiptIndex}
                        className="list-item"
                        onClick={() => {
                          setReceiptDetails(receipt);
                          getItems(receipt.sale_id);
                          setRightContainerStyle("right-container");
                          setReceiptStatus(receipt.status);
                          closeReceipts();
                          setRefundView(false);
                        }}
                      >
                        <div className="list-item-content">
                          <div className="left">
                              {userRole === 'admin' && 
                              <>
                                <div className="sender">
                                    <div className="userIcon-name">
                                      <i className="fa-solid fa-user"></i>
                                      <p>{receipt.pos_name}</p>
                                    </div>
                                </div>
                              </>
                              }
                              <div className="name">
                                    <p className='receipt-name'>{receipt.receipt_name}</p>
                                  <div className='name-row'>
                                    <p className={receipt.receipt_type}>{receipt.receipt_type !== 'sale' ? receipt.receipt_type + ' ' + receipt.original_receipt_name : receipt.receipt_type }</p>
                                    {receipt.status === 'pending' &&
                                    <p className='void-request'>Cancel Requested</p>
                                    }
                                    {receipt.status === 'voided' &&
                                    <p className='void-approved'>Cancelled</p>
                                    }
                                  </div>
                              </div>
                          </div>
                          <div className="right">
                              <div className="time">
                                  <p>{moment(receipt.date_created).format("LT")}</p>
                              </div>
                              <div className="total">
                                  <p>{PesoFormat.format(receipt.receipt_total_cost)}</p>
                              </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          }
          rightContent={
            <div className="receipt-container">
              {(receiptDetails.length === 0 && userRole === 'staff') && (
                <>
                  <div className="receipt-nav">
                      <h4>Receipt Details</h4>
                  </div>
                  <p>Select a receipt to view details.</p>
                </>
              )}
              {(receiptDetails.length === 0 && userRole === 'admin') && (
                <>
                  <div className="container-content" onClick={() => setShowDashboardDataToday(!showDashboardDataToday)}>
                      {showDashboardDataToday && 
                      <div className="main-content">
                          <div className="number">{dashboardData.receipts_today}</div>
                          <div className="title">Receipts {startDate === nowDate ? 'Today' : ' this day'}</div>
                      </div>
                      }
                      {!showDashboardDataToday && 
                      <div className="main-content">
                          <div className="number">{dashboardData.receipts_total}</div>
                          <div className="title">Receipts Total</div>
                      </div>
                      }
                  </div>

                  <div className="container-content" onClick={() => setShowDashboardDataToday(!showDashboardDataToday)}>
                      {showDashboardDataToday && 
                      <div className="main-content">
                          <div className="number">{dashboardData.sale_receipts_today}</div>
                          <div className="title">Sale {startDate === nowDate ? 'Today' : ' this day'}</div>
                      </div>}
                      {!showDashboardDataToday && 
                      <div className="main-content">
                          <div className="number">{dashboardData.sale_receipts_total}</div>
                          <div className="title">Sale Total</div>
                      </div>}
                  </div>

                  <div className="container-content" onClick={() => setShowDashboardDataToday(!showDashboardDataToday)}>
                      {showDashboardDataToday && 
                      <div className="main-content">
                          <div className="number">{dashboardData.refund_receipts_today}</div>
                          <div className="title">Refunds {startDate === nowDate ? 'Today' : ' this day'}</div>
                      </div>}
                      {!showDashboardDataToday && 
                      <div className="main-content">
                          <div className="number">{dashboardData.refund_receipts_total}</div>
                          <div className="title">Refunds Total</div>
                      </div>}
                  </div>

                  <div className="container-content" onClick={() => setShowDashboardDataToday(!showDashboardDataToday)}>
                      {showDashboardDataToday && <div className="main-content">
                          <div className="number">{dashboardData.cancelled_receipts_today}</div>
                          <div className="title">Cancelled {startDate === nowDate ? 'Today' : ' this day'}</div>
                      </div>}
                      {!showDashboardDataToday && <div className="main-content">
                          <div className="number">{dashboardData.cancelled_receipts_total}</div>
                          <div className="title">Cancelled Total</div>
                      </div>}
                  </div>
                </>
              )}
              {(receiptDetails.length !== 0 && !refundView && !returnView) && (
                <>
                  <div className="receipt-nav">
                    <h4>Receipt Details</h4>
                    <div className="print-close">
                      {receiptDetails.status !== 'voided' && 
                      <i className="fa-solid fa-print"
                        onClick={() => {
                          window.print();
                        }}
                      ></i>}
                      <i className="fa-solid fa-xmark"
                        onClick={() => {
                          setReceiptDetails([]);
                          closeReceiptDetails();
                        }}
                      ></i>
                    </div>
                  </div>
                  <div className="receipt-details-info">
                    <div className="receipt-details-info-header">
                      <p>{receiptDetails.receipt_name}</p>
                      {receiptDetails.receipt_type !== 'sale' && <p className='original-receipt'><span>{receiptDetails.receipt_type}</span> {receiptDetails.original_receipt_name}</p>}
                      <p>
                        {moment(receiptDetails.date_created).format("LL")} -{" "}
                        {moment(receiptDetails.date_created).format("LT")}
                      </p>
                      <p>{storeAddress}</p>
                      <p className='name'>{receiptDetails.pos_name}</p>
                      {receiptStatus === 'pending' && <p className='voided'>Cancel requested on {receiptVoidDate || moment(receiptDetails.date_updated).format("LLL")}.</p>}
                      {receiptStatus === 'voided' && <p className='voided'>Receipt voided on {receiptVoidDate || moment(receiptDetails.date_updated).format("LLL")}.</p>}
                      <div className="total">
                        <p>{PesoFormat.format(receiptDetails.receipt_total_cost)}</p>
                        <p>Total</p>
                      </div>
                    </div>
                    <div className="receipt-details-info-content">
                      {retrievedReceiptItems.length > 0 &&
                        retrievedReceiptItems.map((item, itemIndex) => {
                          return (
                            <div className='receipt-details-item' key={itemIndex}> 
                                <div className="left">    
                                    <p className="name">{item.item_name}</p>
                                    {item.record_type === 'item' && <p className="qty-unit-price">{item.qty} x {item.item_unit_price}</p>}
                                    {item.record_type === 'mechanic' && <p className="qty-unit-price">Mechanic Service</p>}
                                </div>
                                <p className='total-price'>{PesoFormat.format(item.item_total_price)}</p>
                            </div>
                          );
                        })}
                    </div>
                    <div className="total-paid-change">
                      <div className="total">
                        <p>Total</p>
                        <p>{PesoFormat.format(receiptDetails.receipt_total_cost)}
                        </p>
                      </div>
                      <div className="paid">
                        <p>Paid</p>
                        <p>{PesoFormat.format(receiptDetails.receipt_paid_amount)}
                        </p>
                      </div>
                      <div className="change">
                        <p>Change</p>
                        <p>
                          {PesoFormat.format(receiptDetails.receipt_change)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="void-refund">
                    {(userRole === 'staff' && receiptStatus === 'active') &&
                      <>
                        <button onClick={() => {
                          setModalVoidShow(true);
                          setReceiptID(receiptDetails.receipt_id);
                        }}
                        >Request Cancel</button>
                        {receiptDetails.receipt_type === 'sale' && <button onClick={() => setRefundView(true)}
                        >Refund</button>}
                        {receiptDetails.receipt_type === 'sale' && <button onClick={handleReturnView}
                        >Return</button>}
                      </>
                    }
                    {(userRole === 'staff' && receiptStatus === 'pending') &&
                      <>
                        <p>Waiting for approval.</p>
                      </>
                    }
                    {(userRole === 'admin' && receiptStatus === 'pending') &&
                    <>
                      <button onClick={() => {
                        if(receiptDetails.receipt_type === 'refund'){
                          setModalCancelRefundShow(true);
                        } else {
                          setModalVoidShow(true);
                        }
                        setReceiptID(receiptDetails.receipt_id);
                      }}
                      >Approve Cancel Request</button>
                      <button onClick={() => handleCancelVoidReceipt(receiptDetails.receipt_id)}
                      >Cancel</button>
                    </>
                    }
                    {(userRole === 'admin' && receiptStatus === 'active') &&
                    <>
                      <button onClick={() => {
                        if(receiptDetails.receipt_type === 'refund'){
                          setModalCancelRefundShow(true);
                        } else {
                          setModalVoidShow(true);
                        }
                        setReceiptID(receiptDetails.receipt_id);
                      }}
                      >Cancel Receipt</button>
                    </>
                    }
                  </div>
                </>
              )}
              {(refundView && !returnView) && (
                <>
                  <div className="receipt-nav">
                    <h4>Refund Receipt</h4>
                    <div className="print-close">
                      <i className="fa-solid fa-xmark"
                        onClick={() => {
                          setRefundView(false);
                          setRefundItems({});
                          setRefundItemsDetails([]);
                        }}
                      ></i>
                    </div>
                  </div>
                  <div className="receipt-details-info">
                    <div className="receipt-details-info-content">
                      {retrievedReceiptItems.filter((item) => item.record_type === 'item' && item.refund_qty !== item.qty).length === 0 &&
                        <div className='refund-details-item'>
                            <p>All items in this receipt were already refunded.</p>
                        </div>
                      }
                      {retrievedReceiptItems.length > 0 &&
                        retrievedReceiptItems.filter((item) => item.record_type === 'item').map((item, itemIndex) => {
                        return (
                          <div className='refund-details-item' key={itemIndex}>
                              <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(item)}  // Toggle the checkbox state
                                disabled={item.refund_qty === item.qty || item.return_qty === item.qty || item.refund_qty + item.return_qty === item.qty? true : false}
                              />
                              <div className="left">    
                                  <p className="name">{item.item_name} <span id='item-qty'>x {item.qty}</span></p>
                                  {item.refund_qty > 0 && <p className="qty-unit-price">Refunded x {item.refund_qty}</p>}
                                  {item.return_qty > 0 && <p className="qty-unit-price">Returned x {item.return_qty}</p>}
                                  {refundItems[item.item_id] &&                         
                                    <div className='refund-input'>
                                      <div className="refund-qty">
                                        { refundItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty >= 2 ?
                                        <button
                                          onClick={() => {
                                            handleRefundQty(item.item_id, refundItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty -1);
                                          }}
                                        >-</button> : 
                                        <button className="no-decrease">-</button>
                                        }
                                        <input
                                          type="number"
                                          value={refundItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty}
                                          min={1}
                                          onChange={(e) => {
                                            const newQty = Number(e.target.value);
                                            const referenceQty = item.refund_qty > 0 ? item.qty - item.refund_qty : item.qty;
                                            if(newQty <= referenceQty){
                                              handleRefundQty(item.item_id, e.target.value);
                                            }
                                          }}
                                          />
                                        { refundItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty < (item.refund_qty > 0 ? item.qty - item.refund_qty : item.qty) ?
                                        <button
                                          onClick={() => {
                                            handleRefundQty(item.item_id, refundItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty + 1);
                                          }}
                                        >+</button> : 
                                        <button className="no-decrease">+</button>
                                        }
                                        <p>Refund x {refundItemsDetails.find((refundItem) => refundItem.id === item.item_id).qty}</p>
                                      </div>
                                    </div>
                                  }
                              </div>
                              <div className="total-price">
                                {(() => {
                                  const refundItem = refundItemsDetails.find(
                                    (refundItem) => refundItem.id === item.item_id
                                  );
                                  return (
                                    <p>
                                      {PesoFormat.format((refundItem?.qty || 0) * item.item_unit_price)}
                                    </p>
                                  );
                                })()}
                              </div>
                          </div>
                        );
                      })}
                     
                    </div>
                  </div>
                  {Object.values(refundItems).includes(true) ? (
                      <div className="confirm-refund">
                        <button
                          onClick={() => setModalRefundShow(true)}
                        >Confirm Refund</button>
                      </div>
                    ) : (
                      <div className="cannot-refund">
                        <p>Confirm Refund</p>
                      </div>
                    )
                  }
                </>
              )}
              {(!refundView && returnView) && (
                <Return 
                  setReturnView={setReturnView}
                  receiptDetails={receiptDetails}
                  retrievedReceiptItems={retrievedReceiptItems}
                  PesoFormat={PesoFormat}
                  getReceipts={getReceipts}
                  startDate={startDate}
                />
              )}
              {/* Hidden print area - to be fixed */}
              <div id="print-area" className="print-only">
                {receiptDetails.length !== 0 && (
                  <div className="receipt-details-info">
                    <h1>{storeName}</h1>
                  <div className="receipt-details-info-header">
                    <p>{receiptDetails.receipt_name}</p>
                    <p>
                      {moment(receiptDetails.date_created).format("LL")} -{" "}
                      {moment(receiptDetails.date_created).format("LT")}
                    </p>
                    <p>{storeAddress}</p>
                    <p>{receiptDetails.pos_name}</p>
                    <div className="total">
                      <p>{PesoFormat.format(receiptDetails.receipt_total_cost)}</p>
                      <p>Total</p>
                    </div>
                  </div>
                  <div className="receipt-details-info-content">
                    {retrievedReceiptItems.length > 0 &&
                      retrievedReceiptItems.map((item, itemIndex) => {
                        return (
                          <div className='receipt-details-item' key={itemIndex}> 
                              <div className="left">    
                                  <p className="name">{item.item_name}</p>
                                  {item.record_type === 'item' && <p className="qty-unit-price">{item.qty} x {item.item_unit_price}</p>}
                                  {item.record_type === 'mechanic' && <p className="qty-unit-price">Mechanic Service</p>}
                              </div>
                              <p className='total-price'>{PesoFormat.format(item.item_total_price)}</p>
                          </div>
                        );
                      })}
                  </div>
                  <div className="total-paid-change">
                    <div className="total">
                      <p>Total</p>
                      <p>{PesoFormat.format(receiptDetails.receipt_total_cost)}
                      </p>
                    </div>
                    <div className="paid">
                      <p>Paid</p>
                      <p>{PesoFormat.format(receiptDetails.receipt_paid_amount)}
                      </p>
                    </div>
                    <div className="change">
                      <p>Change</p>
                      <p>
                        {PesoFormat.format(receiptDetails.receipt_change)}
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          }
        />
      </div>
    );
};

export default Receipts;