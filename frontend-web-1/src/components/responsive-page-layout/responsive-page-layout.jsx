import React from 'react';
import './responsive-page-layout.scss';

const ResponsivePageLayout = ({ leftContent, rightContent, rightContainer}) => {
    return (
        <div className="responsive-page-layout">
            <div className="row h-100">
                <div className='left-container col-8'>
                    <div className="left-content p-4">
                        {leftContent}
                    </div>
                </div>
                <div className={rightContainer + ' col-4'}>
                    <div className="right-content p-4">
                        {rightContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsivePageLayout;