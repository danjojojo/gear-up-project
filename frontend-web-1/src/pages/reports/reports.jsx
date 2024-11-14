import './reports.scss';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/page-layout/page-layout';
import sales from "../../assets/icons/sales.png";
import expenses from "../../assets/icons/expenses.png";
import labor from "../../assets/icons/labor.png";
import order from "../../assets/icons/order.png";
import revenue from "../../assets/icons/revenue.png";
import SalesReport from '../../components/reports/sales-report';
import ExpensesReport from '../../components/reports/expenses-report';
import LaborReport from '../../components/reports/labor-cost-report';
import OrderSalesReport from '../../components/reports/order-sales-report';
import RevenueReport from '../../components/reports/revenue';
import LoadingPage from '../../components/loading-page/loading-page';

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState("sales");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    // Memoize reportPaths to avoid unnecessary re-renders
    const reportPaths = useMemo(() => ({
        sales: "sales-report",
        expenses: "expenses-report",
        labor: "labor-cost-report",
        order: "order-sales-report",
        revenue: "revenue-report",
    }), []);

    // Update URL based on selected report
    useEffect(() => {
        navigate(`/reports/${reportPaths[selectedReport]}`);
    }, [selectedReport, navigate, reportPaths]);

    // Render the corresponding component based on the selected report
    const renderReportComponent = () => {
        switch (selectedReport) {
            case "sales":
                return <SalesReport />;
            case "expenses":
                return <ExpensesReport />;
            case "labor":
                return <LaborReport />;
            case "order":
                return <OrderSalesReport />;
            case "revenue":
                return <RevenueReport />;
            default:
                return null;
        }
    };

    if (loading) return <LoadingPage classStyle={"loading-in-page"} />

    return (
        <div className='reports p-3'>
            <PageLayout
                leftContent={renderReportComponent()}
                rightContent={
                    <>
                        <div
                            className="container-content"
                            onClick={() => setSelectedReport("sales")}
                        >
                            <div className={`main-content ${selectedReport === "sales" ? "active" : ""}`}>
                                POS Items Sales Report
                                <img src={sales} alt="sales" className="sales-icon" />
                            </div>
                        </div>
                        <div
                            className="container-content"
                            onClick={() => setSelectedReport("order")}
                        >
                            <div className={`main-content ${selectedReport === "order" ? "active" : ""}`}>
                                Order Sales Report
                                <img src={order} alt="order" className="order-icon" />
                            </div>
                        </div>
                        <div
                            className="container-content"
                            onClick={() => setSelectedReport("expenses")}
                        >
                            <div className={`main-content ${selectedReport === "expenses" ? "active" : ""}`}>
                                Expenses Report
                                <img src={expenses} alt="expenses" className="expenses-icon" />
                            </div>
                        </div>
                        <div
                            className="container-content"
                            onClick={() => setSelectedReport("labor")}
                        >
                            <div className={`main-content ${selectedReport === "labor" ? "active" : ""}`}>
                                Labor Costs Report
                                <img src={labor} alt="labor" className="labor-icon" />
                            </div>
                        </div>
                        <div
                            className="container-content"
                            onClick={() => setSelectedReport("revenue")}
                        >
                            <div className={`main-content ${selectedReport === "revenue" ? "active" : ""}`}>
                                Revenue Report
                                <img src={revenue} alt="revenue" className="revenue-icon" />
                            </div>
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default Reports;
