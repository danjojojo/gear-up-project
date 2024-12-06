import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/page-layout/page-layout';
import './settings.scss';
import Profile from '../../components/settings/profile';
import Mechanics from '../../components/settings/mechanics';
import Security from '../../components/settings/security';  
import Pos from '../../components/settings/pos';
import Expenses from '../../components/settings/expenses';

const Settings = () => {

  const [activeTab, setActiveTab] = useState('Profile');

  // Component name
  // Tab name
  // Icon

  const allTabs = {
    Profile : [
      Profile,
      'Profile',
      <i className="fa-solid fa-user"></i>
    ],
    POS : [
      Pos,
      'POS',
      <i className="fa-solid fa-cash-register"></i>
    ],
    Mechanics : [
      Mechanics,
      'Mechanics',
      <i className="fa-solid fa-tools"></i>
    ],
    Expenses : [
      Expenses,
      'Expenses',
      <i className="fa-solid fa-dollar"></i>
    ],
    Security : [
      Security,
      'Security',
      <i className="fa-solid fa-lock"></i>
    ],
  }

  const ActiveComponent = allTabs[activeTab][0];

  return (
    <div className='profile p-3'>
        <PageLayout
            leftContent={
              <div className="settings-page">
                  <h4>{activeTab}</h4>
                  <div className="inner-container">
                      <ActiveComponent />
                  </div>
              </div>
            }

            rightContent={
              <div className='tabs-container'>
                  {
                    Object.values(allTabs).map(tab => (
                      <div 
                          key={tab} 
                          className={`tab ${activeTab === tab[1] ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab[1])}
                      >
                          <p>{tab[1]}</p>
                          {tab[2]}
                      </div>
                    ))
                  }
              </div>
            }
        />
    </div>
  )
}

export default Settings;