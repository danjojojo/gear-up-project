import React, { useRef, useState, useEffect, useContext } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import exportpdf from "../../assets/icons/export.png";
import MonthYearPicker from '../date-picker/date-picker';
import { getSalesReport, getLaborReport, getExpensesReport } from '../../services/reportsService';
import { AuthContext } from "../../context/auth-context";

const RevenueReport = () => {
    const reportRef = useRef();
    const { userRole } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth() + 1, // Month is 0-indexed, so add 1
        year: new Date().getFullYear(),
    });

    const [sales, setSales] = useState(0);
    const [laborCosts, setLaborCosts] = useState(0);
    const [operationalExpenses, setOperationalExpenses] = useState(0);

    const fetchRevenueData = async (month, year) => {
        try {
            const salesData = await getSalesReport(month, year);
            const laborData = await getLaborReport(month, year);
            const expensesData = await getExpensesReport(month, year);

            const totalSales = salesData.summary.reduce((acc, item) => acc + Number(item.total_sales || 0), 0);
            const totalLaborCosts = laborData.summary.reduce((acc, item) => acc + Number(item.total_service_amount || 0), 0);
            const totalOperationalExpenses = expensesData.summary.reduce((acc, item) => acc + Number(item.total_amount || 0), 0);

            setSales(totalSales);
            setLaborCosts(totalLaborCosts);
            setOperationalExpenses(totalOperationalExpenses);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    // Fetch data when component mounts and when selectedDate changes
    useEffect(() => {
        fetchRevenueData(selectedDate.month, selectedDate.year);
    }, [selectedDate]);

    const generatePDF = () => {
        const input = reportRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();

            const pageHeight = 298; // Adjust based on your requirements
            const margin = 7; // Top and bottom margins

            // Manually render parts of the content to avoid breaking tables
            const splitCanvasIntoPages = () => {
                const contentHeight = canvas.height;
                const contentWidth = canvas.width;

                const ratio = contentWidth / pdfWidth;
                const scaledPageHeight = pageHeight * ratio;

                let heightLeft = contentHeight;
                let position = 0;

                while (heightLeft > 0) {
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = contentWidth;
                    pageCanvas.height = Math.min(heightLeft, scaledPageHeight);
                    const context = pageCanvas.getContext('2d');

                    context.drawImage(canvas, 0, position, contentWidth, pageCanvas.height, 0, 0, contentWidth, pageCanvas.height);

                    const pageData = pageCanvas.toDataURL('image/png');

                    if (position > 0) pdf.addPage();
                    pdf.addImage(pageData, 'PNG', margin, margin, pdfWidth - margin * 2, (pageCanvas.height * (pdfWidth - margin * 2)) / contentWidth);

                    heightLeft -= pageCanvas.height;
                    position += pageCanvas.height;
                }
            };

            splitCanvasIntoPages();
            pdf.save('Revenue_Report.pdf');
        });
    };

    const months = [
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ];

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    // Calculate Net Revenue
    const netRevenue = sales - laborCosts - operationalExpenses;

    return (
        <>
            <div className='upper'>
                <MonthYearPicker setSelectedDate={setSelectedDate} />
                <button onClick={generatePDF} style={{ marginTop: '20px' }}>
                    <img src={exportpdf} alt="export-icon" />
                    Export
                </button>
            </div>

            <div ref={reportRef} className="pdf-content">
                <div className="upper-text" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1><span>ARON</span><span>BIKES</span></h1>
                    <p>Antipolo City</p>
                    <h3>Monthly Revenue Report</h3>
                    <h6>({`${months[selectedDate.month - 1].label} ${selectedDate.year}`})</h6>
                    <p>Overview of revenue, costs, and net income.</p>
                </div>

                <div className='mt-4 mb-4'>
                    <p>Date generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p>Time generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                    <p>Generated by:&nbsp;&nbsp;&nbsp;{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                </div>

                <table className='mb-4'>
                    <tbody>
                        <tr>
                            <td className='text-start'>POS Sales</td>
                            <td className='text-end'>{PesoFormat.format(sales)}</td>
                        </tr>
                        <tr>
                            <td className='text-start'>Labor Costs</td>
                            <td className='text-end'>({PesoFormat.format(laborCosts)})</td>
                        </tr>
                        <tr>
                            <td className='text-start'>Operational Expenses</td>
                            <td className='text-end'>({PesoFormat.format(operationalExpenses)})</td>
                        </tr>
                        <tr>
                            <td className='text-start fw-bold'>NET REVENUE</td>
                            <td className='text-end fw-bold'>{PesoFormat.format(netRevenue)}</td>
                        </tr>
                    </tbody>
                </table>

                <p className='mt-4 fs-7 fw-light'> @2024 GearUp. All rights reserved.</p>
            </div>
        </>
    );
};

export default RevenueReport;
