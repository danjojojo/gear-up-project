import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/page-layout/page-layout'
import './mechanics.scss'
import { getMechanics, addMechanic, editMechanic, changeMechanicStatus, deleteMechanic} from '../../services/mechanicsService'
import moment from 'moment';
import {Modal, Button} from 'react-bootstrap';
import LoadingPage from '../../components/loading-page/loading-page';
import ErrorLoad from '../../components/error-load/error-load';
import SearchBar from "../../components/search-bar/search-bar";

const Mechanics = () => {

    const [mechanicsList, setMechanicsList] = useState([]);
    const [retrievedMechanicsList, setRetrievedMechanicsList] = useState([]);

    const [addMechanicView, setAddMechanicView] = useState(false);
    const [editMechanicView, setEditMechanicView] = useState(false);
    const [openMechanicView, setOpenMechanicView] = useState(false);

    const [mechanicName, setMechanicName] = useState('');
    const [selectedMechanic, setSelectedMechanic] = useState({});
    const [selectedMechanicName, setSelectedMechanicName] = useState('');
    const [selectedMechanicID, setSelectedMechanicID] = useState('');

    const [nameError, setNameError] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);

    const [modalState, setModalState] = useState('');
    const [modalResponse, setModalResponse] = useState('');
    const [modalResponseShow, setModalResponseShow] = useState(false);
    const [modalConfirmShow, setModalConfirmShow] = useState(false);
    const [functionKey, setFunctionKey] = useState('');

    const [activeTab, setActiveTab] = useState(true);
    const [loading, setLoading] = useState(true);
    const [errorLoad, setErrorLoad] = useState(false);
    const mechanicStatus = activeTab === true ? true : false;

    const [searchTerm, setSearchTerm] = useState("");
    const [sortMechanicsRecent, setSortMechanicsRecent] = useState(false);

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
						Added {mechanicName} as a mechanic {modalResponse}!
					</p>
                    }
					{modalState === 'edit-name' && 
                    <p>
						Name changed {modalResponse}!
					</p>
                    }
					{modalState === 'archive' && 
                    <p>
						Mechanic {selectedMechanicName} archived {modalResponse}! This mechanic will be stored in the Archive. 
					</p>
                    }
					{modalState === 'restore' && 
                    <p>
						Mechanic {selectedMechanicName} restored {modalResponse}!
					</p>
                    }
					{modalState === 'delete' && 
                    <p>
						Mechanic {selectedMechanicName} deleted {modalResponse}!
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
						{functionKey === "archive" &&
                            "Delete mechanic?"
                        }
                        {functionKey === "restore" &&
                            "Restore mechanic?"
                        }
                        {functionKey === "delete" &&
                            "Delete this mechanic?"
                        }
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    {functionKey === "archive" && 
                        <p>If you archive this mechanic, it will not be shown in your POS. Archived mechanics will be stored and can be restored in the Archived tab in this page.</p>
                    }
                    {functionKey === "restore" &&
                        <p>If you restore this mechanic, it can be used again in your POS. You will also be able to edit its details.</p>
                    }
                    {functionKey === "delete" &&
                        <p>If you delete this mechanic, you won't be able to restore it.</p>
                    }
					{/* <p>Are you sure you want to {activeTab ? 'delete' : 'restore'} this mechanic?</p> */}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
                        onHide();
                        if(functionKey === "delete") onConfirm();
                    }}>
						{(functionKey === "archive" || functionKey === "restore") ? "Cancel" : "Confirm"}
					</Button>
					<Button variant={functionKey === 'delete' || functionKey === 'archive' ? "danger" : "primary"} onClick={() => {
							onHide();
							if(functionKey === "archive" || functionKey === "restore") onConfirm();
						}}>
						{(functionKey === "archive" || functionKey === "restore") ? "Confirm" : "Cancel"}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

    const handleGetMechanic = async () => {
        try {
            const { mechanics } = await getMechanics();
            setMechanicsList(mechanics);
            setRetrievedMechanicsList(mechanics);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);   
            }, 1000);
        } 
        catch (error) {
            console.error('Error getting mechanics', error);
             setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);   
            }, 1000);
        }
    }
    const handleAddMechanic = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', mechanicName);
        setModalState('add');
        try {
            await addMechanic(formData);
            setModalResponseShow(true);
            setModalResponse('successfully');
            setActiveTab(true);
            resetForm();
            await handleGetMechanic();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
    }
    const handleEditMechanic = async (event) => {
        const id = selectedMechanicID;
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', selectedMechanicName);
        setModalState('edit-name');
        try {
            await editMechanic(id, formData);
            setModalResponseShow(true);
            setModalResponse('successfully');
            handleInteractMechanic({}, 'close');
            setActiveTab(true);
            resetForm();
            await handleGetMechanic();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
    }
    const handleChangeMechanicStatus = async () => {
        const id = selectedMechanic.mechanic_id;
        const status = selectedMechanic.status === true ? false : true; 
        try {
            await changeMechanicStatus(id, status);
            setModalResponseShow(true);
            setModalResponse('successfully');
            setActiveTab(activeTab);
            handleInteractMechanic({}, 'close');
            await handleGetMechanic();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
    }

    const handleDeleteMechanic = async () => {
        const id = selectedMechanic.mechanic_id;
        try {
            await changeMechanicStatus(id);
            setModalResponseShow(true);
            setModalResponse('successfully');
            setActiveTab(activeTab);
            handleInteractMechanic({}, 'close');
            await handleGetMechanic();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
    }

    useEffect(() => {
        handleGetMechanic();
    }, [])

    function resetForm(){
        setMechanicName('');
        setNameError(false);
        setNameSuccess(false);
    }
    function handleNameInput(mechanicName){
        if(mechanicName){
            const nameExists = mechanicsList.filter((mechanic) => mechanic.mechanic_name === mechanicName);
            if(nameExists.length > 0){
                setNameError(true);
                setNameSuccess(false);
            } else {
                setNameError(false);
                setNameSuccess(true);
            }
        } else {
            setNameError(false);
            setNameSuccess(false);
        }
    }
    function archiveMechanic(){
        setModalState('archive');
        setModalConfirmShow(true);
        setFunctionKey('archive');
    }
    function deleteMechanic(){
        setModalState('delete');
        setModalConfirmShow(true);
        setFunctionKey('delete');
    }
    function restoreMechanic(){
        setModalState('restore');
        setModalConfirmShow(true);
        setFunctionKey('restore');
    }
    function handleInteractMechanic(mechanic, interact){
        switch(interact){
            case 'open':
                setSelectedMechanic(mechanic);
                setSelectedMechanicName(mechanic.mechanic_name);
                setOpenMechanicView(true);
                setAddMechanicView(false);
                setEditMechanicView(false);
                resetForm();
                break;
            case 'close':
                setSelectedMechanic({});
                setOpenMechanicView(false);
                setAddMechanicView(false);
                setEditMechanicView(false);
                resetForm();
                break;
            case 'add':
                setSelectedMechanic({});
                setOpenMechanicView(false);
                setAddMechanicView(true);
                setEditMechanicView(false);
                break;
            case 'edit-name':
                setSelectedMechanic(mechanic);
                setSelectedMechanicID(mechanic.mechanic_id);
                setSelectedMechanicName(mechanic.mechanic_name);
                setOpenMechanicView(false);
                setAddMechanicView(false);
                setEditMechanicView(true);
                break;
            default:
                setSelectedMechanic({});
                setOpenMechanicView(false);
                setAddMechanicView(false);
                setEditMechanicView(true);
                break;
        }
    }
    function functionKeyAction(){
        if(functionKey === 'delete'){
            handleDeleteMechanic();
        } else {
            handleChangeMechanicStatus();
        }
    }
    function sortList(){
        setSortMechanicsRecent(!sortMechanicsRecent);
        let sortedMechanics;
        if(sortMechanicsRecent){
            console.log('sort recent');
            sortedMechanics = mechanicsList.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        } else {
            console.log('sort oldest');
            sortedMechanics = mechanicsList.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
        }
        setRetrievedMechanicsList(sortedMechanics);
    }

    const handleSearch = (value) => {
        setSearchTerm(value);
        if(value === ""){
            setRetrievedMechanicsList(mechanicsList);
        } else {
            const searchResults = mechanicsList.filter((mechanic) => mechanic.mechanic_name.toLowerCase().includes(value.toLowerCase()));
            setRetrievedMechanicsList(searchResults);
        }
    }   

    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>
    if(errorLoad) return <ErrorLoad classStyle={"error-in-page"}/>

    return (
        <div className='mechanics p-3'>
            <PageLayout
                leftContent={
                <div className='mechanics-container'>
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
                    <div className="nav">
                        <button className='add-mechanic' onClick={() => handleInteractMechanic('', 'add')}>
                            <span className="add-pos-user-text">Add Mechanic</span>
                            <i className="fa-solid fa-circle-plus"></i> 
                        </button>
                        <div className="search-sorting">
                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                    setSearchTerm(e.target.value)
                                }}
                                placeholder='Search mechanic'
                            />
                            <div className="sort-tabs">
                                <button className='name-sort active'
                                    onClick={() => {
                                        sortList();
                                    }}
                                >
                                    {sortMechanicsRecent && ("Oldest")}
                                    {!sortMechanicsRecent && ("Latest")}
                                </button>
                            </div>
                        </div>
                        <button className='archive-mechanic' 
                            onClick={() => {
                                setActiveTab(!activeTab)
                                handleInteractMechanic({}, 'close');
                            }}
                        >
                            {activeTab ? 
                                <>
                                    <span>Archive</span>
                                    <i className="fa-solid fa-clock-rotate-left"></i> 
                                </>
                            : 
                                <>
                                    <span>Active</span>
                                    <i className="fa-solid fa-check"></i>
                                </>
                            }
                            
                        </button>
                    </div>
                    <div className="columns">
                        <p>Name</p>
                        <p>Date added</p>
                    </div>
                    <div className="list">

                        {retrievedMechanicsList.filter((mechanic) => mechanic.status === mechanicStatus)
                        .map((mechanic, index) => (
                            <div className="list-item" key={index} onClick={()=>  {
                                handleInteractMechanic(mechanic, 'open')
                            }}>
                                <div className="list-item-content">
                                    <p>{mechanic.mechanic_name}</p>
                                    <p>{moment(mechanic.date_created).format("LL")}</p>
                                </div>
                            </div>
                        ))}
                        {retrievedMechanicsList.filter((mechanic) => mechanic.status === mechanicStatus).length === 0 && (
                            <div className='empty-list'>
                                <p>No mechanics found.</p>
                            </div>
                        )}
                    </div>
                </div>
                }

                rightContent={
                <div>
                    {(!addMechanicView && !editMechanicView && !openMechanicView) && (
                        <div className="mechanic-details-container">
                            <div className="container-content">
                                <div className="main-content">
                                    <div className="number">{mechanicsList.filter((mechanic) => mechanic.status === true).length}</div>
                                    <div className="title">Active Mechanics</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {addMechanicView && (
                        <div className="mechanic-details-container">
                            <div className="nav">
                                <h4>Add Mechanic</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
                                            handleInteractMechanic({}, 'close');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Guideline for adding a mechanic:</p>
                                <ul>
                                    <li>Name must be unique.</li>
                                </ul>
                            </div>
                            <form onSubmit={handleAddMechanic}>
                                <div className='form-input'>
                                    <label>Name</label>
                                    <input type="text" value={mechanicName} name="" id="name" placeholder="Enter Mechanic Name"
                                        onChange={(e)=>{
                                            handleNameInput(e.target.value);
                                            setMechanicName(e.target.value);
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
                    )}
                    {editMechanicView && (
                        <div className="mechanic-details-container">
                            <div className="nav">
                                <h4>Edit Mechanic</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
                                            handleInteractMechanic(selectedMechanic, 'open')
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className='guide'>
                                <p>Guideline for editing a mechanic name:</p>
                                <ul>
                                    <li>Name must be unique.</li>
                                </ul>
                            </div>
                            <form onSubmit={handleEditMechanic}>
                                <div className='form-input'>
                                    <label>Name</label>
                                    <input type="text" value={selectedMechanicName} name="" id="name" placeholder="Enter Mechanic Name"
                                        onChange={(e)=>{
                                            handleNameInput(e.target.value);
                                            setSelectedMechanicName(e.target.value);
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
                    )}
                    {openMechanicView && (
                        <div className="mechanic-details-container">
                            <div className="nav">
                                <h4>{selectedMechanic.mechanic_name}</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
                                            handleInteractMechanic({}, 'close');
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <p className='updated'>{selectedMechanic.status ? 'Last updated' : 'Archived'} {moment(selectedMechanic.date_updated).format("lll")}</p>
                            {selectedMechanic.status && 
                            <div className="change" 
                                onClick={() => {
                                    handleInteractMechanic(selectedMechanic, 'edit-name');
                                }}
                            >
                                <p>Change name</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>}
                            <div className="change"
                                onClick={() => {
                                    if(selectedMechanic.status) archiveMechanic();
                                    if(!selectedMechanic.status) restoreMechanic();
                                }}
                            >
                                <p>{selectedMechanic.status ? 'Delete' : 'Restore'} this mechanic</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            {!selectedMechanic.status &&
                            <div className="change"
                                onClick={() => {
                                    deleteMechanic();
                                }}
                            >
                                <p>Delete this mechanic</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            }
                        </div>
                    )}
                </div>
                }
            />
        </div>
    );
}

export default Mechanics