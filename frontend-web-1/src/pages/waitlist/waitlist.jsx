import './waitlist.scss';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';
import arrowUp from "../../assets/icons/arrow-up.png";
import arrowDown from "../../assets/icons/arrow-down.png";
import { getWaitlistItems, deleteWaitlistItem } from '../../services/waitlistService';
import LoadingPage from '../../components/loading-page/loading-page';
import {Modal, Button} from 'react-bootstrap';
import { AuthContext } from '../../context/auth-context';
import moment from 'moment';

// Parts Form
import FrameForm from './parts-form/frame-form';
import ForkForm from './parts-form/fork-form';
import GroupsetForm from './parts-form/groupset-form';
import WheelsetForm from './parts-form/wheelset-form';
import SeatForm from './parts-form/seat-form';
import CockpitForm from './parts-form/cockpit-form';

const Waitlist = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortCriteria, setSortCriteria] = useState("date"); // Default sorting by name
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedPart, setSelectedPart] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const showMiddleSection = showFilter || showSort;
    const { userRole } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteResponseModal, setShowDeleteResponseModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);

    function DeleteModal({ onHide, onConfirm, ...props }) {
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
					<p>
						This bike part will be removed from the waitlist. You can add this back again from the Inventory.
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
							onHide();
					}}>
						Cancel
					</Button>
					<Button variant="danger" onClick={() => {
							onConfirm();
						}}>
						Remove
					</Button>
				</Modal.Footer>
			</Modal>
		);
    }

    function DeleteResponseModal(props) {
		return (
			<Modal
				{...props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Message
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Successfully removed bike part from waitlist.
					</p>
				</Modal.Body>
			</Modal>
		);
	}

    function ResponseModal(props) {
		return (
			<Modal
				{...props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Message
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Successfully set specifications. Part is added to the Bike Builder and Upgrader.
					</p>
				</Modal.Body>
			</Modal>
		);
	}

    // Fetch waitlist items when the component mounts
    const fetchItems = useCallback(async () => {
        try {
            const { data, role} = await getWaitlistItems();

            // Filter items by selected part
            const filteredItems = data.filter((item) => {
                return selectedPart ? item.bike_parts === selectedPart : true;
            });

            // Sort items by item name or date added
            const sortedItems = filteredItems.sort((a, b) => {
                let aValue, bValue;

                // Determine sorting criteria based on sortCriteria state
                if (sortCriteria === "name") {
                    aValue = a.item_name.toLowerCase(); // Normalize case for comparison
                    bValue = b.item_name.toLowerCase();
                } else if (sortCriteria === "date") {
                    aValue = new Date(a.date_created);
                    bValue = new Date(b.date_created);
                }

                // Perform comparison based on sort order
                if (sortOrder === "asc") {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });
            setItems(sortedItems);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching waitlist items:", error);
        }
    }, [selectedPart, sortCriteria, sortOrder]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Assuming items is an array of item objects
    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const refreshWaitlist = () => {
        fetchItems();
    };

    // Handle click on an item
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setRightContainerStyle("right-container");
    };

    // Handle closing the form
    const handleCloseView = () => {
        setSelectedItem(null);
        if(window.innerWidth < 900) {
            setRightContainerStyle("right-container-close");
        }
    };

    // Delete item
    const deleteItem = async (waitlist_item_id) => {
        try {
            await deleteWaitlistItem(waitlist_item_id);
            setShowDeleteModal(false);
            setShowDeleteResponseModal(true);
            handleCloseView();
            refreshWaitlist();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("An error occurred while deleting the item");
        }
    }
    const [isVisible, setIsVisible] = useState(true);
    const [waitlistContainer, setWaitlistContainer] = useState("waitlist-content");
    const [rightContainerStyle, setRightContainerStyle] = useState("right-container");

    const handleResize = () => {
        if (window.innerWidth < 900) {
            setIsVisible(false);
            setWaitlistContainer("waitlist-content");
            setRightContainerStyle("right-container-close");
        } else {
            setIsVisible(true);
            setWaitlistContainer("waitlist-content");
            setRightContainerStyle("right-container");
        }
    }

    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
    }, [isVisible]);

    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>

    return (
        <div className='waitlist p-3'>
            <ResponsivePageLayout
                rightContainer={rightContainerStyle}
                leftContent={
                    <div className={waitlistContainer}>
                        <DeleteModal
                            show={showDeleteModal}
                            onHide={() => setShowDeleteModal(false)}
                            onConfirm={() => {
                                deleteItem(selectedItem.waitlist_item_id);
                            }}
                        />
                        <DeleteResponseModal
                            show={showDeleteResponseModal}
                            onHide={() => setShowDeleteResponseModal(false)}
                        />
                        <ResponseModal
                            show={showResponseModal}
                            onHide={() => setShowResponseModal(false)}
                        />
                        <div className='upper-container d-flex'>
                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={"Search waitlisted bike parts"}
                            />

                            {/* Toggle filter visibility */}
                            <button className="filter" onClick={() => setShowFilter(!showFilter)}>
                                <img src={filter} alt="Filter" className="button-icon" />
                            </button>

                            {/* Toggle sort visibility */}
                            <button className="sort" onClick={() => setShowSort(!showSort)}>
                                <img src={sort} alt="Sort" className="button-icon" />
                            </button>
                        </div>

                        {showMiddleSection && (
                            <div className="middle-container">
                                <div className="middle-content">

                                    {/* Conditional rendering for Filter section */}
                                    {showFilter && (
                                        <div className='filter'>
                                            <div className="title">
                                                <img src={filter} alt="Filter" className="icon me-2" />
                                                Filter by:
                                            </div>

                                            <select
                                                className="dropdown"
                                                onChange={(e) => setSelectedPart(e.target.value)}
                                                value={selectedPart}
                                            >
                                                <option value="">Bike Parts</option>
                                                {["Frame", "Fork", "Groupset", "Wheelset", "Seat", "Cockpit"].map((parts) => (
                                                        <option key={parts} value={parts}>{parts}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Conditional rendering for Sort section */}
                                    {showSort && (
                                        <div className='sort'>
                                            <div className="title">
                                                <img src={sort} alt="Sort" className="icon me-2" />
                                                Sort by:
                                            </div>

                                            <select
                                                className="dropdown"
                                                value={sortCriteria}
                                                onChange={(e) => setSortCriteria(e.target.value)}
                                            >
                                                <option value="name">Item Name</option>
                                                <option value="date">Date Added</option>
                                            </select>

                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                                    fetchItems();
                                                }}
                                            >
                                                {sortOrder === "asc" ? (
                                                    <img src={arrowDown} alt="Sort Descending" />
                                                ) : (
                                                    <img src={arrowUp} alt="Sort Ascending" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='lower-container'>
                            <div className="item-container-title d-flex">
                                <div className="item-name">
                                    Item Name
                                </div>

                                <div className="bike-part">
                                    Bike Part
                                </div>

                                <div className="date">
                                    Date Added
                                </div>

                                <div className="time">
                                    Time Added
                                </div>
                            </div>
                            <div className='lower-content'>

                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <div
                                            key={item.waitlist_item_id}
                                            className="item-container d-flex"
                                            onClick={() => handleItemClick(item)} // Add click handler
                                        >
                                            <div className="item-name fw-bold">
                                                {item.item_name}
                                            </div>

                                            <div className="bike-part">
                                                {item.bike_parts}
                                            </div>

                                            <div className="date">
                                                {moment.tz(item.date_created, "Asia/Manila").format('L')}
                                            </div>

                                            <div className="time">
                                                {moment.tz(item.date_created, "Asia/Manila").format('LT')}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='no-item'>
                                        <p>No items in the waitlist</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                rightContent={
                    selectedItem ? (
                        <div className="form-container">

                            {selectedItem.bike_parts === 'Frame' && (
                                <FrameForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                    deleteItem={deleteItem}
                                    role={userRole}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setShowResponseModal={setShowResponseModal}
                                />
                            )}

                            {selectedItem.bike_parts === 'Fork' && (
                                <ForkForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                    deleteItem={deleteItem}
                                    role={userRole}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setShowResponseModal={setShowResponseModal}
                                />
                            )}

                            {selectedItem.bike_parts === 'Groupset' && (
                                <GroupsetForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                    deleteItem={deleteItem}
                                    role={userRole}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setShowResponseModal={setShowResponseModal}
                                />
                            )}

                            {selectedItem.bike_parts === 'Wheelset' && (
                                <WheelsetForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                    deleteItem={deleteItem}
                                    role={userRole}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setShowResponseModal={setShowResponseModal}
                                />
                            )}

                            {selectedItem.bike_parts === 'Seat' && (
                                <SeatForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                    deleteItem={deleteItem}
                                    role={userRole}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setShowResponseModal={setShowResponseModal}
                                />
                            )}

                            {selectedItem.bike_parts === 'Cockpit' && (
                                <CockpitForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                    deleteItem={deleteItem}
                                    role={userRole}
                                    setShowDeleteModal={setShowDeleteModal}
                                    setShowResponseModal={setShowResponseModal}
                                />
                            )}

                        </div>
                    ) : (
                        <div className="no-selection">
                            <h4>Waitlist</h4>
                            <p>
                                Select a waitlisted bike part to set specifications.
                            </p>
                        </div>
                    )
                }
            />
        </div >
    );
};

export default Waitlist;