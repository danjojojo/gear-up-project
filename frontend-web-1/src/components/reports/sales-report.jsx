import React, { useRef, useState, useEffect, useContext } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import exportpdf from "../../assets/icons/export.png";
import MonthYearPicker from '../date-picker/date-picker';
import { getSalesReport } from '../../services/reportsService';
import { AuthContext } from "../../context/auth-context";

const SalesReport = () => {
    const reportRef = useRef();
    const { userRole } = useContext(AuthContext);
    const [salesData, setSalesData] = useState({ summary: [], detailed: [] });
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth(), // Adjust for 1-indexed months
        year: new Date().getFullYear(),
    });

    const fetchSalesData = async (month, year) => {
        try {
            const data = await getSalesReport(month, year);
            setSalesData(data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        fetchSalesData(selectedDate.month, selectedDate.year);
    }, [selectedDate]);

    const generatePDF = () => {
        const input = reportRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Determine number of pages
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            // Add more pages if content is longer than one page
            while (heightLeft > 0) {
                position -= pageHeight; // Move to the next page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('Sales_Report.pdf');
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

    const organizeSalesDataByDay = (salesData, month, year) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const salesByDay = {};

        salesData.forEach((item) => {
            const day = item.day;
            if (!salesByDay[day]) salesByDay[day] = [];
            salesByDay[day].push(item);
        });

        const organizedDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            if (salesByDay[day]) {
                salesByDay[day].forEach((item) => {
                    organizedDays.push({ day, ...item });
                });
            } else {
                organizedDays.push({ day, empty: true });
            }
        }
        return organizedDays;
    };

    const organizedSalesData = organizeSalesDataByDay(salesData.detailed, selectedDate.month, selectedDate.year);

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
                    <h3>Monthly Sales Report</h3>
                    <h6>({`${months[selectedDate.month - 1].label} ${selectedDate.year}`})</h6>
                    <p>Sales performance across different products.</p>
                </div>

                <div className='mt-4 mb-4'>
                    <p>Date generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p>Time generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                    <p>Generated by:&nbsp;&nbsp;&nbsp;{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                </div>

                <div className='mb-4 fs-6'>
                    Total Sales: <b>{PesoFormat.format(salesData.summary.reduce((acc, item) => acc + Number(item.total_sales || 0), 0))}</b>
                </div>

                <div className='fs-6 fw-bold mb-3'>
                    Summary List of Items Sold
                </div>

                <table className='mb-4'>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.summary.length > 0 ? (
                            salesData.summary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.item_name || ' - '}</td>
                                    <td>{item.quantity || 0}</td>
                                    <td className='text-end'>{PesoFormat.format(item.total_sales || 0)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='fs-6 fw-bold mb-3'>
                    Sales
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizedSalesData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.empty ? formatDate(item.day, selectedDate.month, selectedDate.year) : formatDate(item.day, selectedDate.month, selectedDate.year)}</td>
                                <td>{item.empty ? '-' : item.item_name || 'N/A'}</td>
                                <td>{item.empty ? '-' : item.quantity || 0}</td>
                                <td className='text-end'>{item.empty ? '-' : PesoFormat.format(item.unit_price || 0)}</td>
                                <td className='text-end'>{item.empty ? '-' : PesoFormat.format(item.total_sales || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className='mt-4 fs-7 fw-light'> @2024 GearUp. All rights reserved.</p>
            </div>
        </>
    );
};

export default SalesReport;
