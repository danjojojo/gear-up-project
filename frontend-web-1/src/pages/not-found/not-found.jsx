import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <h1>Oops! Not Found 404</h1>
            <Link to="/">Proceed to home</Link>
        </div>
    );
};

export default NotFound;