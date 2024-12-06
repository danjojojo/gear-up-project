import React, { useRef, useState, useEffect, useContext } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import exportpdf from "../../assets/icons/export.png";
import MonthYearPicker from '../date-picker/date-picker';
import { getSalesReport, getLaborReport, getExpensesReport, getOrderReport } from '../../services/reportsService';
import { AuthContext } from "../../context/auth-context";
import registerCooperFont from '../fonts/Cooper-ExtraBold-normal';
import registerRubikFont from '../fonts/Rubik-Regular-normal';
import registerRubikBoldFont from '../fonts/Rubik-Bold-normal';
import registerRubikSemiBoldFont from '../fonts/Rubik-SemiBold-normal';
import { getSettings } from '../../services/settingsService';

const RevenueReport = () => {
    const reportRef = useRef();
    const { userRole, displayExpenses } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth() + 1, // Month is 0-indexed, so add 1
        year: new Date().getFullYear(),
    });

    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');

    useEffect(() => {
        registerCooperFont();
        registerRubikFont();
        registerRubikBoldFont();
        registerRubikSemiBoldFont();
    }, []);

    const [sales, setSales] = useState(0);
    const [laborCosts, setLaborCosts] = useState(0);
    const [operationalExpenses, setOperationalExpenses] = useState(0);
    const [orderSales, setOrderSales] = useState(0);

    const fetchRevenueData = async (month, year) => {
        try {
            const salesData = await getSalesReport(month, year);
            const laborData = await getLaborReport(month, year);
            const expensesData = await getExpensesReport(month, year);
            const orderData = await getOrderReport(month, year);

            const { settings } = await getSettings();
            setStoreName(settings.find(setting => setting.setting_key === 'store_name').setting_value);
            setStoreAddress(settings.find(setting => setting.setting_key === 'store_address').setting_value);

            const totalSales = salesData.summary.reduce((acc, item) => acc + Number(item.total_sales || 0), 0);
            const totalLaborCosts = laborData.summary.reduce((acc, item) => acc + Number(item.total_service_amount || 0), 0);
            const totalOperationalExpenses = expensesData.summary.reduce((acc, item) => acc + Number(item.total_amount || 0), 0);
            const totalOrderSales = Number(orderData.summary.total_revenue || 0); // Assuming total_revenue is part of the summary

            setSales(totalSales);
            setLaborCosts(totalLaborCosts);
            setOperationalExpenses(displayExpenses ? totalOperationalExpenses : 0);
            setOrderSales(totalOrderSales);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    // Fetch data when component mounts and when selectedDate changes
    useEffect(() => {
        fetchRevenueData(selectedDate.month, selectedDate.year);
    }, [selectedDate]);

    const generatePDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30; // Starting vertical position for content
        const columnWidth = (pdfWidth - 2 * margin) / 2;

        // Header section
        pdf.setFontSize(22);
        pdf.setFont('Rubik-Bold');
        pdf.setTextColor('#F9961F');
        const title1 = '';
        const title2 = storeName;
        pdf.text(title1, (pdfWidth - pdf.getTextWidth(title1 + title2)) / 2, yPosition);

        pdf.setTextColor('#2E2E2E');
        pdf.text(title2, (pdfWidth + pdf.getTextWidth(title1) - pdf.getTextWidth(title2)) / 2, yPosition);

        pdf.setFontSize(8);
        pdf.setFont('Rubik-Regular');
        yPosition += 6;
        const subtitle = storeAddress;
        pdf.text(subtitle, (pdfWidth - pdf.getTextWidth(subtitle)) / 2, yPosition);

        pdf.setFontSize(16);
        pdf.setFont('Rubik-Bold');
        yPosition += 8;
        const reportTitle = 'Monthly Revenue Report';
        pdf.text(reportTitle, (pdfWidth - pdf.getTextWidth(reportTitle)) / 2, yPosition);

        pdf.setFontSize(11);
        pdf.setFont('Rubik-SemiBold');
        yPosition += 7;
        const reportSubtitle = `(${months[selectedDate.month - 1].label} ${selectedDate.year})`;
        pdf.text(reportSubtitle, (pdfWidth - pdf.getTextWidth(reportSubtitle)) / 2, yPosition);

        pdf.setFontSize(9);
        pdf.setFont('Rubik-Regular');
        yPosition += 7;
        const performanceText = 'Overview of revenue, costs, and net income.';
        pdf.text(performanceText, (pdfWidth - pdf.getTextWidth(performanceText)) / 2, yPosition);

        // Report Metadata
        pdf.setFontSize(8);
        yPosition += 14;
        pdf.text(`Date generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Time generated: ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Generated by: ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`, margin, yPosition);

        // Summary Table
        autoTable(pdf, {
            startY: yPosition + 7,
            theme: 'grid',
            body: [
                ['Receipt Sales (POS Items Sales + Labor Costs)', `P ${PesoFormat.format(sales + laborCosts)}`],
                ['Order Sales', `P ${PesoFormat.format(orderSales)}`],
                ['Labor Costs', `(P ${PesoFormat.format(laborCosts)})`],
                ['Operational Expenses', `(P ${PesoFormat.format(operationalExpenses)})`],
                [{ content: 'NET REVENUE', styles: { font: "Rubik-SemiBold", halign: 'left' } }, { content: `P ${PesoFormat.format(netRevenue)}`, styles: { font: "Rubik-SemiBold", halign: 'right' } }]
            ],
            head: [], // No header row as per the HTML example
            bodyStyles: {
                font: 'Rubik-Regular',
                fontSize: 9,
                textColor: [0, 0, 0]
            },
            columnStyles: {
                0: { cellWidth: columnWidth, halign: 'left' },
                1: { cellWidth: columnWidth, halign: 'right' }
            },
            styles: {
                font: 'Rubik-Regular',
                fontSize: 10,
                cellPadding: 2,
                lineWidth: 0.1,
                lineColor: [0, 0, 0]
            },
            tableWidth: 'auto',
            margin: { left: 20, right: 20 }
        });

        yPosition = pdf.lastAutoTable.finalY + 9;
        pdf.setFont('Rubik-Regular');
        pdf.setFontSize(8);
        const reserved = "@2024 GearUp. All rights reserved.";
        pdf.text(reserved, margin, yPosition);

        // Display PDF in a new window
        // pdf.output("dataurlnewwindow");
        pdf.save(`${months[selectedDate.month - 1].label}_${selectedDate.year}_Revenue_Report.pdf`);
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
    const netRevenue = (sales + laborCosts + orderSales) - laborCosts - operationalExpenses;

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
                    <h1>{storeName}</h1>
                    <p>{storeAddress}</p>
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
                            <td className='text-start'>Receipt Sales (POS Items Sales + Labor Costs)</td>
                            <td className='text-end'>{PesoFormat.format(sales + laborCosts)}</td>
                        </tr>
                        <tr>
                            <td className='text-start'>Order Sales</td>
                            <td className='text-end'>{PesoFormat.format(orderSales)}</td>
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
