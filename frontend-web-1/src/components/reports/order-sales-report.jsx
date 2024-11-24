import React, { useRef, useState, useEffect, useContext } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import exportpdf from "../../assets/icons/export.png";
import MonthYearPicker from '../date-picker/date-picker';
import { getOrderReport } from '../../services/reportsService';
import { AuthContext } from "../../context/auth-context";
import registerCooperFont from '../fonts/Cooper-ExtraBold-normal';
import registerRubikFont from '../fonts/Rubik-Regular-normal';
import registerRubikBoldFont from '../fonts/Rubik-Bold-normal';
import registerRubikSemiBoldFont from '../fonts/Rubik-SemiBold-normal';

const OrderSalesReport = () => {
    const reportRef = useRef();
    const { userRole } = useContext(AuthContext);
    const [orderData, setOrderData] = useState({ summary: [], detailed: [] });
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth(), // Adjust for 1-indexed months
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        registerCooperFont();
        registerRubikFont();
        registerRubikBoldFont();
        registerRubikSemiBoldFont();
    }, []);

    const fetchOrderData = async (month, year) => {
        try {
            const data = await getOrderReport(month, year);
            setOrderData(data);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    useEffect(() => {
        fetchOrderData(selectedDate.month, selectedDate.year);
    }, [selectedDate]);

    const generatePDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30; // Starting vertical position for content
        const columnWidth = (pdfWidth - 2 * margin) / 2;
        const columnWidth1 = (pdfWidth - 2 * margin) / 9;

        // Header section
        pdf.setFontSize(22);
        pdf.setFont('Cooper-ExtraBold');
        pdf.setTextColor('#F9961F');
        const title1 = 'ARON';
        const title2 = 'BIKES';
        pdf.text(title1, (pdfWidth - pdf.getTextWidth(title1 + title2)) / 2, yPosition);

        pdf.setTextColor('#2E2E2E');
        pdf.text(title2, (pdfWidth + pdf.getTextWidth(title1) - pdf.getTextWidth(title2)) / 2, yPosition);

        pdf.setFontSize(8);
        pdf.setFont('Rubik-Regular');
        yPosition += 6;
        const subtitle = 'Antipolo City';
        pdf.text(subtitle, (pdfWidth - pdf.getTextWidth(subtitle)) / 2, yPosition);

        pdf.setFontSize(16);
        pdf.setFont('Rubik-Bold');
        yPosition += 8;
        const reportTitle = 'Monthly Order Sales Report';
        pdf.text(reportTitle, (pdfWidth - pdf.getTextWidth(reportTitle)) / 2, yPosition);

        pdf.setFontSize(11);
        pdf.setFont('Rubik-SemiBold');
        yPosition += 7;
        const reportSubtitle = `(${months[selectedDate.month - 1].label} ${selectedDate.year})`;
        pdf.text(reportSubtitle, (pdfWidth - pdf.getTextWidth(reportSubtitle)) / 2, yPosition);

        pdf.setFontSize(9);
        pdf.setFont('Rubik-Regular');
        yPosition += 7;
        const performanceText = 'Summary of order sales performance.';
        pdf.text(performanceText, (pdfWidth - pdf.getTextWidth(performanceText)) / 2, yPosition);

        // Report Metadata
        pdf.setFontSize(8);
        yPosition += 14;
        pdf.text(`Date generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Time generated: ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Generated by: ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`, margin, yPosition);


        pdf.setFontSize(9);
        pdf.setFont('Rubik-Regular');
        yPosition += 10;
        const label = 'Total Order Sales:';
        pdf.text(label, margin, yPosition);
        pdf.setFont('Rubik-SemiBold');  // Switch to bold font for the value
        const value = `P ${PesoFormat.format(orderData.summary.total_revenue || 0)}`;
        pdf.text(value, margin + pdf.getTextWidth(label), yPosition);

        // "Summary" section header
        pdf.setFontSize(9);
        pdf.setFont('Rubik-SemiBold');
        yPosition += 10;
        const summaryHeader = "Summary";
        pdf.text(summaryHeader, margin, yPosition);

        // Summary Table
        autoTable(pdf, {
            startY: yPosition + 4,
            theme: 'grid',
            body: [
                ['Total Orders', `${orderData.summary.total_orders || "-"}`],
                ['Total Orders Items', `${orderData.summary.total_order_items || "-"}`],
                ['Bike Builder Orders', `${orderData.summary.bike_builder_orders || "-"}`],
                ['Bike Upgrader Orders', `${orderData.summary.bike_upgrader_orders || "-"}`]
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

        // "Daily Orders" section header
        yPosition = pdf.lastAutoTable.finalY + 7;
        pdf.setFont('Rubik-SemiBold');
        const ordersHeader = "Daily Orders";
        pdf.text(ordersHeader, margin, yPosition);

        // Detailed Orders Table
        autoTable(pdf, {
            startY: yPosition + 4,
            theme: 'grid',
            head: [['Day', 'Order Name', 'Customer Name', 'Amount', 'No. of Items', 'Processed On', 'Completed On', 'Bike Builder', 'Bike Upgrader']],
            body: organizedOrderData.map(order => [
                order.empty ? formatDate(order.day, selectedDate.month, selectedDate.year) : formatDate(order.day, selectedDate.month, selectedDate.year),
                order.empty ? '-' : order.order_name,
                order.empty ? '-' : order.cust_name,
                order.empty ? '-' : `P ${PesoFormat.format(order.amount || 0)}`,
                order.empty ? '-' : order.num_items || 0,
                order.empty ? '-' : new Date(order.processed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                order.empty ? '-' : new Date(order.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                order.empty ? '-' : order.bike_builder,
                order.empty ? '-' : order.bike_upgrader
            ]),
            headStyles: {
                fillColor: [46, 46, 46],
                font: 'Rubik-SemiBold',
                halign: 'center',
                fontSize: 9
            },
            bodyStyles: {
                font: 'Rubik-Regular',
                fontStyle: 'normal',
                fontSize: 9,
                textColor: [0, 0, 0]
            },
            columnStyles: {
                0: { cellWidth: columnWidth1, halign: 'center' },
                1: { cellWidth: columnWidth1, halign: 'left' },
                2: { cellWidth: columnWidth1, halign: 'left' },
                3: { cellWidth: columnWidth1, halign: 'right' },
                4: { cellWidth: columnWidth1, halign: 'center' },
                5: { cellWidth: columnWidth1, halign: 'center' },
                6: { cellWidth: columnWidth1, halign: 'center' },
                7: { cellWidth: columnWidth1, halign: 'center' },
                8: { cellWidth: columnWidth1, halign: 'center' }
            },
            margin: { left: 20, right: 20 },
            styles: {
                font: 'Rubik-Regular',
                fontSize: 10,
                cellPadding: 2,
                lineWidth: 0.1, // Ensures the body cells also have a consistent border width
                lineColor: [0, 0, 0]
            },
            tableWidth: 'auto'
        });

        yPosition = pdf.lastAutoTable.finalY + 9;
        pdf.setFont('Rubik-Regular');
        pdf.setFontSize(8);
        const reserved = "@2024 GearUp. All rights reserved.";
        pdf.text(reserved, margin, yPosition);

        // Display PDF in a new window
        // pdf.output("dataurlnewwindow");
        pdf.save(`${months[selectedDate.month - 1].label}_${selectedDate.year}_Order_Sales_Report.pdf`);
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

    const organizeOrderDataByDay = (orderData, month, year) => {
        const currentDate = new Date();
        const isCurrentMonth = month === currentDate.getMonth() + 1 && year === currentDate.getFullYear();
        const daysInMonth = isCurrentMonth ? currentDate.getDate() : new Date(year, month, 0).getDate();
        const ordersByDay = {};

        // Group orders by day
        orderData.forEach((item) => {
            const day = item.day;
            if (!ordersByDay[day]) ordersByDay[day] = [];
            ordersByDay[day].push(item);
        });

        // Create an organized array of days, filling missing days with placeholders
        const organizedDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            if (ordersByDay[day]) {
                ordersByDay[day].forEach((item) => {
                    organizedDays.push({ day, ...item });
                });
            } else {
                organizedDays.push({ day, empty: true });
            }
        }

        return organizedDays;
    };

    // Example Usage
    const organizedOrderData = organizeOrderDataByDay(orderData.detailed, selectedDate.month, selectedDate.year);

    return (
        <>
            <div className='upper'>
                <MonthYearPicker setSelectedDate={setSelectedDate} />
                <button onClick={generatePDF} style={{ marginTop: '20px' }} type='button'>
                    <img src={exportpdf} alt="export-icon" />
                    Export
                </button>
            </div>

            <div ref={reportRef} className="pdf-content">
                <div className="upper-text" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1><span>ARON</span><span>BIKES</span></h1>
                    <p>Antipolo City</p>
                    <h3>Monthly Order Sales Report</h3>
                    <h6>({`${months[selectedDate.month - 1].label} ${selectedDate.year}`})</h6>
                    <p>Summary of order sales performance.</p>
                </div>

                <div className='mt-4 mb-4'>
                    <p>Date generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p>Time generated:&nbsp;&nbsp;&nbsp;{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                    <p>Generated by:&nbsp;&nbsp;&nbsp;{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                </div>

                <div className='mb-4 fs-6'>
                    Total Order Sales: <b>{PesoFormat.format(orderData.summary.total_revenue || 0)}</b>
                </div>

                <div className='fs-6 fw-bold mb-3'>
                    Summary
                </div>

                <table className='mb-4'>
                    <tbody>
                        <tr>
                            <td className='text-start'>Total Orders</td>
                            <td className='text-end'>{orderData.summary.total_orders || "-"}</td>
                        </tr>
                        <tr>
                            <td className='text-start'>Total Order Items</td>
                            <td className='text-end'>{orderData.summary.total_order_items || "-"}</td>
                        </tr>
                        <tr>
                            <td className='text-start'>Bike Builder Orders</td>
                            <td className='text-end'>{orderData.summary.bike_builder_orders || "-"}</td>
                        </tr>
                        <tr>
                            <td className='text-start'>Bike Upgrader Orders</td>
                            <td className='text-end'>{orderData.summary.bike_upgrader_orders || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                <div className='fs-6 fw-bold mb-3'>
                    Daily Orders
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Order Name</th>
                            <th>Customer Name</th>
                            <th>Amount</th>
                            <th>No. of Items</th>
                            <th>Processed On</th>
                            <th>Completed On</th>
                            <th>Bike Builder</th>
                            <th>Bike Upgrader</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizedOrderData.map((order, index) => (
                            <tr key={index}>
                                <td>{order.empty ? formatDate(order.day, selectedDate.month, selectedDate.year) : formatDate(order.day, selectedDate.month, selectedDate.year)}</td>
                                <td>{order.empty ? '-' : order.order_name || 'N/A'}</td>
                                <td>{order.empty ? '-' : order.cust_name || 'N/A'}</td>
                                <td className='text-end'>{order.empty ? '-' : PesoFormat.format(order.amount || 0)}</td>
                                <td className='text-center'>{order.empty ? '-' : order.num_items || 0}</td>
                                <td>{order.empty ? '-' : new Date(order.processed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                <td>{order.empty ? '-' : new Date(order.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                <td className='text-center'>{order.empty ? '-' : order.bike_builder}</td>
                                <td className='text-center'>{order.empty ? '-' : order.bike_upgrader}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className='mt-4 fs-7 fw-light'> @2024 GearUp. All rights reserved.</p>
            </div>
        </>
    );
};

export default OrderSalesReport;