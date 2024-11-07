import './expenses.scss'
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import { useEffect, useState, forwardRef, useRef } from 'react';
import moment from 'moment';
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addExpense, getExpenses, editExpense, getExpensesDates, archiveExpense } from '../../services/expenseService';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { base64ToFile } from "../../utility/imageUtils";
import LoadingPage from '../../components/loading-page/loading-page';

const Expenses = () => {
	// SOME STUFF
	const [modalShow, setModalShow] = useState(false);
	const [modalConfirmShow, setModalConfirmShow] = useState(false);
	const [modalResponseShow, setModalResponseShow] = useState(false);
    const [loading, setLoading] = useState(true);

	const [error, setError] = useState(null);
	const todayDate = new Date();
	const [isVisible, setIsVisible] = useState(true);

	// EXPENSES
	const [allExpenses, setAllExpenses] = useState([]);
	const [totalExpenses, setTotalExpenses] = useState(0);

	// ABOUT EXPENSE
	const expenseNameOptions = [
		"Food",
		"Water",
		"Others",
	]
	const [expenseName, setExpenseName] = useState(expenseNameOptions[0]);
	const [expenseAmount, setExpenseAmount] = useState(1);
	const [expenseImage, setExpenseImage] = useState(null);
	const [expensePreviewImage, setExpensePreviewImage] = useState(null);
	const maxImageSizeMB = 5;
	const maxImageSize = maxImageSizeMB * 1024 * 1024;
	const [othersExpense, setOthersExpense] = useState(false);
	const [othersExpenseName, setOthersExpenseName] = useState('');

	// FOR EDITING EXPENSE
	const [editExpenseID, setEditExpenseID] = useState('');
	const [editExpenseName, setEditExpenseName] = useState('');
	const [editExpenseAmount, setEditExpenseAmount] = useState('');
	const [editExpenseDateTime, setEditExpenseDateTime] = useState('');
	const [editExpenseImage, setEditExpenseImage] = useState(null);
	const [editExpensePreviewImage, setEditExpensePreviewImage] = useState(null);

	// VIEWS
	const [addExpenseView, setAddExpenseView] = useState(false);
	const [openExpenseView, setOpenExpenseView] = useState(false);
	const [editExpenseView, setEditExpenseView] = useState(false);

	// DATE FOR REACT-DATEPICKER
	const [startDate, setStartDate] = useState(moment(todayDate).format("YYYY-MM-DD"));
	const [expensesDates, setExpensesDates] = useState([]);

	// FOR MODAL CONTENT
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [functionKey, setFunctionKey] = useState(null);
	const [modalResponse, setModalResponse] = useState("");

	// FORMAT SHIT TO PHILIPPINE PESO
    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

	// FOR MOBILE RESPONSIVENESS
	const [expensesContainerStyle, setExpensesContainerStyle] = useState("expenses-container");
	const [rightContainerStyle, setRightContainerStyle] = useState("right-container");
	const imageInputRef = useRef(null);
	const DisabledDateInput = forwardRef(
		({ value, onClick, className }, ref) => (
		<h4 className={className} onClick={onClick} ref={ref}>
			{value}
		</h4>
		)
	);

	const handleResize = () => {
		if (window.innerWidth <= 900) {
			setRightContainerStyle("right-container-close");
			setExpensesContainerStyle("expenses-container");
			setIsVisible(true);
		} else {
			setRightContainerStyle("right-container");
			setExpensesContainerStyle("expenses-container");
			setIsVisible(true);
		}
	}
	function openExpenseFormView(){
		if(window.innerWidth <= 900){
			setRightContainerStyle("right-container");
			setExpensesContainerStyle("expenses-container-close");
		}
	}
	function closeExpenseFormView(){
		if(window.innerWidth <= 900){
			setRightContainerStyle("right-container-close");
			setExpensesContainerStyle("expenses-container");
		}
		clearForm();
	}

	// IMAGE CHANGE HANDLERS

	function imageUpload(){
		imageInputRef.current.click();
	}
	function handleImageChange(e) {
		const image = e.target.files[0]
		
		if(image){
			console.log(image)
			if(!image.type.startsWith("image/")) {
				e.target.value = "";
				setError("Please upload an image file.");
				return;
			}
			
			if(image.type === "image/gif"){
				e.target.value = "";
				setError("Please upload an image in JPEG and PNG formats only.");
				return;
			}

			if(image.size > maxImageSize) {
				e.target.value = "";
				setError(`Image size exceeds ${maxImageSizeMB}MB`);
				return;
			}
			if(!editExpenseView){
				setExpenseImage(image)
				setExpensePreviewImage(URL.createObjectURL(image))
			} else {
				setEditExpenseImage(image)
				setEditExpensePreviewImage(URL.createObjectURL(image))
			}
			setError(null);
		}
	}
	function removeImage(){
		setExpenseImage(null);
		setEditExpenseImage(null);
		imageInputRef.current.value = null;
	}
	function MyVerticallyCenteredModal(props) {
		return (
			<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Attached proof
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='img-preview'>
						{expensePreviewImage && !openExpenseView && !editExpenseView && <img src={expensePreviewImage} alt=""/>}
						{openExpenseView && !editExpenseView && <img src={editExpensePreviewImage} alt=""/>}
						{editExpenseView && !openExpenseView && <img src={editExpensePreviewImage} alt=""/>}
					</div>
				</Modal.Body>
			</Modal>
		);
	}
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
						Success
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Expense entry {modalResponse}!
					</p>
				</Modal.Body>
			</Modal>
		);
	}
	function MyVerticallyCenteredModalConfirmation({ modalTitle, modalContent, onHide, onConfirm, ...props }) {
		return (
			<Modal
				{...props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton onClick={onHide}>
					<Modal.Title id="contained-modal-title-vcenter">
						{modalTitle} {/* Dynamic title */}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						{modalContent} {/* Dynamic content */}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
							onHide();
							if(functionKey === "del") onConfirm();
					}}>
						{functionKey === "edit" ? "Close" : "Save changes"}
					</Button>
					<Button variant="primary" onClick={() => {
							onHide();
							if(functionKey === "edit") onConfirm();
						}}>
						{functionKey === "edit" ? "Save changes" : "Close"}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
	function openAddExpense(){
        setExpenseName(expenseNameOptions[0]);
		setAddExpenseView(true);
		setOpenExpenseView(false);
		setEditExpenseView(false);
		openExpenseFormView();
		setOthersExpenseName('');
		setOthersExpense(false);
	}
	function openExpenseEntry(){
		setOpenExpenseView(true);
		setAddExpenseView(false);
		setEditExpenseView(false);
		openExpenseFormView();
	}
	function clearForm(){
		setAddExpenseView(false);
		setExpenseName(expenseNameOptions[0]);
		setExpenseAmount(1);
		setExpensePreviewImage(null);
		setOthersExpenseName('');
		setOthersExpense(false);
	}
	function restartExpenseForm(){
		setOpenExpenseView(false);
		setAddExpenseView(false);
		setEditExpenseView(false);
	}

	const getTotalExpense = (allExpenses) => {
		const total = allExpenses.reduce((acc, expense) => 
			acc + expense.expense_amount, 0
		) 
		setTotalExpenses(total);
	}
	const handleGetExpenseDates = async () => {
		try {
			const { dates } = await getExpensesDates();
			const formattedDates = dates.map((date, index) => 
				moment(date.date_updated).toDate()
			)
			setExpensesDates(formattedDates);
            setTimeout(() => {
              setLoading(false);
            }, 500);
		} catch (error) {
			console.error("Error getting expenses", error);
            setLoading(true);
		}
	}
	const handleGetExpenses = async (startDate) => {
		try{
			const { expenses } = await getExpenses(startDate);
			setAllExpenses(expenses);
			console.log(expenses);
		}catch (error){
			console.error("Error getting expenses", error);
		}	
	}
	const handleGetExpenseEntry = async (expense) => {
		console.log(expense);

		const fileExtension = expense.expense_image && expense.expense_image.startsWith("data:image/png")
            ? "png"
            : "jpg"; // Default to jpg if it's not a png
		
		const imageBase64 = `data:image/${fileExtension};base64,${expense.expense_image}`;

		const imageFile = base64ToFile(imageBase64, `image.${fileExtension}`);

		setEditExpenseID(expense.expense_id);
		setEditExpenseName(expense.expense_name);
		if(expense.expense_name.includes('Others')){
			setOthersExpense(true);
			setOthersExpenseName(expense.expense_name.substring(9));
		} else {
			setOthersExpense(false);
		}
		setEditExpenseAmount(expense.expense_amount);
		setEditExpenseDateTime(expense.date_updated);
		setEditExpenseImage(imageFile);
		setEditExpensePreviewImage(imageBase64);
		openExpenseEntry();
	}
	const handleAddExpense = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		if(othersExpense) {
			formData.append("name", 'Others - ' + othersExpenseName);
		} else {
			formData.append("name", expenseName);
		}
		formData.append("amount", expenseAmount);
		formData.append("date", startDate);
		if(expenseImage) formData.append("image", expenseImage);
		
		// Log the form data values
		console.log("Expense Name:", formData.get("name"));
		console.log("Expense Amount:", formData.get("amount"));
		console.log("Expense Image:", formData.get("image"));

		try{
			await addExpense(formData);
			setModalResponse('added');
			setModalResponseShow(true);
			clearForm();
			closeExpenseFormView();
			restartExpenseForm();
			await handleGetExpenses(startDate);
		}catch (error){
			console.error("Error adding expense", error);
			alert("An error occurred while adding the expense");
		}
		console.log(formData);
	}
	const handleEditExpense = async () => {

		const formData = new FormData();
		formData.append("id", editExpenseID);
		if(othersExpense) {
			console.log('others');
			formData.append("name", 'Others - ' + othersExpenseName);
		} else {
			formData.append("name", editExpenseName);
		}
		formData.append("amount", editExpenseAmount);
		if(editExpenseImage) formData.append("image", editExpenseImage);
		
		// Log the form data values
		console.log("Expense ID:", editExpenseID);
		console.log("Expense Name:", formData.get("name"));
		console.log("Expense Amount:", formData.get("amount"));
		console.log("Expense Image:", formData.get("image"));

		try{
			await editExpense(editExpenseID, formData);
			setModalResponse('edited');
			setModalResponseShow(true);
			clearForm();
			closeExpenseFormView();
			restartExpenseForm();
			await handleGetExpenses(startDate);
		}catch (error){
			console.error("Error adding expense", error);
			alert("An error occurred while adding the expense");
		}

		console.log(formData);
	}
	const handleArchiveExpense = async () => {
		try {
			await archiveExpense(editExpenseID, startDate);
			setModalResponse('deleted');
			setModalResponseShow(true);
			closeExpenseFormView();
			restartExpenseForm();
			await handleGetExpenses(startDate);
		} catch (error) {
			console.error("Error archiving expense", error);
			alert("An error occurred while archiving the expense");
		}
	}
	const functionKeyAction = () => {
		console.log("Action confirmed!");
		if(functionKey === 'edit'){
			handleEditExpense();
		} else if (functionKey === 'del'){
			handleArchiveExpense();
		}
	};
	useEffect(() => {
		console.log("Others Expense Name: ", othersExpenseName);
	}, [othersExpenseName]);

	useEffect(() => {
		handleGetExpenses(startDate);
		handleGetExpenseDates();
	}, [startDate]);

	useEffect(() => {
		getTotalExpense(allExpenses);
	}, [allExpenses])

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
	}, [isVisible]);

    // DISPLAY LOADING
    if(loading) return <LoadingPage classStyle="loading-in-page"/>

	return (
		<div className='expenses p-3'>
			<ResponsivePageLayout
				rightContainer={rightContainerStyle}
				leftContent={
				<div className={expensesContainerStyle}>
					<MyVerticallyCenteredModal
						show={modalShow}
						onHide={() => setModalShow(false)}
						
					/>
					<MyVerticallyCenteredModalConfirmation
						show={modalConfirmShow}
						onHide={() => setModalConfirmShow(false)}
						modalTitle={title}
                		modalContent={content} 
						onConfirm={functionKeyAction}
					/>
					<MyVerticallyCenteredModalResponse
						show={modalResponseShow}
						onHide={() => setModalResponseShow(false)}
					/>
					<div className='nav'>
						<DatePicker
						selected={startDate}
						onChange={(date) => {
							setStartDate(moment(date).format("YYYY-MM-DD"));
							handleGetExpenses(moment(date).format("YYYY-MM-DD"));
							restartExpenseForm();
						}}
						dateFormat="MMMM d, yyyy"
						maxDate={new Date()}
						isClearable={false}
						todayButton="Today"
						scrollableYearDropdown={true}
						highlightDates={expensesDates}
						customInput={<DisabledDateInput className="date-picker" />}
						/>
						{startDate === moment(todayDate).format("YYYY-MM-DD") && (
							<button 
								className="add-expense"
								onClick={() => openAddExpense()}
							>
								Add Expense
							</button>
						)} 
					</div>        
					<h5>You {startDate === moment(todayDate).format("YYYY-MM-DD") ? "have" : "had"} spent {PesoFormat.format(totalExpenses)} {startDate === moment(todayDate).format("YYYY-MM-DD") ? "today." : "on this day."}</h5>
					<div className="list">
						{allExpenses.length === 0 && (
							<div className="empty-list">
								<p>No expenses entries made.</p>
							</div>
						)}
						{allExpenses.map((expense, index) => (
							<div key={index} className="list-item" onClick={() => {
									handleGetExpenseEntry(expense)
								}}>
								<div className="list-item-content">
									<h6>{expense.expense_name}</h6>
									<div className="list-item-info">
										<p className='time'>{moment(expense.date_updated).format("LT")}</p>
										<p className='cost'>{PesoFormat.format(expense.expense_amount)}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				}

				rightContent={
				<div className='expense-container'>
					{(!addExpenseView && !openExpenseView && !editExpenseView) && (
						<div className="expense-details-container">
							<div className='nav'>
								<h4>Expense Details</h4>
							</div>
							<div className='empty-list'>
								{startDate === moment(todayDate).format("YYYY-MM-DD") ? (
									<p>Create an expense by clicking the Add Expense button.</p>
								) : (
									<p>Click an expense entry to view details.</p>
								)}
							</div>
						</div>
					)}
					{editExpenseView && (
						<div className='expense-details-container'>
							<div className='nav'>
								<h4>Edit Expense</h4>
								<div className='edit-nav'>
									<i className="fa-regular fa-trash-can"
										onClick={() => {
											setModalConfirmShow(true)
											setTitle("Confirmation")
											setContent(
												<>
													The owner can still see deleted expense entries.
													<br />
													Are you sure you want to delete this expense?
												</>
											)
											setFunctionKey('del')
										}}
									>
									</i>
									<i className="fa-solid fa-xmark"
										onClick={() => {
											restartExpenseForm();
											closeExpenseFormView();
										}}
									>
									</i>
								</div>
							</div>
							<form>
								<div className='form-input'>
									<div className='select-nav'>
										<label>Tag</label>
									</div>
									<div className='radio-buttons'>
									{!editExpenseView && <p className='expense-name'>{editExpenseName}</p>}
									{editExpenseView && expenseNameOptions.map((option, index) => 
										<p 
										key={index}
										className={
											editExpenseName === option || editExpenseName.substring(0,6) === option ? 'selected' : ''
										}
										onClick={() => {
											console.log(option);
											setEditExpenseName(option);
											if(option === 'Others') {
												setOthersExpense(true);
											} else { 
												setOthersExpense(false);
											}
										}}>{option}</p>
									)}
									</div>
								</div>
								{editExpenseName.includes('Others') && 
								<div className='form-input'>
									<div className='select-nav'>
										<label>Expense Name</label>
									</div>
									<input 
										type='text'
										placeholder='Enter expense name'
										value={othersExpenseName}
										onChange={(e) => {
											setOthersExpenseName(e.target.value);
											console.log(e.target.value);
										}}
									/>
									{othersExpenseName === '' && (
										<p className='error'>Expense name cannot be empty for Others tag.</p>
									)}
								</div>}
								<div className='form-input'>
									<label>Amount</label>
									<NumericFormat
										disabled={editExpenseView ? false : true}
										thousandSeparator={true}
										decimalScale={2}
										fixedDecimalScale={true}
										prefix={"₱"}
										allowNegative={false}
										value={editExpenseAmount}
										onValueChange={(values) => {
											const { formattedValue, value } = values;
											console.log(formattedValue);
											setEditExpenseAmount(Number(value))
										}}
									/>
									{editExpenseAmount === 0 && (
										<p className='error'>Amount cannot be zero!</p>
									)}
								</div>
								<div className='form-input'>
									<label>Attach proof</label>                            
									<input 
										type="file" 
										accept='image/*' 
										onChange={handleImageChange}
										ref={imageInputRef}
										style={{display: 'none'}}
									/>
									{!editExpenseImage && 
										<div onClick={imageUpload} className='upload-image'>
											<i className="fa-regular fa-image"></i>
											<p className='title'>Upload image</p>
											<p className='subtitle'>JPEG and PNG formats, up to 5MB</p>
										</div>
									}
									{editExpenseImage && 
										<div className='img-preview'>
											<img src={editExpensePreviewImage} alt="" onClick={() => setModalShow(true)}/>
											{editExpenseView && <button className="remove-img" onClick={removeImage}>Remove image</button>}
										</div>
									}
									{error && <p className='error'>{error}</p>}
								</div>
								{(editExpenseAmount > 0 && editExpenseImage !== null && (!othersExpense || (othersExpense && othersExpenseName !== ''))) && (
									<button type='button' className='submit-btn'
										onClick={() => {
											setModalConfirmShow(true)
											setTitle("Confirmation")
											setContent("Are you sure you want to save edits of this expense?")
											setFunctionKey('edit')
										}}
									>
										Save Expense
									</button>
								)} 
							</form>
						</div>  
					)}
					{openExpenseView && (
						<div className='expense-details-container'>
							<div className='nav'>
								<h4>View Expense</h4>
								<div className='edit-nav'>
									{startDate === moment(todayDate).format("YYYY-MM-DD") && (
										<i className="fa-regular fa-pen-to-square"
											onClick={() => {
												setEditExpenseView(true);
												setOpenExpenseView(false);
											}}
										>
										</i>
									)}
									<i className="fa-solid fa-xmark"
										onClick={() => {
											restartExpenseForm();
											closeExpenseFormView();
										}}
									>
									</i>
								</div>
							</div>
							<form>
								<div className='form-input'>
									<div className='select-nav'>
										<label>Tag</label>
									</div>
									<div className='radio-buttons'>
										<p className='expense-name'>{editExpenseName}</p>
									</div>
								</div>
								<div className='form-input'>
									<label>Amount</label>
									<NumericFormat
										disabled={true}
										thousandSeparator={true}
										decimalScale={2}
										fixedDecimalScale={true}
										prefix={"₱"}
										allowNegative={false}
										value={editExpenseAmount}
									/>
								</div>
								<div className='form-input'>
									<label>Attached proof</label>                            
									<div className='img-preview'>
										<img src={editExpensePreviewImage} alt="" onClick={() => setModalShow(true)}/>
									</div>
								</div>
								<div className="form-input">
									<p>Submitted: {moment(editExpenseDateTime).format("lll")}</p>
								</div>
							</form>
						</div>  
					)}
					{addExpenseView && (
						<div className='expense-details-container'>
							<div className='nav'>
								<h4>Add Expense</h4>
								<i className="fa-solid fa-xmark"
									onClick={() => {
										setAddExpenseView(false);
										closeExpenseFormView();
									}}
								>
								</i>
							</div>
							<form onSubmit={handleAddExpense}>
								<div className='form-input'>
									<div className='select-nav'>
										<label>Tag</label>
									</div>
									<div className='radio-buttons'>
									{expenseNameOptions.map((option, index) => 
											<p 
											key={index}
											className={expenseName === option ? 'selected' : ''}
											onClick={() => {
												console.log(option);
												setExpenseName(option);
												if(option === 'Others') {
													setOthersExpense(true);
												} else { 
													setOthersExpense(false);
												}
											}}>{option}</p>
										)}
									</div>
								</div>
								{expenseName === 'Others' && 
								<div className='form-input'>
									<div className='select-nav'>
										<label>Expense Name</label>
									</div>
									<input 
										type='text'
										placeholder='Enter expense name'
										value={othersExpenseName}
										onChange={(e) => {
											setOthersExpenseName(e.target.value);
										}}
									/>
									{othersExpenseName === '' && (
										<p className='error'>Expense name cannot be empty for Others tag.</p>
									)}
								</div>}
								<div className='form-input'>
									<label>Amount</label>
									<NumericFormat
										thousandSeparator={true}
										decimalScale={2}
										fixedDecimalScale={true}
										prefix={"₱"}
										allowNegative={false}
										value={expenseAmount}
										onValueChange={(values) => {
											const { formattedValue, value } = values;
											console.log(formattedValue);
											setExpenseAmount(Number(value))
										}}
									/>
									{expenseAmount === 0 && (
										<p className='error'>Amount cannot be zero!</p>
									)}
								</div>
								<div className='form-input'>
									<label>Attach proof</label>                            
									<input 
										type="file" 
										accept='image/*' 
										onChange={handleImageChange}
										ref={imageInputRef}
										style={{display: 'none'}}
									/>
									{!expenseImage && 
										<div onClick={imageUpload} className='upload-image'>
											<i className="fa-regular fa-image"></i>
											<p className='title'>Upload image</p>
											<p className='subtitle'>JPEG and PNG formats, up to 5MB</p>
										</div>
									}
									{expenseImage && 
										<div className='img-preview'>
											<img src={expensePreviewImage} alt="" onClick={() => setModalShow(true)}/>
											<button className="remove-img" onClick={removeImage}>Remove image</button>
										</div>
									}
									{error && <p className='error'>{error}</p>}
								</div>
								{(expenseAmount > 0 && expenseImage !== null && (!othersExpense || (othersExpense && othersExpenseName !== ''))) && (
									<button type='submit' className='submit-btn'>Add Expense</button>
								)} 
							</form>
						</div>   
					)}
				</div>
				}
			/>
		</div>
	);
};

export default Expenses;