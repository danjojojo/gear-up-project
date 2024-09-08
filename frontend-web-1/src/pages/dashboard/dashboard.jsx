import './dashboard.scss'

const Dashboard = () => {
    return (
        <div className='dashboard d-flex p-2'>
            <div className='left-container col-6 p-2'>

                <div className='inventory-container p-4 mb-3'>
                    <div className='m-0 fs-5 fw-bold'>
                        Inventory
                    </div>
                </div>

                <div className='productlb-container p-4'>
                    <div className='m-0 fs-5 fw-bold'>
                        Product Leaderboard
                    </div>
                </div>
            </div>


            <div className='right-container col-6 p-2'>
                <div className='summary-container p-4'>
                    <div className='m-0 fs-5 fw-bold'>
                        Daily Summary
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;