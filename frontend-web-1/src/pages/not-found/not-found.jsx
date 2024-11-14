import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <div className='text-center'>
                <h1>Oops! Not Found 404</h1>
                <Link to="/">Proceed to home</Link>
            </div>
        </div>
    );
};

export default NotFound;