import './records.scss';
import PageLayout from '../../components/page-layout/page-layout';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


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

    const handleDropdownChange = (event) => {
        const value = event.target.value;
        setSelectedRecord(value);
        navigate(`/records/${value}`);
    };

    return (
        <div className='records p-3'>
            <PageLayout
                leftContent={
                    <div className='records-container'>
                        <div className='upper-container mb-3'>
                            <select className='dropdown' value={selectedRecord} onChange={handleDropdownChange}>
                                <option value="sales">Sales</option>
                                <option value="labor">Labor</option>
                                <option value="expenses">Expenses</option>
                            </select>
                        </div>


                        {/* SALES */}
                        {selectedRecord === 'sales' && (
                            <>
                                <div className='middle-container mb-3'>
                                    <div className='dashboard'>
                                        <div className='title'>Dashboard</div>
                                        <div className='dashboard-containers d-flex'>
                                            <div className='s-containers'></div>
                                            <div className='s-containers'></div>
                                            <div className='s-containers'></div>
                                            <div className='s-containers'></div>
                                        </div>
                                    </div>
                                </div>

                                <div className='lower-container d-flex'>
                                    <div className='left-container'>
                                        <div className='title'>Product Leaderboard</div>
                                        <div className='content'></div>
                                    </div>

                                    <div className='right-container'>
                                        <div className='title'>Select a date to see records</div>
                                        <div className='content'>

                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* LABOR */}
                        {selectedRecord === 'labor' && (
                            <>
                                <div className='middle-container mb-3'>
                                    <div className='dashboard'>
                                        <div className='title'>Dashboard</div>
                                        <div className='dashboard-containers d-flex'>
                                            <div className='l-containers'></div>
                                            <div className='l-containers'></div>
                                            <div className='l-containers'></div>
                                        </div>
                                    </div>
                                </div>

                                <div className='lower-container d-flex'>
                                    <div className='left-container'>
                                        <div className='title'>Mechanic Leaderboard</div>
                                        <div className='content'></div>
                                    </div>

                                    <div className='right-container'>
                                        <div className='title'>Select a date to see records</div>
                                        <div className='content'>

                                        </div>
                                    </div>
                                </div>
                            </>
                        )}


                        {/* EXPENSES */}
                        {selectedRecord === 'expenses' && (
                            <>
                                <div className='middle-container mb-3'>
                                    <div className='dashboard'>
                                        <div className='title'>Dashboard</div>
                                        <div className='dashboard-containers d-flex'>
                                            <div className='e-containers'></div>
                                            <div className='e-containers'></div>
                                            <div className='e-containers'></div>
                                        </div>
                                    </div>
                                </div>

                                <div className='lower-container d-flex'>
                                    <div className='left-container'>
                                        <div className='title'>Top Expenses</div>
                                        <div className='content'></div>
                                    </div>

                                    <div className='right-container'>
                                        <div className='title'>Select a date to see records</div>
                                        <div className='content'>

                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                }

                rightContent={<div></div>}
            />
        </div>
    );
};

export default Records;