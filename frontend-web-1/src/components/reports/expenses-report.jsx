import React, { useRef, useState, useEffect, useContext } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import exportpdf from "../../assets/icons/export.png";
import MonthYearPicker from '../date-picker/date-picker';
import { getExpensesReport } from '../../services/reportsService'; // Make sure this service calls the correct backend endpoint
import { AuthContext } from "../../context/auth-context";

const ExpensesReport = () => {
    const reportRef = useRef();
    const { userRole } = useContext(AuthContext);
    const [expensesData, setExpensesData] = useState({ summary: [], detailed: [] });
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth(), // Adjust for 1-indexed months
        year: new Date().getFullYear(),
    });

    const fetchExpensesData = async (month, year) => {
        try {
            const data = await getExpensesReport(month, year);
            setExpensesData(data);
        } catch (error) {
            console.error('Error fetching expenses data:', error);
        }
    };

    useEffect(() => {
        fetchExpensesData(selectedDate.month, selectedDate.year);
    }, [selectedDate]);

    const generatePDF = () => {
        const input = reportRef.current;

        // Reduce scale for lower image quality (0.8 - 1.5 range recommended)
        html2canvas(input, { scale: 1.5 }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const firstPageHeight = 295; // Height for the first page
            const otherPagesHeight = 292.5; // Height for other pages
            const margin = 7; // Standard margin
            const extraTopMargin = 5; // Additional top margin for pages after the first

            const splitCanvasIntoPages = () => {
                const contentHeight = canvas.height;
                const contentWidth = canvas.width;

                const ratio = contentWidth / pdfWidth;
                const scaledFirstPageHeight = firstPageHeight * ratio;
                const scaledOtherPagesHeight = otherPagesHeight * ratio;

                let heightLeft = contentHeight;
                let position = 0;
                let isFirstPage = true;

                while (heightLeft > 0) {
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = contentWidth;

                    // Adjust page height based on whether it's the first page or subsequent pages
                    pageCanvas.height = isFirstPage
                        ? Math.min(heightLeft, scaledFirstPageHeight)
                        : Math.min(heightLeft, scaledOtherPagesHeight);

                    const context = pageCanvas.getContext('2d');
                    context.drawImage(canvas, 0, position, contentWidth, pageCanvas.height, 0, 0, contentWidth, pageCanvas.height);

                    const pageData = pageCanvas.toDataURL('image/jpeg', 0.6); // Lower quality for smaller size

                    if (!isFirstPage) pdf.addPage();

                    // Adjust top margin for subsequent pages
                    const topMargin = isFirstPage ? margin : margin + extraTopMargin;

                    pdf.addImage(pageData, 'JPEG', margin, topMargin, pdfWidth - margin * 2, (pageCanvas.height * (pdfWidth - margin * 2)) / contentWidth);

                    heightLeft -= pageCanvas.height;
                    position += pageCanvas.height;
                    isFirstPage = false;
                }
            };

            splitCanvasIntoPages();
            pdf.save("Expenses_Report.pdf");
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

    const formatDate = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return `${date.toLocaleString('en-US', { month: 'short' })} ${day}`;
    };

    const organizeExpensesDataByDay = (expensesData, month, year) => {
        const currentDate = new Date();
        const isCurrentMonth = month === currentDate.getMonth() + 1 && year === currentDate.getFullYear();
        const daysInMonth = isCurrentMonth ? currentDate.getDate() : new Date(year, month, 0).getDate();
        const expensesByDay = {};

        expensesData.forEach((item) => {
            const day = item.day;
            if (!expensesByDay[day]) expensesByDay[day] = [];
            expensesByDay[day].push(item);
        });

        const organizedDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            if (expensesByDay[day]) {
                expensesByDay[day].forEach((item) => {
                    organizedDays.push({ day, ...item });
                });
            } else {
                organizedDays.push({ day, empty: true });
            }
        }
        return organizedDays;
    };


    const organizedExpensesData = organizeExpensesDataByDay(expensesData.detailed, selectedDate.month, selectedDate.year);

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
                    <h3>Monthly Operational Expenses Report</h3>
                    <h6>({`${months[selectedDate.month - 1].label} ${selectedDate.year}`})</h6>
                    <p>Costs related to day-to-day business operations.</p>
                </div>

                <div className='mt-4 mb-4'>
                    <p>Date generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p>Time generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                    <p>Generated by:&nbsp;&nbsp;&nbsp;{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                </div>

                <div className='mb-4 fs-6'>
                    Total Operational Expenses: <b>{PesoFormat.format(expensesData.summary.reduce((acc, item) => acc + Number(item.total_amount || 0), 0))}</b>
                </div>

                <div className='fs-6 fw-bold mb-3'>
                    Summary List of Operational Expenses
                </div>

                <table className='mb-4'>
                    <tbody>
                        {expensesData.summary.length > 0 ? (
                            expensesData.summary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.expense_name}</td>
                                    <td className='text-end'>{PesoFormat.format(item.total_amount)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>-</td>
                                <td className='text-end'>-</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='fs-6 fw-bold mb-3'>
                    Expenses
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Expense</th>
                            <th className='text-end'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizedExpensesData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.empty ? formatDate(item.day, selectedDate.month, selectedDate.year) : formatDate(item.day, selectedDate.month, selectedDate.year)}</td>
                                <td>{item.empty ? '-' : item.expense_name || 'N/A'}</td>
                                <td className='text-end'>{item.empty ? '-' : PesoFormat.format(item.expense_amount || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className='mt-4 fs-7 fw-light'> @2024 GearUp. All rights reserved.</p>
            </div>
        </>
    );
};

export default ExpensesReport;
