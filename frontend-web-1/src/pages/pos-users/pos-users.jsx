import './pos-users.scss'
import PageLayout from '../../components/page-layout/page-layout';
import { useEffect, useState } from 'react';
import LoadingPage from '../../components/loading-page/loading-page';
import { getPosUsers, addPosUser, editPosUserName, editPosUserPassword, editPosUserStatus } from '../../services/posUsersService';
import moment from 'moment';
import {Modal, Button} from 'react-bootstrap';

const POSUsers = () => {
    const [loading, setLoading] = useState(true);
    const [modalResponse, setModalResponse] = useState('');
    const [modalResponseShow, setModalResponseShow] = useState(false);
    const [modalConfirmShow, setModalConfirmShow] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [nameError, setNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);

    const [allPosUsers, setAllPosUsers] = useState([]);
    const [allActivePosUsers, setAllActivePosUsers] = useState([]);
    const [allInactivePosUsers, setAllInactivePosUsers] = useState([]);
    const [selectedPosUser, setSelectedPosUser] = useState([]);

    const [openPosUserView, setOpenPosUserView] = useState(false);
    const [editPosUserNameView, setEditPosUserNameView] = useState(false);
    const [editPosUserPassView, setEditPosUserPassView] = useState(false);
    const [editPosUserStatusView, setEditPosUserStatusView] = useState(false);
    const [addPosUserView, setAddPosUserView] = useState(false);

    const [posUserName, setPosUserName] = useState('');
    const [posUserPassword, setPosUserPassword] = useState('');
    const [posUserConfirmPassword, setPosUserConfirmPassword] = useState('');
    const [samePassword, setSamePassword] = useState(false);

    const [selectedPosUserID, setSelectedPosUserID] = useState('');
    const [selectedPosUserName, setSelectedPosUserName] = useState('');
    const [selectedPosUserStatus, setSelectedPosUserStatus] = useState('');

    const [modalState, setModalState] = useState('');
    const [functionKey, setFunctionKey] = useState('');
    const [statusChange, setStatusChange] = useState('');
    const [tab, setTab] = useState('active');

    function MyVerticallyCenteredModalResponse(props) {
		return (
			<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			>
			<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						{modalResponse === 'successfully' ? 'Success' : 'Failed'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{modalState === 'add' && 
                    <p>
						Added {posUserName} as a POS User {modalResponse}!
					</p>
                    }
					{modalState === 'edit-name' && 
                    <p>
						Name changed {modalResponse}!
					</p>
                    }
					{modalState === 'edit-pass' && 
                    <p>
						Password changed {modalResponse}!
					</p>
                    }
					{modalState === 'edit-status' && 
                    <p>
						POS User {modalResponse} {statusChange}!
					</p>
                    }
				</Modal.Body>
			</Modal>
		);
	}
    function MyVerticallyCenteredModalConfirmation({ onHide, onConfirm, ...props }) {
		return (
			<Modal
				{...props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton onClick={onHide}>
					<Modal.Title id="contained-modal-title-vcenter">
						Confirmation
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to {selectedPosUserStatus === 'active' ? 'deactivate' : 'activate' } this POS User?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
							onHide();
							if(functionKey === "del") onConfirm();
					}}>
						{functionKey === "status" ? "Cancel" : "Confirm"}
					</Button>
					<Button variant="primary" onClick={() => {
							onHide();
							if(functionKey === "status") onConfirm();
						}}>
						{functionKey === "status" ? "Confirm" : "Cancel"}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

    const getAllActivePosUsers = (allPosUsers) => {
        const activePosUsers = allPosUsers.filter((posUser) => 
            posUser.pos_status === 'active'
        );
        setAllActivePosUsers(activePosUsers);
    }    
    const getAllInactivePosUsers = (allPosUsers) => {
        const inactivePosUsers = allPosUsers.filter((posUser) => 
            posUser.pos_status === 'inactive'
        );
        setAllInactivePosUsers(inactivePosUsers);
    }
    const getPosUsersFromDB = async () => {
        try {
            const { posUsers } = await getPosUsers();
            setTab(tab);
            setAllPosUsers(posUsers);
            getAllActivePosUsers(posUsers);
            getAllInactivePosUsers(posUsers);
            console.log(posUsers);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        } catch (error) {
            setLoading(true)
        }
    }
    const handleAddPosUser = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', posUserName);
        formData.append('password', posUserPassword);
        setModalState('add');
    
        try {
            await addPosUser(formData);
            setModalResponseShow(true);
            setModalResponse('successfully');
            resetPosUserInputs();
            handleInteractPosUser([], 'close');
            await getPosUsersFromDB();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
    }
    const handleEditPosUserName = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', selectedPosUserName);
        setModalState('edit-name');

        try {
            await editPosUserName(selectedPosUserID, formData);
            setModalResponseShow(true);
            setModalResponse('successfully');
            resetPosUserInputs();
            handleInteractPosUser([], 'close');
            await getPosUsersFromDB();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
        
    }
    const handleEditPosUserPass = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('password', posUserPassword);
        setModalState('edit-pass');
        console.log(selectedPosUserID);

        try {
            await editPosUserPassword(selectedPosUserID, formData);
            setModalResponseShow(true);
            setModalResponse('successfully');
            resetPosUserInputs();
            handleInteractPosUser([], 'close');
            await getPosUsersFromDB();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
        
    }
    const handleChangePosUserStatus = async () => {
        console.log(selectedPosUserStatus);
        setModalState('edit-status');
        try{
            if(selectedPosUserStatus === 'active'){ 
                setStatusChange('deactivated');
            } else {
                setStatusChange('activated');
            }
            const status = selectedPosUserStatus === 'active' ? 'inactive' : 'active';  
            await editPosUserStatus(selectedPosUserID, status);
            setModalResponseShow(true);
            setModalResponse('successfully');
            handleInteractPosUser([], 'close');
            await getPosUsersFromDB();
        }catch (error){
            setModalResponseShow(true);
            setModalResponse('not');
        }
    }

    function handleInteractPosUser(posUser, interact){
        switch(interact){
            case 'open':
                setSelectedPosUser(posUser);
                setOpenPosUserView(true);;
                setEditPosUserStatusView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setAddPosUserView(false);
                break;
            case 'close':
                setSelectedPosUser([]);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(false);
                setAddPosUserView(false);
                resetPosUserInputs();
                break;
            case 'add':
                setSelectedPosUser([]);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(false);
                setAddPosUserView(true);
                break;
            case 'edit-name':
                setSelectedPosUser(posUser);
                setSelectedPosUserID(posUser.pos_id);
                setSelectedPosUserName(posUser.pos_name);
                setOpenPosUserView(false);
                setEditPosUserNameView(true);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(false);
                setAddPosUserView(false);
                break;
            case 'edit-pass':
                setSelectedPosUser(posUser);
                setSelectedPosUserID(posUser.pos_id);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(true);
                setEditPosUserStatusView(false);
                setAddPosUserView(false);
                break;
            case 'edit-status':
                setSelectedPosUser(posUser);
                setSelectedPosUserID(posUser.pos_id);
                setSelectedPosUserStatus(posUser.pos_status);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(true);
                setAddPosUserView(false);
                break;
            default:
                setSelectedPosUser([]);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setAddPosUserView(false);
                break;
        }
    }
    function handlePosUserName(posUserName){
        if(posUserName){
            const nameExists = allPosUsers.filter((posUser) => 
                posUser.pos_name
                .toLowerCase() === posUserName.toLowerCase()
            );
            if(nameExists.length > 0){
                setNameError(true);
                setNameSuccess(false);
            } else {
                setNameError(false); 
                setNameSuccess(true);
            }
        }else{
            setNameSuccess(false);
            setNameError(false);
        }
    }
    function handlePosUserPassword(posPassword){
        if(posPassword){
            let minLength = 8;
            if(posPassword.length > minLength){
                if(posPassword === posUserConfirmPassword){
                    setPasswordError(false);
                    setPasswordSuccess(true);
                    setSamePassword(true);
                } else {
                    setPasswordError(false);
                    setPasswordSuccess(true);
                    setSamePassword(false);
                }
            } else {
                setPasswordError(true);
                setPasswordSuccess(false);
                setSamePassword(false);
            }
        }else{
            setPasswordError(false);
            setPasswordSuccess(false);
            setSamePassword(false);
        }
    }
    function handlePosUserConfirmPassword(posPassword){
        let minLength = 8;
        if(posPassword.length > minLength){
            if(posPassword === posUserPassword){
                setConfirmPasswordError(false);
                setConfirmPasswordSuccess(true);
                setSamePassword(true);
            } else{
                setConfirmPasswordError(true);
                setConfirmPasswordSuccess(false);
                setSamePassword(false);
            }
        }else{
            setConfirmPasswordError(false);
            setConfirmPasswordSuccess(false);
            setSamePassword(false);
        }
    }
    function resetPosUserInputs(){
        setPosUserName('');
        setPosUserPassword('');
        setPosUserConfirmPassword('');
        setNameError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setNameSuccess(false);
        setPasswordSuccess(false);
        setConfirmPasswordSuccess(false);
        setSamePassword(false);
        setShowPassword(false);
    }
    function handleShowPassword(){
        setShowPassword(!showPassword);
    }
    function functionKeyAction(){
        if(functionKey === 'status'){
            handleChangePosUserStatus();
        }
    }
    function handleModalConfirm(confirmValue){
        setModalConfirmShow(true);
        setFunctionKey(confirmValue);
    }

    useEffect(() => {
        getPosUsersFromDB();
    }, [])

    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>

    return (
        <div className='pos-users p-3'>
            <PageLayout
                leftContent=
                {<div className='pos-users-container'>
                    <MyVerticallyCenteredModalResponse
						show={modalResponseShow}
						onHide={() => {
                            setModalResponseShow(false)
                        }}
					/>
                    <MyVerticallyCenteredModalConfirmation
						show={modalConfirmShow}
						onHide={() => setModalConfirmShow(false)}
						onConfirm={functionKeyAction}
					/>
                    <div className="pos-users-nav">
                        <div className="status-tabs">
                            <button
                                className={tab === "active" ? "active" : ""}
                                onClick={() => {
                                    setTab("active")
                                    handleInteractPosUser([], 'close');
                                }}
                                >
                                Active
                            </button>
                            <button
                                className={tab === "inactive" ? "active" : ""}
                                onClick={() => {
                                    setTab("inactive")
                                    handleInteractPosUser([], 'close');
                                }}
                            >
                                Inactive
                            </button>
                        </div>
                        <button 
                            className="add-pos-user"
                            onClick={() => {
                                handleInteractPosUser([], 'add');
                            }}
                        >
                            Add POS User
                        </button>
                    </div>
                    <div className="columns">
                        <p>Name</p>
                        <p>Date created</p>
                        <p>Status</p>
                    </div>
                    <div className="list">
                        {tab === 'active' && allActivePosUsers.length === 0 &&
                            <div className='empty-list'>
                                <p>No active POS Users.</p>
                            </div>
                        }
                        {tab === 'inactive' && allInactivePosUsers.length === 0 &&
                            <div className='empty-list'>
                                <p>No inactive POS Users.</p>
                            </div>
                        }
                        {tab === 'active' && allActivePosUsers.map((posUser, index) => {
                            return(
                                <div key={index} className="list-item" 
                                        onClick={()=>{
                                            handleInteractPosUser(posUser, 'open');
                                        }}
                                    >
                                    <div className="list-item-content">
                                        <p>{posUser.pos_name}</p>
                                        <p>{moment(posUser.date_created).format("LL")}</p>
                                        <p className={
                                            posUser.pos_status === 'active' ? 'active' : 'inactive'
                                        }
                                        >{posUser.pos_status}</p>
                                    </div>
                                </div>
                            )
                        })}
                        {tab === 'inactive' && allInactivePosUsers.map((posUser, index) => {
                            return(
                                <div key={index} className="list-item" 
                                        onClick={()=>{
                                            handleInteractPosUser(posUser, 'open');
                                        }}
                                    >
                                    <div className="list-item-content">
                                        <p>{posUser.pos_name}</p>
                                        <p>{moment(posUser.date_created).format("LL")}</p>
                                        <p className={
                                            posUser.pos_status === 'active' ? 'active' : 'inactive'
                                        }
                                        >{posUser.pos_status}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>}

                rightContent=
                {<div>
                    {(!openPosUserView && !addPosUserView && !editPosUserNameView && !editPosUserPassView && !editPosUserStatusView) 
                    && 
                    <div className='pos-user-details-container'>
                        <div className='pos-user-nav'>
                            <h4>POS User Details</h4>
                        </div>
                        <div className='empty-list'>
                            <p>Add a POS User by clicking the Add POS User button.</p>
						</div>
                    </div>} 
                    {editPosUserStatusView && 
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>{selectedPosUser.pos_status === "active" ? "Deactivate" : "Activate"} POS</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={()=>{
                                            handleInteractPosUser(selectedPosUser, 'open');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Guideline:</p>
                                <ul>
                                    <li>When deactivated, staff will not be able to sign in using this account.</li>
                                    <li>You can activate this if you want staff to use this account.</li>
                                </ul>
                            </div>
                            <button className='submit-btn' onClick={()=> handleModalConfirm('status')}>
                                {selectedPosUser.pos_status === "active" ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    }
                    {editPosUserPassView && 
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>Change Password</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={()=>{
                                            handleInteractPosUser(selectedPosUser, 'open');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Guideline for changing the password:</p>
                                <ul>
                                    <li>Password must be atleast 8 characters.</li>
                                    <li>Password and confirm password must match.</li>
                                </ul>
                            </div>
                            <form onSubmit={handleEditPosUserPass}>
                                <div className="form-input">
                                    <label>New Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserPassword} name="" id="password" placeholder="Enter New Password" autoComplete='off'
                                        onChange={(e)=>{
                                            handlePosUserPassword(e.target.value);
                                            setPosUserPassword(e.target.value);
                                        }}
                                    />
                                    {passwordError && <p className='error'>Password must be at least 8 characters.</p>}
                                    {(!passwordError && passwordSuccess) &&
                                        <p className='success'>
                                            Password is valid.
                                        </p>
                                    }
                                </div>
                                <div className="form-input">
                                    <label>Confirm Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserConfirmPassword} name="" id="confpassword" placeholder="Enter Confirm Password" autoComplete='off'
                                        onChange={(e)=>{
                                            handlePosUserConfirmPassword(e.target.value);
                                            setPosUserConfirmPassword(e.target.value);
                                        }}
                                    />
                                    {(!samePassword && posUserPassword.length > 0) && <p className='error'>Passwords do not match.</p>}
                                    {samePassword && <p className='success'>Passwords match.</p>}
                                </div>
                                <div className="show-password">
                                    <input type="checkbox" name="" id="" onClick={handleShowPassword}/>
                                    <span>Show password</span>
                                </div>
                                {(passwordSuccess && confirmPasswordSuccess) && 
                                    <button className='submit-btn'>Save</button>
                                }
                                {(!passwordSuccess || !confirmPasswordSuccess) &&
                                    <div className='submit-btn error'>Save</div>
                                }
                            </form>
                        </div>
                    }
                    {editPosUserNameView && 
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>Change Name</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={()=>{
                                            handleInteractPosUser(selectedPosUser, 'open');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Guideline for changing the name:</p>
                                <ul>
                                    <li>Name must be unique.</li>
                                </ul>
                            </div>
                            <form onSubmit={handleEditPosUserName}>
                                <div className='form-input'>
                                    <label>Name</label>
                                    <input type="text" value={selectedPosUserName} name="" id="name" placeholder="Enter POS Name"
                                        onChange={(e)=>{
                                            handlePosUserName(e.target.value);
                                            setSelectedPosUserName(e.target.value);
                                        }}
                                    />
                                    {nameError && <p className='error'>Name is already existing.</p>}
                                    {(!nameError && nameSuccess) &&
                                        <p className='success'>
                                            Name is available.
                                        </p>
                                    }
                                </div>
                                {(nameSuccess) && 
                                    <button className='submit-btn'>Save</button>
                                }
                                {(!nameSuccess) &&
                                    <div className='submit-btn error'>Save</div>
                                }
                            </form>
                        </div>
                    }
                    {openPosUserView && 
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>{selectedPosUser.pos_name}</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={()=>{
                                            handleInteractPosUser([], 'close');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <p className='updated'>Last updated {moment(selectedPosUser.date_updated).format("lll")}</p>
                            <div className="change"
                                onClick={()=>{
                                    handleInteractPosUser(selectedPosUser, 'edit-name');
                                }}
                            >
                                <p>Change name</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            <div className="change"
                                onClick={()=>{
                                    handleInteractPosUser(selectedPosUser, 'edit-pass');
                                }}
                            >
                                <p>Change password</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            <div className="change"
                                onClick={()=>{
                                    handleInteractPosUser(selectedPosUser, 'edit-status');
                                }}
                            >
                                <p>{selectedPosUser.pos_status === "active" ? "Deactivate" : "Activate"} POS</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    } 
                    {addPosUserView && 
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>Add POS User</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
                                            handleInteractPosUser([], 'close');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Fill in the form below to add a new POS User.</p>
                                <ul>
                                    <li>Name must be unique.</li>
                                    <li>Password must be atleast 8 characters.</li>
                                    <li>Password and confirm password must match.</li>
                                </ul>
                            </div>
                            <form onSubmit={handleAddPosUser}>
                                <div className='form-input'>
                                    <label>Name</label>
                                    <input type="text" value={posUserName} name="" id="name" placeholder="Enter POS Name"
                                        onChange={(e)=>{
                                            handlePosUserName(e.target.value);
                                            setPosUserName(e.target.value);
                                        }}
                                    />
                                    {nameError && <p className='error'>Name is already existing.</p>}
                                    {(!nameError && nameSuccess) &&
                                        <p className='success'>
                                            Name is available.
                                        </p>
                                    }
                                </div>
                                <div className="form-input">
                                    <label>Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserPassword} name="" id="password" placeholder="Enter POS Password" autoComplete='off'
                                        onChange={(e)=>{
                                            handlePosUserPassword(e.target.value);
                                            setPosUserPassword(e.target.value);
                                        }}
                                    />
                                    {passwordError && <p className='error'>Password must be at least 8 characters.</p>}
                                    {(!passwordError && passwordSuccess) &&
                                        <p className='success'>
                                            Password is valid.
                                        </p>
                                    }
                                </div>
                                <div className="form-input">
                                    <label>Confirm Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserConfirmPassword} name="" id="confpassword" placeholder="Enter Confirm Password" autoComplete='off'
                                        onChange={(e)=>{
                                            handlePosUserConfirmPassword(e.target.value);
                                            setPosUserConfirmPassword(e.target.value);
                                        }}
                                    />
                                    {(!samePassword && posUserPassword.length > 0) && <p className='error'>Passwords do not match.</p>}
                                    {samePassword && <p className='success'>Passwords match.</p>}
                                </div>
                                <div className="show-password">
                                    <input type="checkbox" name="" id="" onClick={handleShowPassword}/>
                                    <span>Show password</span>
                                </div>
                                {(nameSuccess && samePassword) && 
                                    <button className='submit-btn'>Save</button>
                                }
                                {(!nameSuccess || !samePassword) &&
                                    <div className='submit-btn error'>Save</div>
                                }
                            </form>
                        </div>
                    } 
                </div>}
            />
        </div>
    );
};

export default POSUsers;