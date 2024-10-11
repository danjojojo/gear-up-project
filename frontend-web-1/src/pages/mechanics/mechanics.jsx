import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/page-layout/page-layout'
import './mechanics.scss'
import { getMechanics, addMechanic } from '../../services/mechanicsService'
import moment from 'moment';
import {Modal} from 'react-bootstrap';

const Mechanics = () => {

    const [mechanicsList, setMechanicsList] = useState([]);

    const [addMechanicView, setAddMechanicView] = useState(false);

    const [mechanicName, setMechanicName] = useState('');

    const [nameError, setNameError] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);

    const [modalState, setModalState] = useState('');
    const [modalResponse, setModalResponse] = useState('');
    const [modalResponseShow, setModalResponseShow] = useState(false);

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
						Added {mechanicName} as a POS User {modalResponse}!
					</p>
                    }
					{modalState === 'edit-name' && 
                    <p>
						Name changed {modalResponse}!
					</p>
                    }
				</Modal.Body>
			</Modal>
		);
	}

    const handleGetMechanic = async () => {
        try {
            const { mechanics } = await getMechanics();
            setMechanicsList(mechanics);
            console.log(mechanics);
        } 
        catch (error) {
            console.error('Error getting mechanics', error);
        }
    }

    const handleAddMechanic = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', mechanicName);
        try {
            await addMechanic(formData);
            setModalResponseShow(true);
            setModalResponse('successfully');
            setMechanicName('');
            await handleGetMechanic();
        } catch (error) {
            setModalResponseShow(true);
            setModalResponse('failed');
        }
    }

    useEffect(() => {
        handleGetMechanic();
    }, [])
    
    function openForm(value){
        switch(value){
            case 'add':
                setAddMechanicView(true);
                break;
            default:
                break;
        }
    }

    function closeForm(){
        setAddMechanicView(false);
    }

    function handleNameInput(mechanicName){
        setMechanicName(mechanicName);
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

    return (
        <div className='mechanics p-3'>
            <PageLayout
                leftContent={
                <div className='mechanics-container'>
                    <div className="nav">
                        <button className='add-mechanic' onClick={() => openForm('add')}>
                            Add Mechanic +
                        </button>
                        <div className="search-sorting">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search for mechanic here"
                                />
                            </div>
                            <div className="sort-tabs">
                                <button className='name-sort'>
                                    Name
                                </button>
                                <button className='add-sort'>
                                    Date
                                </button>
                            </div>
                        </div>
                        <button className='archive-mechanic'>
                            Archived
                        </button>
                    </div>
                    <div className="columns">
                        <p>Name</p>
                        <p>Date created</p>
                    </div>
                    <div className="list">
                        {mechanicsList.map((mechanic, index) => (
                            <div className="list-item" key={index}>
                                <div className="list-item-content">
                                    <p>{mechanic.mechanic_name}</p>
                                    <p>{moment(mechanic.date_created).format("LL")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                }

                rightContent={
                <div>
                    {addMechanicView && (
                        <div className="mechanic-details-container">
                            <div className="nav">
                                <h4>Add Mechanic</h4>
                                <div className='edit-nav'>
                                    <i className="fa-solid fa-xmark"
                                        onClick={() => {
                                            closeForm();
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
                </div>
                }
            />
        </div>
    );
}

export default Mechanics