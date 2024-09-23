import React from 'react';
import { useNavigate } from 'react-router-dom';
import './headset.scss';
import PageLayout from '../../../../components/page-layout/page-layout';
import filter from '../../../../assets/icons/filter.png';
import sort from '../../../../assets/icons/sort.png';
import SearchBar from '../../../../components/search-bar/search-bar';

const Headset = () => {
    const navigate = useNavigate();


    const handleBackClick = () => {
        navigate('/bike-builder-upgrader');
    };

    return (
        <div className='headset p-3'>
            <PageLayout
                leftContent={
                    <div className='parts-content'>
                        <div className='upper-container d-flex'>

                            <div className='title'>
                                Headset
                            </div>

                            <button className='back-btn' onClick={handleBackClick}>
                                Back
                            </button>

                            <SearchBar />

                            <button className='filter'>
                                <img src={filter} alt='Filter' className='button-icon' />
                            </button>

                            <button className='sort'>
                                <img src={sort} alt='Sort' className='button-icon' />
                            </button>
                        </div>

                        <div className='lower-container'>
                            <div className='lower-content'>
                                {/* Content here */}
                            </div>
                        </div>
                    </div>
                }

                rightContent={
                    <>

                    </>
                }
            />
        </div>
    );
};

export default Headset;
