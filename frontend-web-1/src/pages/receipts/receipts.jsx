import './receipts.scss'
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import { useEffect, useState, forwardRef } from 'react';
import { getPosReceipts, getReceiptItems, getReceiptMechanics, getReceiptDates } from '../../services/receiptService';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingPage from '../../components/loading-page/loading-page';

const Receipts = () => {
    // SOME STUFF
    const todayDate = new Date();

    // RECEIPTS
    const [allReceipts, setAllReceipts] = useState([]);
    const [retrievedReceipts, setRetrievedReceipts] = useState([]);

    // GET ALL DATES THAT HAVE RECEIPTS
    const [retrievedReceiptDates, setRetrievedReceiptDates] = useState([]);

    // RECEIPT DETAILS
    const [receiptDetails, setReceiptDetails] = useState([]);
    const [retrievedReceiptItems, setRetrievedReceiptItems] = useState([]);
    const [retrievedReceiptMechanics, setRetrievedReceiptMechanics] = useState([]);
    
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

    // FETCH SHIT FROM DATABASE
    const getReceipts = async (startDate) => {
        try{
            const { receipts } = await getPosReceipts(startDate);
            setRetrievedReceipts(receipts);
            setAllReceipts(receipts);
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
    const getMechanics = async (receiptSaleId) => {
        try {
            const { mechanics } = await getReceiptMechanics(receiptSaleId);
            setRetrievedReceiptMechanics(mechanics);
            console.log(mechanics);
        }
        catch(err) {
            console.error('Error retrieving mechanics', err);
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
      if(!searchValue){
        setRetrievedReceipts(allReceipts);
        return;
      }else{
        const searchResults = allReceipts.filter((allReceipt) => 
          allReceipt.receipt_name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
        );
        console.log(searchResults);
        setRetrievedReceipts(searchResults);
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
      setRetrievedReceipts(sortedReceipts);
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
      setRetrievedReceipts(sortedReceipts);
      setReceiptSort("date");
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

    // DISPLAY LOADING IF SHIT AINT WORKING
    if(loading) return <LoadingPage classStyle="loading-in-page"/>

    // DISPLAY THIS IF SHIT WORKS
    return (
      <div className="receipts p-3">
        <ResponsivePageLayout
          rightContainer={rightContainerStyle}
          leftContent={
            <div className={receiptsContainer}>
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
                  <div className="search-bar">
                    <input
                      type="text"
                      onChange={(e) => {
                        searchReceipt(e.target.value);
                        setSearchValue(e.target.value);
                      }}
                      placeholder="Search for receipt name"
                    />
                  </div>
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
                {retrievedReceipts.length === 0 &&
                  (startDate === moment(todayDate).format("YYYY-MM-DD") ? (
                    <div className="empty-list">
                      <p>{searchValue !== "" ? "No receipts found." : "There are no receipts today."}</p>
                    </div>
                  ) : (
                    <div className="empty-list">
                      <p>No receipts found.</p>
                    </div>
                  ))}
                {retrievedReceipts.length > 0 &&
                  retrievedReceipts.map((receipt, receiptIndex) => {
                    return (
                      <div
                        key={receiptIndex}
                        className="list-item"
                        onClick={() => {
                          setReceiptDetails(receipt);
                          getItems(receipt.sale_id);
                          getMechanics(receipt.sale_id);
                          setRightContainerStyle("right-container");
                          closeReceipts();
                        }}
                      >
                        <div className="list-item-content">
                          <p>{receipt.receipt_name}</p>
                          <div className="list-item-info">
                            <p className="time">
                              {moment(receipt.date_created).format("LT")}
                            </p>
                            <p className="cost">
                              {PesoFormat.format(receipt.receipt_total_cost)}
                            </p>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={20}
                      viewBox="0 0 512 512"
                      className="print-close"
                      onClick={() => {
                        window.print();
                      }}
                    >
                      <path d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={25}
                      viewBox="0 0 384 512"
                      className="print-close"
                      onClick={() => {
                        setReceiptDetails([]);
                        closeReceiptDetails();
                      }}
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  </div>
                )}
              </div>
              {receiptDetails.length === 0 && (
                <p>Select a receipt to view details.</p>
              )}
              {receiptDetails.length !== 0 && (
                <div className="receipt-details">
                  <div className="receipt-details-content">
                    <div className="receipt-details-info">
                      <div className="receipt-details-info-header">
                        <p>{receiptDetails.receipt_name}</p>
                        <p>
                          {moment(receiptDetails.date_created).format("LL")} -{" "}
                          {moment(receiptDetails.date_created).format("LT")}
                        </p>
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
                              <div
                                key={itemIndex}
                                className="receipt-details-item"
                              >
                                <div className="item-detail-top">
                                  <p>{item.item_name}</p>
                                  <p className="total-price">
                                    {PesoFormat.format(item.item_total_price)}
                                  </p>
                                </div>
                                <div className="item-detail-bottom">
                                  <p>
                                    {item.item_qty} x {" "}
                                    {PesoFormat.format(item.item_unit_price)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        {retrievedReceiptMechanics.length > 0 &&
                          retrievedReceiptMechanics.map(
                            (mechanic, mechanicIndex) => {
                              return (
                                <div 
                                  key={mechanicIndex}
                                  className="receipt-details-item"
                                >
                                  <div className="item-detail-top">
                                    <p>
                                      {mechanic.mechanic_name + " (Mechanic Service)"}
                                    </p>
                                    <p className="total-price">
                                      {PesoFormat.format(mechanic.service_price)}
                                    </p>
                                  </div>
                                  <div className="item-detail-bottom">
                                    <p>{PesoFormat.format(mechanic.service_price)}</p>
                                  </div>
                                </div>
                              );
                            }
                          )}
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
                  </div>
                </div>
              )}
              {/* Hidden print area - to be fixed */}
              <div id="print-area" className="print-only">
                {receiptDetails.length !== 0 && (
                  <div className="receipt-details">
                    <div className="receipt-details-content">
                      <div className="receipt-details-info">
                        <div className="receipt-details-info-header">
                          <p>{receiptDetails.receipt_name}</p>
                          <p>
                            {moment(receiptDetails.date_created).format("LL")} -{" "}
                            {moment(receiptDetails.date_created).format("LT")}
                          </p>
                          <p>{receiptDetails.pos_name}</p>
                          <div className="total">
                            <p>
                              {PesoFormat.format(
                                receiptDetails.receipt_total_cost
                              )}
                            </p>
                            <p>Total</p>
                          </div>
                        </div>
                        <div className="receipt-details-info-content">
                          {retrievedReceiptItems.length > 0 &&
                            retrievedReceiptItems.map((item, itemIndex) => {
                              return (
                                <div
                                  key={itemIndex}
                                  className="receipt-details-item"
                                >
                                  <div className="item-detail-top">
                                    <p>{item.item_name}</p>
                                    <p className="total-price">
                                      {PesoFormat.format(item.item_total_price)}
                                    </p>
                                  </div>
                                  <div className="item-detail-bottom">
                                    <p>
                                      {item.item_qty} x{" "}
                                      {PesoFormat.format(item.item_unit_price)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          {retrievedReceiptMechanics.length > 0 &&
                            retrievedReceiptMechanics.map(
                              (mechanic, mechanicIndex) => {
                                return (
                                  <div
                                    key={mechanicIndex}
                                    className="receipt-details-item"
                                  >
                                    <div className="item-detail-top">
                                      <p>{mechanic.mechanic_name}</p>
                                      <p className="total-price">
                                        {PesoFormat.format(
                                          mechanic.service_price
                                        )}
                                      </p>
                                    </div>
                                    <div className="item-detail-bottom">
                                      <p>
                                        {PesoFormat.format(
                                          mechanic.service_price
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                        </div>
                        <div className="total-paid-change">
                          <div className="total">
                            <p>Total</p>
                            <p>
                              {PesoFormat.format(
                                receiptDetails.receipt_total_cost
                              )}
                            </p>
                          </div>
                          <div className="paid">
                            <p>Paid</p>
                            <p>
                              {PesoFormat.format(
                                receiptDetails.receipt_paid_amount
                              )}
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