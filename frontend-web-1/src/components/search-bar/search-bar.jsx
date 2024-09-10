import React from 'react';
import './search-bar.scss';
import searchIcon from '../../assets/icons/search.png';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input 
        type="text" 
      />
      <img fluid 
        src={searchIcon} 
        alt="Search Icon" 
        className="search-icon" 
      />
    </div>
  );
};

export default SearchBar;