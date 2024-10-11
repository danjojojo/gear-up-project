import './records.scss';
import PageLayout from '../../components/page-layout/page-layout';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import LoadingPage from '../../components/loading-page/loading-page';
import ErrorLoad from '../../components/error-load/error-load';
import { getDashboardData, getRecords, getHighlightDates, getInnerRecords, getLeaderBoards } from '../../services/recordsService';
import RecordModal from '../../components/record-modal/record-modal';

const Records = () => {
    const [selectedRecord, setSelectedRecord] = useState('sales');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[2]; // Extract 'sales', 'labor', or 'expenses'
        if (path && ['sales', 'labor', 'expenses'].includes(path)) {
            setSelectedRecord(path);
        } else {
            // Default to 'sales' if the path is invalid
            setSelectedRecord('sales');
            navigate('/records/sales');
        }
    }, [location.pathname, navigate]);

    const handleTabChange = (value) => {
        if (selectedRecord !== value) {
            setSelectedRecord(value);
            setStartDate(nowDate); 
            setStartLeaderboardDate(nowDate);
            setEndLeaderboardDate(nowDate);
            navigate(`/records/${value}`);
        }
    };

    const todayDate = new Date();
    const nowDate = moment(todayDate).format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(moment(todayDate).format("YYYY-MM-DD"));
    const [startLeaderboardDate, setStartLeaderboardDate] = useState(moment(todayDate).format("YYYY-MM-DD"));
    const [endLeaderboardDate, setEndLeaderboardDate] = useState(moment(todayDate).format("YYYY-MM-DD"));
    const salesStartDate = todayDate;
    const laborStartDate = todayDate;
    const expensesStartDate = todayDate;

    const [loading, setLoading] = useState(true);
    const [errorLoad, setErrorLoad] = useState(false);

    const [dashboard1Data, setDashboard1Data] = useState(0);
    const [dashboard2Data, setDashboard2Data] = useState(0);
    const [dashboard3Data, setDashboard3Data] = useState(0);
    const [dashboard4Data, setDashboard4Data] = useState(0);

    const [records, setRecords] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [filteredRecordsByPOSUser, setFilteredRecordsByPOSUser] = useState([]);
    const [distinctPOSUsers, setDistinctPOSUsers] = useState([]);

    const [modalName, setModalName] = useState('');
    const [modalDate, setModalDate] = useState('');
    const [modalPOSName, setModalPOSName] = useState('');
    const [modalSubtotal, setModalSubtotal] = useState(0);
    const [innerRecords, setInnerRecords] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedLBfilter, setSelectedLBfilter] = useState('calendar');

    const defaultSelectValue = 'all';

    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    const handleDashboardData = async (selectedRecord, selectedDate) => {
        try {
            const { d1, d2, d3, d4} = await getDashboardData(selectedRecord, selectedDate);
            setDashboard1Data(d1);
            setDashboard2Data(d2);
            setDashboard3Data(d3);
            setDashboard4Data(d4);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);   
            }, 1000);
        }
    }
    
    const handleRecords = async (selectedRecord, selectedDate) => {
        try {
            const { records } = await getRecords(selectedRecord, selectedDate);
            setRecords(records);
            setFilteredRecordsByPOSUser(records);
            setDistinctPOSUsers([...new Set(records.map((records) => records.pos_name))].sort());
            // ...new Set() removes duplicates
            // ...new Set(records.map((records) => records.pos_name)) returns an array of unique POS names
            // .sort() sorts the array alphabetically
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);   
            }, 1000);
        }
    }
    
    const handleHighlightDates = async (selectedRecord) => {
        try {
            const { dates } = await getHighlightDates(selectedRecord);
            const formattedDates = dates.map((date) =>
                moment(date.date_created).toDate()
            );
            setHighlightedDates(formattedDates);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);   
            }, 1000);
        }
    }

    const handleInnerRecords = async (selectedRecord, id) => {
        try {
            const { inner } = await getInnerRecords(selectedRecord, id);
            setInnerRecords(inner);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);   
            }, 1000);
        }
    }

    const handleLeaderboard = async (selectedRecord, start, end) => {
        try {
            const { leaderBoards } = await getLeaderBoards(selectedRecord, start, end);
            setLeaderboard(leaderBoards);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);   
            }, 1000);
        }
    }

    useEffect(() => {
        handleDashboardData(selectedRecord, startDate);
        handleRecords(selectedRecord, startDate);
    },[selectedRecord, startDate])   

    useEffect(() => {
        handleHighlightDates(selectedRecord);
    },[selectedRecord])    

    function handleChangePOSUser(value){
        if(value !== 'all'){
            setFilteredRecordsByPOSUser(records.filter((record) => record.pos_name === value))
            // records.filter((record) => record.pos_name === value) returns an array of records with the selected POS user
        } else{
            setFilteredRecordsByPOSUser(records);
        }
        console.log(value)
    }

    function handleNoRecords(){
        return (
            <div className='no-records'>
                <p>No records found</p>
            </div>
        )
    }

    function handleNoLeadberboardData(){
        const today = moment(todayDate).format("YYYY-MM-DD") === startDate ? "today" : "on this day";
        return (
            <div className='no-records'>
                {selectedRecord === 'sales' && <p>There were no items sold {today}.</p>}
                {selectedRecord === 'labor' && <p>No rendered service {today}.</p>}
            </div>
        )
    }

    function handleRecordModal(recordValue) {
        const selectRecord = selectedRecord;
        console.log(selectRecord, recordValue.record_id);
        setModalShow(true);
        setModalName(recordValue.record_name);
        setModalDate(moment(recordValue.date_created).format("LL") + ' - ' + moment(recordValue.date_created).format("LT"));
        setModalPOSName(recordValue.pos_name); 
        setModalSubtotal(PesoFormat.format(recordValue.record_total_amount)); 
        handleInnerRecords(selectRecord, recordValue.record_id);
    }

    function handleLeaderBoardFilter(value){
        setSelectedLBfilter(value);
        switch(value){
            case 'today':
                setStartLeaderboardDate(moment(todayDate).format("YYYY-MM-DD"));
                setEndLeaderboardDate(moment(todayDate).format("YYYY-MM-DD"));
                break;
            case 'week':
                setStartLeaderboardDate(moment(todayDate).startOf('week').add(1, 'days').format("YYYY-MM-DD"));
                setEndLeaderboardDate(moment(todayDate).format("YYYY-MM-DD"));
                break;
            case 'month':
                setStartLeaderboardDate(moment(todayDate).startOf('month').format("YYYY-MM-DD"));
                setEndLeaderboardDate(moment(todayDate).format("YYYY-MM-DD"));
                break;
            case 'calendar':
                setStartLeaderboardDate(moment(startDate).format("YYYY-MM-DD"));
                setEndLeaderboardDate(moment(startDate).format("YYYY-MM-DD"));
                break;
            default:
                setStartLeaderboardDate(moment("20240101").format("YYYY-MM-DD"));
                setEndLeaderboardDate(moment(todayDate).format("YYYY-MM-DD"));
                break;
        }
    }

    function selectLBFilter(){
        return (
            <select name="" id="" className='filter' onChange={(e) => handleLeaderBoardFilter(e.target.value)}>
                <option value="calendar">Calendar</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="all">All time</option>
            </select>
        )
    }

    useEffect(() => {
        handleLeaderboard(selectedRecord, startLeaderboardDate, endLeaderboardDate);
        console.log(startLeaderboardDate, endLeaderboardDate);
    }, [selectedRecord, startLeaderboardDate, endLeaderboardDate])

    const [modalShow, setModalShow] = useState(false);

    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>
    if(errorLoad) return <ErrorLoad classStyle={"error-in-page"}/>

    return (
        <div className='records p-3'>
            <PageLayout
                leftContent={
                    <div className='records-container'>
                        <RecordModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            selectedRecord={selectedRecord}
                            name={modalName}
                            date={modalDate}
                            posName={modalPOSName}
                            subtotal={modalSubtotal}
                            items={innerRecords}
                        />
                        
                        <div className='upper-container'>
                            <div className="records-tabs">
                                 <button
                                    className={selectedRecord === 'sales' ? 'active' : ''}
                                    onClick={()=> handleTabChange('sales')}
                                 >Items</button>
                                 <button
                                    className={selectedRecord === 'labor' ? 'active' : ''}
                                    onClick={()=> handleTabChange('labor')}
                                 >Labor</button>
                                 <button
                                    className={selectedRecord === 'expenses' ? 'active' : ''}
                                    onClick={()=> handleTabChange('expenses')}
                                 >Expenses</button>
                            </div>
                        </div>

                        {/* SALES */}
                        {selectedRecord === 'sales' && (
                            <>
                                <div className='middle-container'>
                                    <div className='dashboard'>
                                        <div className='title'>Dashboard</div>
                                        <div className='dashboard-containers d-flex'>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{PesoFormat.format(dashboard1Data)}</div>
                                                    <div className="title">
                                                        <p>Item Sales</p>
                                                        <p>{startDate === nowDate ? "Today" : "this day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{dashboard2Data}</div>
                                                    <div className="title">
                                                        <p>Items Sold</p>
                                                        <p>{startDate === nowDate ? "Today" : "this day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{PesoFormat.format(dashboard3Data)}</div>
                                                    <div className='title'>
                                                        <p>Total</p>
                                                        <p>Item Sales</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{dashboard4Data}</div>
                                                    <div className='title'>
                                                        <p>Total</p>
                                                        <p>Items Sold</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='lower-container d-flex'>
                                    <div className='left-container'>
                                        <div className='title'>Calendar</div>
                                        <div className='content'>
                                            <DatePicker
                                                selected={salesStartDate}
                                                onChange={(date) => {
                                                    setStartDate(moment(date).format("YYYY-MM-DD"))
                                                    if(selectedLBfilter === 'calendar'){   
                                                        setStartLeaderboardDate(moment(date).format("YYYY-MM-DD"));
                                                        setEndLeaderboardDate(moment(date).format("YYYY-MM-DD"));
                                                    }
                                                }}
                                                maxDate={todayDate}
                                                calendarClassName='calendar'
                                                todayButton="Today"
                                                highlightDates={highlightedDates}
                                                calendarStartDay={1}
                                                inline
                                            />
                                        </div>
                                    </div>
                                    <div className='right-container'>
                                        <div className='title'>Product Leaderboard</div>
                                        <div className='content'>
                                            <div className="leaderboard">
                                                <div className="nav">
                                                    <h4>Top Items</h4>
                                                    {selectLBFilter()}
                                                </div>
                                                <div className="columns">
                                                    <div className="rank">Rank</div>
                                                    <div className="name">Product</div>
                                                    <div className="count">SOLD</div>
                                                </div>
                                                <div className="list">
                                                    {leaderboard.length === 0 ? handleNoLeadberboardData() : null}
                                                    {leaderboard.map((leader, index) => (
                                                        <div className="item" key={index}>
                                                            {index < 3 && <div className="rank">
                                                                <p>{index + 1}</p>
                                                                <i className="fa-solid fa-certificate"></i>
                                                            </div>}
                                                            {index >= 3 && <div className="rank">{index + 1}</div>}
                                                            <div className="name">{leader.item_name}</div>
                                                            <div className="count">{leader.item_qty}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* LABOR */}
                        {selectedRecord === 'labor' && (
                            <>
                                <div className='middle-container'>
                                    <div className='dashboard'>
                                        <div className='title'>Dashboard</div>
                                        <div className='dashboard-containers d-flex'>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{PesoFormat.format(dashboard1Data)}</div>
                                                    <div className='title'>
                                                        <p>Earned</p>
                                                        <p>{startDate === nowDate ? "Today" : "this day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{dashboard2Data}</div>
                                                    <div className="title">
                                                        <p>Rendered</p>
                                                        <p>{startDate === nowDate ? "Today" : "this day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{PesoFormat.format(dashboard3Data)}</div>
                                                    <div className="title">
                                                        <p>Total</p>
                                                        <p>Earned</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{dashboard4Data}</div>
                                                    <div className='title'>
                                                        <p>Total</p>
                                                        <p>Rendered</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='lower-container d-flex'>
                                    <div className='left-container'>
                                        <div className='title'>Calendar</div>
                                        <div className='content'>
                                            <DatePicker
                                                selected={laborStartDate}
                                                onChange={(date) => {
                                                    setStartDate(moment(date).format("YYYY-MM-DD"))
                                                    if(selectedLBfilter === 'calendar'){   
                                                        setStartLeaderboardDate(moment(date).format("YYYY-MM-DD"));
                                                        setEndLeaderboardDate(moment(date).format("YYYY-MM-DD"));
                                                    }
                                                }}
                                                maxDate={todayDate}
                                                calendarClassName='calendar'
                                                todayButton="Today"
                                                highlightDates={highlightedDates}
                                                inline
                                            />
                                        </div>
                                    </div>

                                    <div className='right-container'>
                                        <div className='title'>Mechanic Leaderboard</div>
                                        <div className='content'>
                                            <div className="leaderboard">
                                                <div className="nav">
                                                    <h4>Top Mechanics</h4>
                                                    {selectLBFilter()}
                                                </div>
                                                <div className="columns">
                                                    <div className="rank">Rank</div>
                                                    <div className="name">Mechanic</div>
                                                    <div className="count">Earned</div>
                                                </div>
                                                <div className="list">
                                                    {leaderboard.length === 0 ? handleNoLeadberboardData() : null}
                                                    {leaderboard.map((leader, index) => (
                                                        <div className="item" key={index}>
                                                            {index < 3 && <div className="rank">
                                                                <p>{index + 1}</p>
                                                                <i className="fa-solid fa-certificate"></i>
                                                            </div>}
                                                            {index >= 3 && <div className="rank">{index + 1}</div>}
                                                            <div className="name">{leader.item_name}</div>
                                                            <div className="count">{PesoFormat.format(leader.item_qty)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}


                        {/* EXPENSES */}
                        {selectedRecord === 'expenses' && (
                            <>
                                <div className='middle-container'>
                                    <div className='dashboard'>
                                        <div className='title'>Dashboard</div>
                                        <div className='dashboard-containers d-flex'>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{PesoFormat.format(dashboard1Data)}</div>
                                                    <div className='title'>
                                                        <p>Spent</p>
                                                        <p>{startDate === nowDate ? "Today" : "this day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{dashboard2Data}</div>
                                                    <div className='title'>
                                                        <p>Entries</p>
                                                        <p>{startDate === nowDate ? "Today" : "this day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{PesoFormat.format(dashboard3Data)}</div>
                                                    <div className='title'>
                                                        <p>Total</p>
                                                        <p>Spent</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='s-containers'>
                                                <div className="dashboard-content">
                                                    <div className='count'>{dashboard4Data}</div>
                                                    <div className='title'>
                                                        <p>Total</p>
                                                        <p>Entries</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='lower-container d-flex'>
                                    <div className='left-container'>
                                       <div className='title'>Calendar</div>
                                        <div className='content'>
                                            <DatePicker
                                                selected={expensesStartDate}
                                                onChange={(date) => {
                                                    setStartDate(moment(date).format("YYYY-MM-DD"))
                                                }}
                                                maxDate={todayDate}
                                                calendarClassName='calendar'
                                                todayButton="Today"
                                                highlightDates={highlightedDates}
                                                inline
                                            />
                                        </div>
                                    </div>

                                    <div className='right-container'>
                                        <div className='title'>Expenses Leaderboard</div>
                                        <div className='content'>
                                            <div className="leaderboard">
                                                <div className="nav">
                                                    <h4>All Expenses</h4>
                                                </div>
                                                <div className="columns">
                                                    <div className="rank">Rank</div>
                                                    <div className="name">Expense</div>
                                                    <div className="count">Amount</div>
                                                </div>
                                                <div className="list">
                                                    {leaderboard.length === 0 ? handleNoLeadberboardData() : null}
                                                    {leaderboard.map((leader, index) => (
                                                        <div className="item" key={index}>
                                                            {index < 3 && <div className="rank">
                                                                <p>{index + 1}</p>
                                                                <i className="fa-solid fa-certificate"></i>
                                                            </div>}
                                                            {index >= 3 && <div className="rank">{index + 1}</div>}
                                                            <div className="name">{leader.item_name}</div>
                                                            <div className="count">{PesoFormat.format(leader.item_qty)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                }

                rightContent={
                <div className='right-most-container'>
                    <div className='date'>
                        <h4>{moment(startDate).format("LL")}</h4>
                    </div>
                    <div className='content'>
                        <div className="summary">
                            <p>Total Earned <strong>{PesoFormat.format(dashboard1Data)}</strong></p>
                        </div>
                        <div className="pos-users">
                            <select name="" id="" onChange={(e) => handleChangePOSUser(e.target.value)} defaultValue={defaultSelectValue}> 
                                <option value="all">All users</option>
                                {distinctPOSUsers.map((posUser, index) => (
                                    <option key={index} value={posUser}>{posUser}</option>
                                ))}
                            </select>
                        </div>
                        <div className="list">
                            {filteredRecordsByPOSUser.length === 0 ? handleNoRecords() : null}
                            {filteredRecordsByPOSUser.map((record, index) => (
                                <div className="item" key={index} onClick={() => handleRecordModal(record)}>
                                    <div className="top">
                                        <div className="sender">
                                            <p>{record.pos_name}</p>
                                        </div>
                                        <div className="time">
                                            <p>{moment(record.date_created).format("LT")}</p>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <div className="name">
                                            <p>{record.record_name}</p>
                                        </div>
                                        <div className="total">
                                            <p>{PesoFormat.format(record.record_total_amount)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>    
                </div>
                }
            />
        </div>
    );
};

export default Records;