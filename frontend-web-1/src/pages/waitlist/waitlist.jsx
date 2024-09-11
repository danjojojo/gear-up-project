import './waitlist.scss'
import PageLayout from '../../components/page-layout/page-layout';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';

const Wailtlist = () => {


    return (
        <div className='waitlist p-3'>
            <PageLayout
                leftContent={
                    <div className='waitlist-content'>
                        <div className='upper-container d-flex '>


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

                            </div>
                        </div>

                    </div>
                }

                rightContent={<div>

                </div>}
            />
        </div>
    );
};

export default Wailtlist;