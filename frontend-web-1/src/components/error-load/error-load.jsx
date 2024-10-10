import React from 'react'
import './error-load.scss'

const ErrorLoad = ({ classStyle }) => {
    return (
      <div className={classStyle}>
          <i className="fa-solid fa-screwdriver-wrench"></i>
          <p className="title">Uh oh, something wrong happened!</p>
          <p className='subtitle'>Please try refreshing the page.</p>
      </div>
    )
}

export default ErrorLoad