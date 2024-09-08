import React from 'react';
import './page-layout.scss';

const PageLayout = ({ leftContent, rightContent }) => {
    return (
        <div className="page-layout">
            <div className="row h-100">
                <div className='left-container col-8 pe-2'>
                    <div className="left-content p-4">
                        {leftContent}
                    </div>
                </div>
                <div className='right-container col-4 ps-2'>
                    <div className="right-content p-4">
                        {rightContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLayout;