import React, { useState } from 'react';
import Select from 'react-select';
import "./date-picker.scss";

const MonthYearPicker = () => {
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    // Months array
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

    // Generate an array of months and years, starting from the current and going backwards
    const generateMonthYearOptions = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let options = [];

        // Generate options for the last 5 years (adjust the number as needed)
        for (let year = currentYear; year >= currentYear - 5; year--) {
            for (let month = 11; month >= 0; month--) {
                // Start from the current month if it's the current year
                if (year === currentYear && month > currentMonth) {
                    continue;
                }
                options.push({
                    value: { month, year },
                    label: `${months[month].label} ${year}`
                });
            }
        }

        return options;
    };

    const combinedOptions = generateMonthYearOptions();

    const handleChange = (selectedOption) => {
        setSelectedDate(selectedOption.value);
    };

    return (
        <Select
            value={{
                value: selectedDate,
                label: `${months[selectedDate.month].label} ${selectedDate.year}`
            }}
            options={combinedOptions}
            onChange={handleChange}
            className="custom-datepicker"
            classNamePrefix="custom"
        />
    );
};

export default MonthYearPicker;
