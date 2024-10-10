import React from 'react'
import './loading-page.scss'

const LoadingPage = ({ classStyle }) => {
    return (
      <div className={classStyle}>
          <i className="fa-solid fa-gear"></i>
      </div>
    )
}

export default LoadingPage