import './dashboard.scss';
import { AuthContext } from '../../context/auth-context';
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';
import { dashboardData, fetchProductLeaderboard, getSummaryRecords, fetchReceiptOverview } from '../../services/dashboardService';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const todayDate = new Date();
    const navigate = useNavigate();
    const [data, setData] = useState({
        totalItems: 0,
        lowStockItems: 0,
        soldToday: 0,
        renderedToday: 0
    });
    const [leaderboard, setLeaderboard] = useState([]);
    const startDate = moment(todayDate).format("YYYY-MM-DD");
    const [startLeaderboardDate, setStartLeaderboardDate] = useState(moment().format("YYYY-MM-DD"));
    const [endLeaderboardDate, setEndLeaderboardDate] = useState(moment().format("YYYY-MM-DD"));
    const formattedDate = moment(startDate).format('MMMM DD, YYYY');
    const [selectedPOSUser, setSelectedPOSUser] = useState('all');
    const [distinctPOSUsers, setDistinctPOSUsers] = useState([]);
    const [filteredRecordsByPOSUser, setFilteredRecordsByPOSUser] = useState([]);
    const [summaryRecords, setSummaryRecords] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [netSales, setNetSales] = useState(0);
    const [deductedNetLabor, setDeductedNetLabor] = useState(0);
    const [originalNetLabor, setOriginalNetLabor] = useState(0);
    const [netExpenses, setNetExpenses] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [currentMechanicPercentage, setCurrentMechanicPercentage] = useState(0);

    const { displayExpenses } = useContext(AuthContext);

    const { handleNavClick } = useOutletContext();

    const goToSummaries = () => {
        handleNavClick('Summaries'); // Update title
        navigate('/summaries'); // Navigate to the new route
    };

    const fetchDashboardData = useCallback(async () => {
        try {
            const result = await dashboardData();
            setData(result);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, []); // No dependencies for fetchDashboardData if it doesn’t rely on other variables

    const fetchLeaderboardData = useCallback(async () => {
        try {
            const result = await fetchProductLeaderboard(startLeaderboardDate, endLeaderboardDate);
            setLeaderboard(result);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    }, [startLeaderboardDate, endLeaderboardDate]);

    const handleGetSummaryRecords = async (startDate) => {
        try {
            const { records, mechanicPercentage } = await getSummaryRecords(startDate);
            setDistinctPOSUsers([...new Set(records.map(record => record.pos_name))].sort());

            if(displayExpenses) {
                setFilteredRecordsByPOSUser(records);
                setSummaryRecords(records);
            } else {
                setFilteredRecordsByPOSUser(records.filter(record => record.record_type !== 'expense'));
                setSummaryRecords(records.filter(record => record.record_type !== 'expense'));
            }
            
            setCurrentMechanicPercentage(mechanicPercentage);
            console.log(records);
            setSummaryData();
        } catch (error) {
            console.error('Error getting summary records: ', error);
        }
    }

    const handleLeaderBoardFilter = (value) => {
        const todayDate = moment();
        switch (value) {
            case 'today':
                setStartLeaderboardDate(todayDate.format("YYYY-MM-DD"));
                setEndLeaderboardDate(todayDate.format("YYYY-MM-DD"));
                break;
            case 'week':
                // Set start and end dates to the beginning and end of the current week
                setStartLeaderboardDate(todayDate.startOf('isoWeek').format("YYYY-MM-DD"));
                setEndLeaderboardDate(todayDate.endOf('isoWeek').format("YYYY-MM-DD"));
                break;
            case 'month':
                // Set start and end dates to the beginning and end of the current month
                setStartLeaderboardDate(todayDate.startOf('month').format("YYYY-MM-DD"));
                setEndLeaderboardDate(todayDate.endOf('month').format("YYYY-MM-DD"));
                break;
            default:
                // Default to "all time" by setting start date to a very early date and end date to today
                setStartLeaderboardDate(moment("2024-01-01").format("YYYY-MM-DD"));
                setEndLeaderboardDate(todayDate.format("YYYY-MM-DD"));
                break;
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchLeaderboardData();
    }, [fetchDashboardData, fetchLeaderboardData]);

    useEffect(() => {
        handleGetSummaryRecords(startDate);
    }, [startDate])

    useEffect(() => {
        const getReceiptData = async () => {
            try {
                const data = await fetchReceiptOverview();

                // Get current hour (24-hour format) to limit displayed hours
                const currentHour = new Date().getHours();

                // Generate labels in 12-hour format with AM/PM up to the current hour
                const labels = Array.from({ length: currentHour + 1 }, (_, i) =>
                    i === 0 ? '12 AM' :
                        i < 12 ? `${i} AM` :
                            i === 12 ? '12 PM' :
                                `${i - 12} PM`
                );

                const totalCostData = new Array(currentHour + 1).fill(0);

                data.forEach(entry => {
                    const hour = parseInt(entry.hour, 10);
                    if (hour <= currentHour) {  // Only populate up to the current hour
                        totalCostData[hour] = parseFloat(entry.total_cost);
                    }
                });

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Total Receipts Sales',
                            data: totalCostData,
                            backgroundColor: '#2E2E2E',  // Dark color for bars
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching receipt overview data:', error);
            }
        };

        getReceiptData();
    }, []);

    const selectLBFilter = () => (
        <select name="leaderboardFilter" id="leaderboardFilter" className='filter' onChange={(e) => handleLeaderBoardFilter(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="all">All time</option>
        </select>
    );

    function handleNoLeaderboardData() {
        const today = moment(todayDate).format("YYYY-MM-DD") === startLeaderboardDate ? "today" : "on this day";
        return (
            <div className='no-records'>
                <p>There were no items sold {today}.</p>
            </div>
        );
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

    useEffect(() => {
        setSummaryData();
    }, [filteredRecordsByPOSUser])

    function handleChangePOSUser(value) {
        if (value !== 'all') {
            setSelectedPOSUser(value);
            setFilteredRecordsByPOSUser(summaryRecords.filter((record) => record.pos_name === value))
            // records.filter((record) => record.pos_name === value) returns an array of records with the selected POS user
        } else {
            setSelectedPOSUser('all');
            setFilteredRecordsByPOSUser(summaryRecords);
        }
    }

    function handleNoRecords() {
        return (
            <div className='no-records'>
                {displayExpenses && 
                    <p>No recorded POS sales, labor, and expenses.</p>
                }
                {!displayExpenses && 
                    <p>No recorded POS sales and labor.</p>
                }
            </div>
        )
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

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });




    return (
        <div className='dashboard d-flex'>
            <div className='left-container'>
                <div className='upper-container d-flex'>
                    <div className='left-content'>
                        <div className='content d-flex'>
                            <div className='cards'>
                                <div className='cards-content'>
                                    <h2>{data.totalItems}</h2>
                                    <h6>Items Available</h6>
                                </div>
                            </div>
                            <div className='cards'>
                                <div className='cards-content'>
                                    <h2>{data.lowStockItems}</h2>
                                    <h6>Low Stock Items</h6>
                                </div>
                            </div>
                        </div>
                        <div className='content d-flex'>
                            <div className='cards'>
                                <div className='cards-content'>
                                    <h2>{data.soldToday}</h2>
                                    <h6>Items Sold this day</h6>
                                </div>
                            </div>
                            <div className='cards'>
                                <div className='cards-content'>
                                    <h2>{data.renderedToday}</h2>
                                    <h6>Rendered this day</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='right-content'>
                        <div className='content'>
                            <div className="leaderboard">
                                <div className="nav mt-0">
                                    <h4>Top Items</h4>
                                    {selectLBFilter()}
                                </div>
                                <div className="columns">
                                    <div className="rank">Rank</div>
                                    <div className="name">Product</div>
                                    <div className="count">SOLD</div>
                                </div>
                                <div className="list">
                                    {leaderboard.length === 0 ? handleNoLeaderboardData() : null}
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

                <div className='lower-container'>
                    <div className='content'>
                        <h3>POS Overview</h3>
                        <Bar
                            className='canvas'
                            data={{
                                ...chartData,
                                datasets: chartData.datasets.map(dataset => ({
                                    ...dataset,
                                    backgroundColor: '#F9961F'  // Apply dark color directly to dataset
                                }))
                            }}
                            options={{
                                scales: {
                                    x: {
                                        grid: {
                                            display: false  // Hides vertical grid lines
                                        },
                                        ticks: {
                                            display: true,  // Keeps x-axis labels (hours)
                                            font: {
                                                family: 'Inter',  // Set font to Inter
                                                weight: 500  // Makes the hour labels bold
                                            },
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            display: false  // Hides horizontal grid lines
                                        },
                                        ticks: {
                                            callback: (value) => `₱${value}`,
                                            display: true,  // Keeps y-axis labels (money)
                                            font: {
                                                family: 'Inter',  // Set font to Inter
                                                weight: 500  // Makes the money labels bold
                                            },
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false  // Hides the legend
                                    },
                                    tooltip: {
                                        backgroundColor: "#333333",
                                        titleColor: "#ffffff",
                                        bodyColor: "#ffffff",
                                        borderRadius: 6,
                                        padding: 8,
                                        titleFont: {
                                            family: 'Inter'  // Tooltip title font
                                        },
                                        bodyFont: {
                                            family: 'Inter'  // Tooltip body font
                                        }
                                    }
                                },
                                elements: {
                                    bar: {
                                        borderRadius: {
                                            topLeft: 3,  // Rounded top corners
                                            topRight: 3,
                                        },
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className='right-container'>
                <div className='containers'>
                    <div className='content'>
                        <div className="summary-content">

                            <div className='title'>
                                <h3> Today's Summary</h3>
                            </div>
                            <div className='upper-content'>
                                <div className='main-content'>
                                    <div className="header">
                                        <h5>Summary</h5>
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
                                            <p className="right">({deductedNetLabor})</p>
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

                            <div className='lower-content'>
                                <div className='main-content'>
                                    <div className="list">
                                        {filteredRecordsByPOSUser.length === 0 && handleNoRecords()}
                                        {filteredRecordsByPOSUser.filter(filRecord => (filRecord.item_qty > filRecord.refund_qty) && (filRecord.item_qty > filRecord.return_qty)).map((record, index) => (
                                            <div key={index} className="list-item" onClick={goToSummaries}>
                                                <div className="left">
                                                    {record.record_type === 'items' && <i className="fa-solid fa-tag"></i>}
                                                    {record.record_type === 'mechanic' && <i className="fa-solid fa-wrench"></i>}
                                                    {record.record_type === 'expense' && <i className="fa-solid fa-receipt"></i>}
                                                    <p className='pos'>{record.pos_name}</p>
                                                </div>
                                                <div className="mid">
                                                    <p className='name'>{record.item_name.length > 20 ? record.item_name.substring(0, 20) + '...' : record.item_name}</p>                                          
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




                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
