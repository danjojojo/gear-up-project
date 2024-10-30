import React from 'react'
import PageLayout from '../../components/page-layout/page-layout';

const Profile = () => {
  return (
    <div className='profile p-3'>
        <PageLayout
            leftContent={
            <div>
                <h4>Profile</h4>
            </div>}

            rightContent={
            <div>
                <h4>Profile</h4>
            </div>
            }
        />
    </div>
  )
}

export default Profile;