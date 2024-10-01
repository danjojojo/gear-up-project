import React, { useState } from 'react';
import './search-bar.scss';
import searchIcon from '../../assets/icons/search.png';
import exitIcon from "../../assets/icons/exit.png";

const SearchBar = ({ value, onChange }) => {
  const [showExitIcon, setShowExitIcon] = useState(false);

  // Function to handle input change
  const handleInputChange = (e) => {
    onChange(e); // Call the parent onChange
    setShowExitIcon(e.target.value.length > 0); // Show exit icon if there's text
  };

  // Function to clear the input
  const clearInput = () => {
    onChange({ target: { value: '' } }); // Clear input in parent
    setShowExitIcon(false); // Hide exit icon
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        value={value}
        onChange={handleInputChange}
        placeholder="Search item"
      />
      {showExitIcon ? (
        <img 
          src={exitIcon} 
          alt="Exit Icon" 
          className="exit-icon" 
          onClick={clearInput} // Clear input on click
        />
      ) : (
        <img 
          src={searchIcon} 
          alt="Search Icon" 
          className="search-icon" 
        />
      )}
    </div>
  );
};

export default SearchBar;