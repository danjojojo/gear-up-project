import './auth-layout.scss'

const AuthLayout = ({ formData }) => {

    return (
        <div className='auth-layout'>
            <div className='auth-container d-flex'>
                <div className='left-container col-6 p-5 bg-light'>
                    <h1>GearUp</h1>
                    {formData}
                </div>

                <div className='right-container col-6 p-2 '>

                </div>
            </div>
        </div>
    );
};
export default AuthLayout;