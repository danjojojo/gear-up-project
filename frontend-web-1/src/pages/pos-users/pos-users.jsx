import './pos-users.scss'
import PageLayout from '../../components/page-layout/page-layout';
import { useEffect, useState, forwardRef } from 'react';
import LoadingPage from '../../components/loading-page/loading-page';
import { getPosUsers, addPosUser, editPosUserName, editPosUserPassword, editPosUserStatus, deletePosUser, getPosUsersLogs, getPosLogsDates } from '../../services/posUsersService';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import SearchBar from "../../components/search-bar/search-bar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    const [retrievedPosUsers, setRetrievedPosUsers] = useState([]);
    const [selectedPosUser, setSelectedPosUser] = useState([]);

    const [openPosUserView, setOpenPosUserView] = useState(false);
    const [editPosUserNameView, setEditPosUserNameView] = useState(false);
    const [editPosUserPassView, setEditPosUserPassView] = useState(false);
    const [editPosUserStatusView, setEditPosUserStatusView] = useState(false);
    const [addPosUserView, setAddPosUserView] = useState(false);
    const [deletePosUserView, setDeletePosUserView] = useState(false);

    const [posUserName, setPosUserName] = useState('');
    const [posUserPassword, setPosUserPassword] = useState('');
    const [posUserConfirmPassword, setPosUserConfirmPassword] = useState('');
    const [samePassword, setSamePassword] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deletePasswordError, setDeletePasswordError] = useState(false);

    const [selectedPosUserID, setSelectedPosUserID] = useState('');
    const [selectedPosUserName, setSelectedPosUserName] = useState('');
    const [selectedPosUserStatus, setSelectedPosUserStatus] = useState('');

    const [modalState, setModalState] = useState('');
    const [functionKey, setFunctionKey] = useState('');
    const [statusChange, setStatusChange] = useState('');
    const [tab, setTab] = useState('active');

    const posStatus = tab === 'active' ? 'active' : 'inactive';

    const [showLogs, setShowLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState([]);
    const handleToggleView = () => {
        if (!showLogs) {
            // Reset the startDate to the current date when switching to Logs view
            const currentDate = moment().format("YYYY-MM-DD");
            setStartDate(currentDate);
            fetchLogs(currentDate); // Fetch logs with the current date when switching to logs view
        }
        setShowLogs(!showLogs);
        setOpenPosUserView(false);
    };
    const DisabledDateInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <h4 className={className} onClick={onClick} ref={ref}>
                {value}
            </h4>
        )
    );

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
                        {modalResponse === 'successfully' || modalResponse === 'successful' ? 'Success' : 'Failed'}
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
                    {modalState === 'delete' &&
                        <p>
                            POS User deletion {modalResponse}!
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
                    <p>Are you sure you want to {selectedPosUserStatus === 'active' ? 'deactivate' : 'activate'} this POS User?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        onHide();
                        if (functionKey === "del") onConfirm();
                    }}>
                        {functionKey === "status" ? "Cancel" : "Confirm"}
                    </Button>
                    <Button variant={selectedPosUser.pos_status === "active" ? 'danger' : 'primary'} onClick={() => {
                        onHide();
                        if (functionKey === "status") onConfirm();
                    }}>
                        {functionKey === "status" ? "Confirm" : "Cancel"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const getPosUsersFromDB = async () => {
        try {
            const { posUsers } = await getPosUsers();
            setTab(tab);
            setAllPosUsers(posUsers);
            setRetrievedPosUsers(posUsers);
            console.log(posUsers);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        } catch (error) {
            setLoading(true)
        }
    }

    useEffect(() => {
        const fetchHighlightedDates = async () => {
            try {
                const dates = await getPosLogsDates();
                setHighlightedDates(dates.map(date => moment(date).toDate()));
            } catch (error) {
                console.error('Error fetching highlighted dates:', error);
            }
        };

        if (showLogs) {
            fetchHighlightedDates();
        }
    }, [showLogs]);

    // Fetch logs data
    const fetchLogs = async (date) => {
        try {
            const data = await getPosUsersLogs(date);
            setLogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    useEffect(() => {
        showLogs ? fetchLogs(moment(startDate).format("YYYY-MM-DD")) : getPosUsersFromDB();
    }, [showLogs, startDate]);

    const handleAddPosUser = async (event) => {
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
    const handleEditPosUserName = async (event) => {
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
    const handleEditPosUserPass = async (event) => {
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
        try {
            if (selectedPosUserStatus === 'active') {
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
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('not');
        }
    }
    const handleDeletePosUser = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('password', deletePassword);
        setModalState('delete');

        try {
            const { passwordError } = await deletePosUser(selectedPosUserID, formData);
            if (passwordError) {
                setDeletePasswordError(true);
                return;
            }
            setModalResponseShow(true);
            setModalResponse('successful');
            handleInteractPosUser([], 'close');
            await getPosUsersFromDB();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('not');
        }
    }
    function handleInteractPosUser(posUser, interact) {
        switch (interact) {
            case 'open':
                setSelectedPosUser(posUser);
                setOpenPosUserView(true);;
                setEditPosUserStatusView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setAddPosUserView(false);
                setDeletePosUserView(false);
                resetPosUserInputs();
                break;
            case 'close':
                setSelectedPosUser([]);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(false);
                setAddPosUserView(false);
                setDeletePosUserView(false);
                resetPosUserInputs();
                break;
            case 'add':
                setSelectedPosUser([]);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(false);
                setAddPosUserView(true);
                setDeletePosUserView(false);
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
                setDeletePosUserView(false);
                break;
            case 'edit-pass':
                setSelectedPosUser(posUser);
                setSelectedPosUserID(posUser.pos_id);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(true);
                setEditPosUserStatusView(false);
                setAddPosUserView(false);
                setDeletePosUserView(false);
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
                setDeletePosUserView(false);
                break;
            case 'delete':
                setSelectedPosUser(posUser);
                setSelectedPosUserID(posUser.pos_id);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setEditPosUserStatusView(false);
                setAddPosUserView(false);
                setDeletePosUserView(true);
                break;
            default:
                setSelectedPosUser([]);
                setOpenPosUserView(false);
                setEditPosUserNameView(false);
                setEditPosUserPassView(false);
                setAddPosUserView(false);
                setDeletePosUserView(false);
                break;
        }
    }
    function handlePosUserName(posUserName) {
        if (posUserName) {
            const nameExists = allPosUsers.filter((posUser) =>
                posUser.pos_name
                    .toLowerCase() === posUserName.toLowerCase()
            );
            if (nameExists.length > 0) {
                setNameError(true);
                setNameSuccess(false);
            } else {
                setNameError(false);
                setNameSuccess(true);
            }
        } else {
            setNameSuccess(false);
            setNameError(false);
        }
    }

    const [pwHasLowerCase, setPwHasLowerCase] = useState(false);
    const [pwHasUpperCase, setPwHasUpperCase] = useState(false);
    const [pwHasNumber, setPwHasNumber] = useState(false);
    const [pwHasSpecialChar, setPwHasSpecialChar] = useState(false);

    function handlePosUserPassword(posPassword) {
        if (posPassword) {
            let minLength = 8;

            // Regular expression to check the password
            const hasLowerCase = /[a-z]/.test(posPassword);
            const hasUpperCase = /[A-Z]/.test(posPassword);
            const hasNumber = /[0-9]/.test(posPassword);
            const hasSpecialChar = /[!_@#$%^&*(),.?":{}|<>]/.test(posPassword);

            if (hasLowerCase) setPwHasLowerCase(true); else setPwHasLowerCase(false);
            if (hasUpperCase) setPwHasUpperCase(true); else setPwHasUpperCase(false);
            if (hasNumber) setPwHasNumber(true); else setPwHasNumber(false);
            if (hasSpecialChar) setPwHasSpecialChar(true); else setPwHasSpecialChar(false);

            if (
                posPassword.length >= minLength &&
                hasLowerCase &&
                hasUpperCase &&
                hasNumber &&
                hasSpecialChar
            ) {
                if (posPassword === posUserConfirmPassword) {
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
        } else {
            setPasswordError(false);
            setPasswordSuccess(false);
            setSamePassword(false);
        }
    }
    function handlePosUserConfirmPassword(posPassword) {
        let minLength = 8;
        if (posPassword.length > minLength) {
            if (posPassword === posUserPassword) {
                setConfirmPasswordError(false);
                setConfirmPasswordSuccess(true);
                setSamePassword(true);
            } else {
                setConfirmPasswordError(true);
                setConfirmPasswordSuccess(false);
                setSamePassword(false);
            }
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordSuccess(false);
            setSamePassword(false);
        }
    }
    function resetPosUserInputs() {
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
    function handleShowPassword() {
        setShowPassword(!showPassword);
    }
    function functionKeyAction() {
        if (functionKey === 'status') {
            handleChangePosUserStatus();
        }
    }
    function handleModalConfirm(confirmValue) {
        setModalConfirmShow(true);
        setFunctionKey(confirmValue);
    }

    useEffect(() => {
        getPosUsersFromDB();
    }, [])

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (value) => {
        setSearchTerm(value);
        if (value === "") {
            setRetrievedPosUsers(allPosUsers);
        } else {
            const searchResults = allPosUsers.filter((posUser) => posUser.pos_name.toLowerCase().includes(value.toLowerCase()));
            setRetrievedPosUsers(searchResults);
        }
    }

    if (loading) return <LoadingPage classStyle={"loading-in-page"} />

    return (
        <div className='pos-users p-3'>
            <PageLayout
                leftContent=
                {<div className='pos-users-container' >
                    <MyVerticallyCenteredModalResponse
                        show={modalResponseShow}
                        onHide={() => setModalResponseShow(false)}
                    />
                    <MyVerticallyCenteredModalConfirmation
                        show={modalConfirmShow}
                        onHide={() => setModalConfirmShow(false)}
                        onConfirm={functionKeyAction}
                    />
                    <div className="pos-users-nav">
                        {/* Conditionally render Add POS User, SearchBar, and Status Tabs */}
                        {!showLogs && (
                            <>
                                <button
                                    className="add-pos-user"
                                    onClick={() => handleInteractPosUser([], 'add')}
                                >
                                    <span className="add-pos-user-text">Add POS User</span>
                                    <i className="fa-solid fa-circle-plus"></i>
                                </button>

                                <div className="search-sorting">
                                    <SearchBar
                                        value={searchTerm}
                                        onChange={(e) => {
                                            handleSearch(e.target.value);
                                            setSearchTerm(e.target.value);
                                        }}
                                        placeholder='Search POS user'
                                    />
                                </div>

                                <div className="status-tabs">
                                    {tab === "active" ? (
                                        <button
                                            onClick={() => {
                                                setTab("inactive");
                                                handleInteractPosUser([], 'close');
                                            }}
                                            disabled={showLogs}
                                        >
                                            <span>Archive</span>
                                            <i className="fa-solid fa-clock-rotate-left"></i>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setTab("active");
                                                handleInteractPosUser([], 'close');
                                            }}
                                            disabled={showLogs}
                                        >
                                            <span>Active</span>
                                            <i className="fa-solid fa-check"></i>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Display DatePicker when showLogs is true */}
                        {showLogs && (
                            <div className="date-picker-container">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="MMMM d, yyyy"
                                    maxDate={new Date()}
                                    todayButton="Today"
                                    isClearable={false}
                                    customInput={<DisabledDateInput className="date-picker" />}
                                    highlightDates={highlightedDates}
                                />
                            </div>
                        )}

                        <div className={`logs-tab ${showLogs ? 'ms-auto d-flex align-items-end mb-3' : ''}`}>
                            <button onClick={handleToggleView}>
                                <span>{showLogs ? 'POS Users' : 'Logs'}</span>
                                <i className={`fa-solid ${showLogs ? 'fa-users' : 'fa-clipboard-list'}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="columns">
                        {showLogs ? (
                            <>
                                <p>POS Name</p>
                                <p>Login Time</p>
                                <p>Logout Time</p>
                            </>
                        ) : (
                            <>
                                <p>Name</p>
                                <p>Date Created</p>
                                <p>Status</p>
                            </>
                        )}
                    </div>

                    <div className="list">
                        {showLogs ? (
                            logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <div key={index} className="list-item" style={{ cursor: 'default' }}>
                                        <div className="list-item-content">
                                            <p>{log.pos_name}</p>
                                            <p>{moment(log.login_time).format("LT")}</p> {/* Display only the time */}
                                            <p className='text-center'>
                                                {log.logout_time ? moment(log.logout_time).format("LT") : "Still logged in"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-list">
                                    <p>No logs available.</p>
                                </div>
                            )
                        ) : (
                            retrievedPosUsers
                                .filter((posUser) => posUser.pos_status === posStatus)
                                .map((posUser, index) => (
                                    <div key={index} className="list-item" onClick={() => handleInteractPosUser(posUser, 'open')}>
                                        <div className="list-item-content">
                                            <p>{posUser.pos_name}</p>
                                            <p>{moment(posUser.date_created).format("LL")}</p>
                                            <p className={posUser.pos_status === 'active' ? 'active' : 'inactive'}>
                                                {posUser.pos_status}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        )}

                        {/* Empty List Message */}
                        {retrievedPosUsers.filter((posUser) => posUser.pos_status === posStatus).length === 0 && !showLogs && (
                            <div className="empty-list">
                                <p>No {posStatus} POS Users.</p>
                            </div>
                        )}
                    </div>
                </div>
                }

                rightContent=
                {<div className='pos-user-right-container'>
                    {(!openPosUserView && !addPosUserView && !editPosUserNameView && !editPosUserPassView && !editPosUserStatusView && !deletePosUserView)
                        &&
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>POS User Details</h4>
                            </div>
                            <div className='empty-list'>
                                <p>Add a POS User by clicking the Add POS User button.</p>
                            </div>
                        </div>}
                    {deletePosUserView &&
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>Delete POS</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
                                            handleInteractPosUser(selectedPosUser, 'open');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Guideline:</p>
                                <ul>
                                    <li>Once deleted, you will not be able to recover this POS User.</li>
                                </ul>
                            </div>
                            {deletePasswordError &&
                                <div className="error-msg">
                                    <p>Incorrect password.</p>
                                </div>
                            }
                            <form onSubmit={handleDeletePosUser}>
                                <div className="form-input">
                                    <label>Enter your password to confirm</label>
                                    <input type={showPassword ? "text" : "password"} value={deletePassword} name="" id="password" placeholder="Enter your password" autoComplete='off' onChange={(e) => setDeletePassword(e.target.value)} />
                                </div>
                                <div className="show-password">
                                    <input type="checkbox" name="" id="" onClick={handleShowPassword} />
                                    <span>Show password</span>
                                </div>
                                {deletePassword.length != 0 &&
                                    <button className='submit-btn'>
                                        Delete
                                    </button>
                                }
                                {deletePassword.length === 0 &&
                                    <button className='submit-btn error' disabled>
                                        Delete
                                    </button>
                                }
                            </form>
                        </div>
                    }
                    {editPosUserStatusView &&
                        <div className='pos-user-details-container'>
                            <div className='pos-user-nav'>
                                <h4>{selectedPosUser.pos_status === "active" ? "Deactivate" : "Activate"} POS</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
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
                            <button className='submit-btn' onClick={() => handleModalConfirm('status')}>
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
                                        onClick={() => {
                                            handleInteractPosUser(selectedPosUser, 'open');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <form onSubmit={handleEditPosUserPass}>
                                <div className="form-input">
                                    <label>New Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserPassword} name="" id="password" placeholder="Enter New Password" autoComplete='off'
                                        onChange={(e) => {
                                            handlePosUserPassword(e.target.value);
                                            setPosUserPassword(e.target.value);
                                        }}
                                    />
                                    <div className="guide">
                                        <ul className="password-guide">
                                            <li className={posUserPassword !== '' ? (pwHasLowerCase ? 'good' : 'fail') : ''}>One lowercase letter</li>
                                            <li className={posUserPassword !== '' ? (pwHasUpperCase ? 'good' : 'fail') : ''}>One uppercase letter</li>
                                            <li className={posUserPassword !== '' ? (pwHasNumber ? 'good' : 'fail') : ''}>One number</li>
                                            <li className={posUserPassword !== '' ? (pwHasSpecialChar ? 'good' : 'fail') : ''}>One special character</li>
                                            <li className={posUserPassword !== '' ? (posUserPassword.length >= 8 ? 'good' : 'fail') : ''}>8 characters minimum</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <label>Confirm Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserConfirmPassword} name="" id="confpassword" placeholder="Enter Confirm Password" autoComplete='off'
                                        onChange={(e) => {
                                            handlePosUserConfirmPassword(e.target.value);
                                            setPosUserConfirmPassword(e.target.value);
                                        }}
                                    />
                                    <div className="guide">
                                        <ul className="password-g">
                                            <li className={posUserPassword !== '' ? (posUserConfirmPassword === posUserPassword ? 'good' : 'fail') : ''}>Passwords must match.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="show-password">
                                    <input type="checkbox" name="" id="" onClick={handleShowPassword} />
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
                                        onClick={() => {
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
                                        onChange={(e) => {
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
                                        onClick={() => {
                                            handleInteractPosUser([], 'close');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <p className='updated'>Last updated {moment(selectedPosUser.date_updated).format("lll")}</p>
                            {selectedPosUser.pos_status === 'active' &&
                                <>
                                    <div className="change"
                                        onClick={() => {
                                            handleInteractPosUser(selectedPosUser, 'edit-name');
                                        }}
                                    >
                                        <p>Change name</p>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>
                                    <div className="change"
                                        onClick={() => {
                                            handleInteractPosUser(selectedPosUser, 'edit-pass');
                                        }}
                                    >
                                        <p>Change password</p>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>
                                </>
                            }
                            <div className="change"
                                onClick={() => {
                                    handleInteractPosUser(selectedPosUser, 'edit-status');
                                }}
                            >
                                <p>{selectedPosUser.pos_status === "active" ? "Deactivate" : "Activate"} POS</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            {selectedPosUser.pos_status === 'inactive' &&
                                <div className="change"
                                    onClick={() => {
                                        handleInteractPosUser(selectedPosUser, 'delete');
                                    }}
                                >
                                    <p>Delete POS</p>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            }
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
                            <form onSubmit={handleAddPosUser}>
                                <div className='form-input'>
                                    <label>Name</label>
                                    <input type="text" value={posUserName} name="" id="name" placeholder="Enter POS Name" autoComplete='off'
                                        onChange={(e) => {
                                            handlePosUserName(e.target.value);
                                            setPosUserName(e.target.value);
                                        }}
                                    />
                                    <div className="guide">
                                        <ul className="password-g">
                                            <li className={posUserName !== '' ? (!nameError && nameSuccess ? 'good' : 'fail') : ''}>Name must be unique.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <label>Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserPassword} name="" id="password" placeholder="Enter POS Password" autoComplete='off'
                                        onChange={(e) => {
                                            handlePosUserPassword(e.target.value);
                                            setPosUserPassword(e.target.value);
                                        }}
                                    />
                                    <div className="guide">
                                        <ul className="password-guide">
                                            <li className={posUserPassword !== '' ? (pwHasLowerCase ? 'good' : 'fail') : ''}>One lowercase letter</li>
                                            <li className={posUserPassword !== '' ? (pwHasUpperCase ? 'good' : 'fail') : ''}>One uppercase letter</li>
                                            <li className={posUserPassword !== '' ? (pwHasNumber ? 'good' : 'fail') : ''}>One number</li>
                                            <li className={posUserPassword !== '' ? (pwHasSpecialChar ? 'good' : 'fail') : ''}>One special character</li>
                                            <li className={posUserPassword !== '' ? (posUserPassword.length >= 8 ? 'good' : 'fail') : ''}>8 characters minimum</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <label>Confirm Password</label>
                                    <input type={showPassword ? "text" : "password"} value={posUserConfirmPassword} name="" id="confpassword" placeholder="Enter Confirm Password" autoComplete='off'
                                        onChange={(e) => {
                                            handlePosUserConfirmPassword(e.target.value);
                                            setPosUserConfirmPassword(e.target.value);
                                        }}
                                    />
                                    <div className="guide">
                                        <ul className="password-g">
                                            <li className={posUserPassword !== '' ? (posUserConfirmPassword === posUserPassword ? 'good' : 'fail') : ''}>Passwords must match.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="show-password">
                                    <input type="checkbox" name="" id="" onClick={handleShowPassword} />
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