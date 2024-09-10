import './summaries.scss'
import PageLayout from '../../components/page-layout/page-layout';


const Summaries = () => {
    return (
        <div className='summaries p-3'>
            <PageLayout
                leftContent={
                    <div className='summaries-container'>
                        <div className='upper-container d-flex'>
                            <div className='left-container'>

                            </div>
                            <div className='right-container'>

                            </div>


                        </div>

                        <div className='lower-container'>
                            <div className='content'>

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

export default Summaries;