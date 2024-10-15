import './receipts.scss'
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import { useEffect, useState, forwardRef } from 'react';
import { getPosReceipts, getReceiptItems, getReceiptDates, staffVoidReceipt, cancelVoidReceipt, adminVoidReceipt} from '../../services/receiptService';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingPage from '../../components/loading-page/loading-page';
import SearchBar from "../../components/search-bar/search-bar";
import {Modal, Button} from 'react-bootstrap';

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
    
    // DATE FOR REACT-DATEPICKER
    const [startDate, setStartDate] = useState(moment(todayDate).format("YYYY-MM-DD"));

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

    const [userRole, setRole] = useState('');

    // FETCH SHIT FROM DATABASE
    const getReceipts = async (startDate) => {
        try{
            const { receipts, role } = await getPosReceipts(startDate);
            setRole(role);
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
          const {status, dateVoided} = await staffVoidReceipt(receiptID);
          setReceiptStatus(status);
          setReceiptVoidDate(moment(dateVoided).format("LLL"));
          console.log("Receipt voided");
          setModalShow(false);
          await getReceipts(startDate);
        } else if(userRole === 'admin'){
          const retrievedItems = retrievedReceiptItems.filter((item) => item.record_type === 'item'); 
          const {status, dateVoided} = await adminVoidReceipt(receiptID, retrievedItems);
          setReceiptStatus(status);
          setReceiptVoidDate(moment(dateVoided).format("LLL"));
          console.log("Receipt voided");
          setModalShow(false);
          await getReceipts(startDate);
        }
      } catch (error) {
        console.error("Error voiding receipt", error);
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

    function MyVerticallyCenteredModalConfirmation({ onHide, onConfirm, ...props }) {
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
            {userRole === 'staff' && <p>Are you sure you want to void this receipt? If yes, admin's approval will be required.</p>}
            {userRole === 'admin' && 
            <div>
              <p>Are you sure you want to void this receipt?</p>
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
    const [modalShow, setModalShow] = useState(false);

    // DISPLAY LOADING IF SHIT AINT WORKING
    if(loading) return <LoadingPage classStyle="loading-in-page"/>

    // DISPLAY THIS IF SHIT WORKS
    return (
      <div className="receipts p-3">
        <ResponsivePageLayout
          rightContainer={rightContainerStyle}
          leftContent={
            <div className={receiptsContainer}>
              <MyVerticallyCenteredModalConfirmation
                show={modalShow}
                onHide={() => setModalShow(false)}
                onConfirm={handleVoidReceipt}
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
              <div className="list">
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
                        }}
                      >
                        <div className="list-item-content">
                          <div className="left">
                              {userRole === 'admin' && 
                              <div className="sender">
                                  <p>{receipt.pos_name}</p>
                                  {receipt.status === 'pending' && <p className='void-request'>Void requested</p>}
                                  {receipt.status === 'voided' && <p className='void-approved'>Receipt voided</p>}
                              </div>
                              }
                              <div className="name">
                                  <p>{receipt.receipt_name}</p>
                                  {userRole === 'staff' && <p className='void-request'>{receipt.status === 'pending' && 'Void requested'}</p>}
                                  {userRole === 'staff' && <p className='void-approved'>{receipt.status === 'voided' && 'Receipt voided'}</p>}
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
              <div className="receipt-nav">
                <h4>Receipt Details</h4>
                {receiptDetails.length !== 0 && (
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
                )}
              </div>
              {receiptDetails.length === 0 && (
                <p>Select a receipt to view details.</p>
              )}
              {receiptDetails.length !== 0 && (
                <div className="receipt-details-info">
                  <div className="receipt-details-info-header">
                    <p>{receiptDetails.receipt_name}</p>
                    <p>
                      {moment(receiptDetails.date_created).format("LL")} -{" "}
                      {moment(receiptDetails.date_created).format("LT")}
                    </p>
                    <p className='name'>{receiptDetails.pos_name}</p>
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
              )}
              {receiptDetails.length !== 0 &&
                <div className="void-refund">
                  {(userRole === 'staff' && receiptStatus === 'active') &&
                    <>
                      <button onClick={() => {
                        setModalShow(true);
                        setReceiptID(receiptDetails.receipt_id);
                      }}
                      >Request Void</button>
                      <button>Refund</button>
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
                      setModalShow(true);
                      setReceiptID(receiptDetails.receipt_id);
                    }}
                    >Approve Void</button>
                    <button onClick={() => handleCancelVoidReceipt(receiptDetails.receipt_id)}
                    >Cancel</button>
                  </>
                  }
                </div>
              }
              {/* Hidden print area - to be fixed */}
              <div id="print-area" className="print-only">
                {receiptDetails.length !== 0 && (
                  <div className="receipt-details-info">
                  <div className="receipt-details-info-header">
                    <p>{receiptDetails.receipt_name}</p>
                    <p>
                      {moment(receiptDetails.date_created).format("LL")} -{" "}
                      {moment(receiptDetails.date_created).format("LT")}
                    </p>
                    <p>AronBikes</p>
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