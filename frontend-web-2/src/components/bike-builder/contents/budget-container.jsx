// src/pages/bike-builder/components/BudgetContainer.jsx
import React from 'react';

const BudgetContainer = ({ isSettingBudget, budget, setBudget, handleProceed, setIsSettingBudget }) => {
    return (
        <div className="budget-container">
            <div className="budget-content">
                {isSettingBudget ? (
                    <div className="content">
                        <label htmlFor="budgetInput">Budget</label>
                        <input
                            id="budgetInput"
                            type="text"
                            value={budget}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty input or valid numbers (>= 0)
                                if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
                                    setBudget(value === "" ? "" : Number(value)); // Keep empty string or valid numeric value
                                }
                            }}
                            placeholder="Enter your budget"
                        />
                        <button className="btn-2" onClick={handleProceed}>
                            Proceed to bike builder
                        </button>
                    </div>
                ) : (
                    <div className="content d-flex">
                        <button className="btn-1" onClick={() => setIsSettingBudget(true)}>
                            Set a budget
                        </button>
                        <button className="btn-1" onClick={handleProceed}>
                            Continue without a budget
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetContainer;
