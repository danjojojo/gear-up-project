import "./point-of-sales.scss";
import ResponsivePageLayout from "../../components/responsive-page-layout/responsive-page-layout";
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { getAllItems, getAllMechanics, confirmSale } from "../../services/posService";
import LoadingPage from "../../components/loading-page/loading-page";
import SearchBar from "../../components/search-bar/search-bar";

const PointOfSales = () => {
  const [error, setError] = useState(null)

  // ITEMS (CHECKOUT), ALLITEMS AND RETRIEVEDITEMS (POS)
  const [items, setItemsList] = useState([]);
  const [allItems, setAllItemsList] = useState([]);
  const [retrievedItems, setRetrievedItemsList] = useState([]);
  
  // MECHANICS (CHECKOUT), ALLMECHANICS AND RETRIEVEDMECHANICS (POS)
  const [mechanics, setMechanicsList] = useState([]);
  const [allMechanics, setAllMechanicsList] = useState([]);
  const [retrievedMechanics, setRetrievedMechanicsList] = useState([]);

  // MECHANIC SELECTED OBJECT
  const [mechanicSelected, setMechanicSelected] = useState({});
  
  // TOTAL PRICE, TOTAL ITEM PRICE, TOTAL MECHANIC PRICE, CHANGE, AMOUNT RECEIVED
  const [totalPrice, setTotalPrice] = useState("");
  const [totalItemPrice, setTotalItemPrice] = useState("");
  const [totalMechanicPrice, setTotalMechanicPrice] = useState("");

  // CHANGE AND AMOUNT RECEIVED
  const [change, setChange] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  
  // TOTAL ITEMS, MECHANICS, AND CHECKOUT QTY
  const [totalItemsQty, setTotalItemsQty] = useState("");
  const [totalMechanicsQty, setTotalMechanicsQty] = useState("");
  const [totalCheckoutQty, setTotalCheckoutQty] = useState(0);

  // FOR NAVIGATION 
  const [tab, setTab] = useState("items");

  // VIEWS FOR RIGHT CONTENT
  const [checkOutListView, setCheckOutListView] = useState("items");
  const [mechanicAdded, setMechanicAdded] = useState(false);
  const [reviewOrderView, setReviewOrderView] = useState(false);
  const [chargeView, setChargeView] = useState(false);
  const [receiptView, setReceiptView] = useState(false);

  // RECEIPT STATUS IF SUCCESS OR FAILED
  const [receiptStatus, setReceiptStatus] = useState("");

  // SOME STUFF
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // FOR SORTING
  const [itemSort, setItemSort] = useState("stock_count");
  const [mechanicSort, setMechanicSort] = useState("name");

  // FOR SEARCHING
  const [searchItem, setSearchItem] = useState("");
  const [searchMechanic, setSearchMechanic] = useState("");

  // FOR SORTING BUTTONS
  const [sortStockCountDESCClicked, setSortStockCountDESCClicked] = useState(false);
  const [sortItemNameDESCClicked, setsortItemNameDESCClicked] = useState(false);
  const [sortMechanicNameDESCClicked, setSortMechanicNameDESCClicked] = useState(false);

  // MOBILE RESPONSIVENESS
  const [checkOutContainer, setCheckOutContainer] = useState("checkout-container");
  const [posContainer, setPosContainer] = useState("pos-container");
  const [rightContainerStyle, setRightContainerStyle] = useState("right-container");
  const [isVisible, setIsVisible] = useState(true);

  // FORMAT NUMBER TO PESO
  const PesoFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  });

  // LOADING STATE
  const [loading, setLoading] = useState(true);

  // ACTIVE BUTTON STATE
  const [activeButton, setActiveButton] = useState(null);

  // POS AND CHECKOUT INTERACTIONS
  function addItem(newItem) {
    if (!reviewOrderView) {
      setCheckOutListView("items");
      // if new item is in the items list
      const existingItemInList = items.find(
        (item) => item.name === newItem.name
      );

      const existingRetrievedItemInList = retrievedItems.find(
        (retrievedItem) => retrievedItem.item_name === newItem.name
      );

      if (existingItemInList && existingRetrievedItemInList) {
        const updatedItems = items.map((item) =>
          item.name === newItem.name
            ? { ...item, qty: item.qty + newItem.qty } // Update qty if item exists
            : item
        );

        const updatedRetrievedItems = retrievedItems.map((retrievedItem) =>
          retrievedItem.item_name === newItem.name
            ? {
                ...retrievedItem,
                stock_count: retrievedItem.stock_count - newItem.qty,
              } // Update qty if item exists
            : retrievedItem
        );

        setItemsList(updatedItems);
        setRetrievedItemsList(updatedRetrievedItems);
      } else {
        const newItemList = [...items, newItem];

        const updatedRetrievedItems = retrievedItems.map((retrievedItem) =>
          retrievedItem.item_name === newItem.name
            ? {
                ...retrievedItem,
                stock_count: retrievedItem.stock_count - newItem.qty,
              } // Update qty if item exists
            : retrievedItem
        );

        setItemsList(newItemList);
        setRetrievedItemsList(updatedRetrievedItems);
      }
      setMechanicAdded(false);
    }
  }
  function deleteItem(index) {
    const newItemList = items.filter((item, itemIndex) => {
      return itemIndex !== index;
    });
    setItemsList(newItemList);
  }
  function updateItemQty(existingItem, value) {
    const updatedItems = items.map((item) => {
      if (item.name === existingItem.name) {
        const newQty = Math.max(1, item.qty + value); // Prevent negative qty
        const newTotalPrice = newQty * item.price;
        return { ...item, qty: newQty };
      }
      return item;
    });

    const updatedRetrievedItems = retrievedItems.map((retrievedItem) => {
      if (retrievedItem.item_name === existingItem.name) {
        if(retrievedItem.stock_count >= 0){
          const newQty = Math.max(
            0,
            retrievedItem.stock_count - value
          ); // Prevent negative qty
          return { ...retrievedItem, stock_count: newQty };
        }
      }
      return retrievedItem;
    });
    setItemsList(updatedItems);
    setRetrievedItemsList(updatedRetrievedItems);
  }
  function removeItem(existingItem) {
    const updatedRetrievedItems = retrievedItems.map((retrievedItem) => {
      if (retrievedItem.item_name === existingItem.name) {
        const newQty = retrievedItem.stock_count + existingItem.qty
       // Prevent negative qty
        return { ...retrievedItem, stock_count: newQty };
      }
      return retrievedItem;
    });
    setRetrievedItemsList(updatedRetrievedItems);
  }
  function addMechanic(newMechanic) {
    if (!reviewOrderView) {
      const existingMechanicInList = mechanics.find(
        (mechanic) => mechanic.name === newMechanic.name
      );

      if (existingMechanicInList) {
        const updatedMechanics = mechanics.map((mechanic) =>
          mechanic.name === newMechanic.name
            ? newMechanic.edit === "yes"
              ? { ...mechanic, price: Number(newMechanic.price) }
              : {
                  ...mechanic,
                  price: Number(mechanic.price) + Number(newMechanic.price),
                }
            : mechanic
        );
        setMechanicsList(updatedMechanics);
      } else {
        const newMechanicsList = [...mechanics, newMechanic]; // Ensure the new mechanic price is a number
        setMechanicsList(newMechanicsList);
      }
      setCheckOutListView("mechanics");
      setMechanicAdded(false);
    }
  }
  function selectMechanic() {
    if (!reviewOrderView) setMechanicAdded(true);
  }
  function deleteMechanic(index) {
    const newMechanicsList = mechanics.filter((mechanic, mechanicIndex) => {
      return mechanicIndex !== index;
    });
    setMechanicsList(newMechanicsList);
  }

  // FOR CHECKOUT AND REVIEW ORDER
  function getTotalPrice(items, mechanics) {
    // Calculate the total directly
    const totalItemsPrice = items.reduce(
      (acc, item) => acc + Number(item.price) * item.qty, 0
    );

    const totalMechanicsPrice = mechanics.reduce(
      (acc, mechanic) => acc + Number(mechanic.price), 0
    );
    setTotalPrice(totalItemsPrice + totalMechanicsPrice);
    setTotalItemPrice(totalItemsPrice);
    setTotalMechanicPrice(totalMechanicsPrice); // Set the total price in state
  }
  function getTotalQty(items, mechanics) {
    // Calculate the total directly
    const totalItemsQty = items.reduce(
      (acc, item) => acc + item.qty,
      0
    );

    const totalMechanicsQty = mechanics.reduce(
      (acc, mechanic) => acc + mechanic.qty,
      0
    );
    setTotalItemsQty(totalItemsQty);
    setTotalMechanicsQty(totalMechanicsQty); // Set the total price in state
    setTotalCheckoutQty(totalItemsQty + totalMechanicsQty);
  }

  // FOR SORTING ITEMS AND MECHANICS
  function showItemsByName(sortValue){
    let sortedItems;
    if(sortValue === "desc"){
      sortedItems = [...retrievedItems].sort((a,b) => a.item_name.localeCompare(b.item_name));
      setsortItemNameDESCClicked(true);
    } else if(sortValue === "asc"){
      sortedItems = [...retrievedItems].sort((a,b) => b.item_name.localeCompare(a.item_name));
      setsortItemNameDESCClicked(false);
    }
    setRetrievedItemsList(sortedItems);
    setItemSort("name");
  }
  function showItemsByStockCount(sortValue){
    let sortedItems;
    if(sortValue === "desc"){
      sortedItems = [...retrievedItems].sort((a,b) => a.stock_count - b.stock_count);
      setSortStockCountDESCClicked(true);
    }
    else if(sortValue === "asc"){
      sortedItems = [...retrievedItems].sort((a,b) => b.stock_count - a.stock_count);
      setSortStockCountDESCClicked(false);
    }
    setRetrievedItemsList(sortedItems);
    setItemSort("stock_count");
  }
  function showMechanicsByName(sortValue){
    let sortedMechanics;
    if(sortValue === "desc"){
      sortedMechanics = [...retrievedMechanics].sort((a,b) => b.mechanic_name.localeCompare(a.mechanic_name));
      setSortMechanicNameDESCClicked(true);
    } else if(sortValue === "asc"){
      sortedMechanics = [...retrievedMechanics].sort((a,b) => a.mechanic_name.localeCompare(b.mechanic_name));
      setSortMechanicNameDESCClicked(false);
    }
    setRetrievedMechanicsList(sortedMechanics);
    setMechanicSort("name");
  }
 
  // FOR SEARCHING ITEMS AND MECHANICS 
  function searchForItem(searchValue){
    // if (!searchValue) {
    //   setRetrievedItemsList(allItems);
    //   return;
    // } else {
    //   const searchResults = allItems.filter((allItem) =>
    //     allItem.item_name
    //       .toLowerCase()
    //       .includes(searchValue.toLowerCase())
    //   );
    //   setRetrievedItemsList(searchResults);
    // }

    // include if category is selected
    if(selectedCategory === "all"){
      if (!searchValue) {
        setRetrievedItemsList(allItems);
        return;
      } else {
        const searchResults = allItems.filter((allItem) =>
          allItem.item_name
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
        setRetrievedItemsList(searchResults);
      }
    } else {
      if (!searchValue) {
        const filteredItems = allItems.filter(
          (item) => item.category_name === selectedCategory
        );
        setRetrievedItemsList(filteredItems);
        return;
      } else {
        const searchResults = allItems.filter((allItem) =>
          allItem.item_name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) && allItem.category_name === selectedCategory
        );
        setRetrievedItemsList(searchResults);
      }
    }

  }
  function searchForMechanic(searchValue){
    if (!searchValue) {
      setRetrievedMechanicsList(allMechanics);
      return;
    } else {
      const searchResults = allMechanics.filter((allMechanic) =>
        allMechanic.mechanic_name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setRetrievedMechanicsList(searchResults);
    }
  }

  // FETCHING DATA FROM AND POSTING DATA TO THE DATABASE
  const retrieveAllItems = async () => {
    try {
      const { items } = await getAllItems();
      setRetrievedItemsList(items);
      setAllItemsList(items);
      // GET THE CATEGORY NAMES FOR EACH ITEM AND REMOVE DUPLICATES
      setCategories([...new Set(items.map((item) => item.category_name))]);
    } catch (err) {
      setError("Something went wrong.");
    }
  };
  const retrieveAllMechanics = async () => {
    try {
      const { mechanics } = await getAllMechanics();
      setRetrievedMechanicsList(mechanics);
      setAllMechanicsList(mechanics)
      console.log(mechanics);
    } catch (err) {
      setError("Something went wrong.");
    }
  };
  const confirmSaleService = async (
    items,
    mechanics,
    totalPrice,
    amountReceived,
    change
  ) => {
    try {
      const result = await confirmSale(
        items,
        mechanics,
        totalPrice,
        amountReceived,
        change
      );
      const { receiptName } = result;
      console.log("Sale confirmed", receiptName);
      localStorage.removeItem("items");
      localStorage.removeItem("mechanics");
      setTimeout(() => {
        setReceiptStatus('success');
      }, 3000);
    } catch (err) {
      console.error("Error confirming sale:", err);
      setTimeout(() => {
        setReceiptStatus("failed");
      }, 3000);
    }
  };
  const selectCategory = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setRetrievedItemsList(allItems);
    } else {
      const filteredItems = allItems.filter(
        (item) => item.category_name === category
      );
      setRetrievedItemsList(filteredItems);
    }
  };

  // FUNCTIONS FOR MOBILE RESPONSIVENESS
  const handleResize = () => {
    if (window.innerWidth < 900) {
      setCheckOutContainer("checkout-container-close");
      setRightContainerStyle("right-container-close");
      setPosContainer("pos-container");
      setIsVisible(true);
    } else {
      setCheckOutContainer("checkout-container");
      setRightContainerStyle("right-container");
      setPosContainer("pos-container");
      setIsVisible(true);
    }
  };
  const closePos = () => {
    setCheckOutContainer("checkout-container");
    setRightContainerStyle("right-container");
      if (window.innerWidth < 900) {
        setPosContainer("pos-container-close");
      } else {
        setPosContainer("pos-container");
      }
  }
  const closeCheckOut = () => {
      if (window.innerWidth < 900) {
        setCheckOutContainer("checkout-container-close");
        setRightContainerStyle("right-container-close");
        setPosContainer("pos-container");
      } else {
        setPosContainer("pos-container");
      }
  }

  // SET BUTTON ACTIVE FOR 500 MS : NOT USED YET
  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
    // Reset the active button after 3 seconds
    setTimeout(() => {
      setActiveButton(null);
    }, 500);
  };

  // GET ITEMS AND MECHANICS FROM DATABASE ON PAGE LOAD
  useEffect(() => {
    try{
      retrieveAllItems();
      retrieveAllMechanics();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setLoading(true);
    }
  }, []);

  // WHEN ITEMS AND MECHANICS ARRAY CHANGE, RUN THESE FUNCTIONS
  useEffect(() => {
    getTotalPrice(items, mechanics);
    getTotalQty(items, mechanics);
  }, [items, mechanics]);

  // WHEN WINDOW IS RESIZED
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, [isVisible]);

  // DISPLAY LOADING
  if(loading) return <LoadingPage classStyle="loading-in-page"/>

  return (
    <div className="point-of-sales p-3">
      <ResponsivePageLayout
        rightContainer={rightContainerStyle}
        leftContent={
          <div className={posContainer}>
            {/* POS ITEMS AND MECHANICS */}
            <div className="pos-nav">
              <div className="pos-tabs-view-checkout">
                <div className="pos-tabs">
                  <button
                    className={tab === "items" ? "active" : ""}
                    onClick={() => setTab("items")}
                  >
                    Items
                  </button>
                  <button
                    className={tab === "mechanics" ? "active" : ""}
                    onClick={() => setTab("mechanics")}
                  >
                    Mechanics
                  </button>
                </div>
                <div className="view-checkout">
                  <button
                    className="checkout-total"
                    onClick={() => {
                      setRightContainerStyle("right-container");
                      setCheckOutContainer("checkout-container");
                      setPosContainer("pos-container-close");
                    }}
                  >
                    View Checkout ({totalCheckoutQty})
                  </button>
                </div>
              </div>
              <div className="search-sorting">
                <SearchBar
                    value={tab === "items" ? searchItem : searchMechanic}
                    onChange={(e) => {
                        if (tab === "items") {
                          console.log(e.target.value);
                          setSearchItem(e.target.value);
                          searchForItem(e.target.value);
                        } else {
                          console.log(e.target.value);
                          setSearchMechanic(e.target.value);
                          searchForMechanic(e.target.value);
                        }
                    }}
                    placeholder={`Search for ${tab} here`}
                />
                <div className="sorting">
                  {tab === "items" && (
                    <div className="sort-tabs">
                      <button
                        className={itemSort === "name" ? "active" : ""}
                        onClick={() => {
                          if (sortItemNameDESCClicked) {
                            showItemsByName("asc");
                          } else {
                            showItemsByName("desc");
                          }
                        }}
                      >
                        {sortItemNameDESCClicked && (
                          <i className="fa-solid fa-arrow-down-a-z"></i>
                        )}
                        {!sortItemNameDESCClicked && (
                          <i className="fa-solid fa-arrow-down-z-a"></i>
                        )}
                      </button>
                      <button
                        className={itemSort === "stock_count" ? "active" : ""}
                        onClick={() => {
                          if (!sortStockCountDESCClicked) {
                            showItemsByStockCount("desc");
                          } else {
                            showItemsByStockCount("asc");
                          }
                        }}
                      >
                        {!sortStockCountDESCClicked && (
                          <i className="fa-solid fa-arrow-down-9-1"></i>
                        )}
                        {sortStockCountDESCClicked && (
                          <i className="fa-solid fa-arrow-down-1-9"></i>
                        )}
                      </button>
                    </div>
                  )}
                  {tab === "mechanics" && (
                    <div className="sort-tabs">
                      <button
                        className={mechanicSort === "name" ? "active" : ""}
                        onClick={() => {
                          if (!sortMechanicNameDESCClicked) {
                            showMechanicsByName("desc");
                          } else {
                            showMechanicsByName("asc");
                          }
                        }}
                      >
                        {sortMechanicNameDESCClicked && (
                          <i className="fa-solid fa-arrow-down-z-a"></i>
                        )}
                        {!sortMechanicNameDESCClicked && (
                          <i className="fa-solid fa-arrow-down-a-z"></i>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {tab === 'items' && <div className="categories">
              <button className={selectedCategory === 'all' ? "active" : ""}
                onClick={() => selectCategory('all')}
              >All</button>
              {categories.map((category, categoryIndex) => {
                return (
                    <button key={categoryIndex} 
                            className={selectedCategory === category ? "active" : ""}
                            onClick={() => selectCategory(category)}
                    >{category}</button>
                );
              })}
            </div>}
            <div className="list">
              {tab === "items" && (
                <div className="items-list">
                  {/* Display all items */}
                  {retrievedItems.length === 0 && (
                    <div className="add-btn empty">
                      <div>No items found</div>
                    </div>
                  )}
                  {retrievedItems.map((retrievedItem, retrievedItemIndex) => {
                    if (retrievedItem.stock_count !== 0) {
                      return (
                        <div
                          key={retrievedItemIndex}
                          className={
                            checkOutListView !== "not"
                              ? "add-btn"
                              : "add-btn error"
                          }
                          onClick={() =>
                            {
                              handleClick(retrievedItem.item_id);
                              addItem({
                                id: retrievedItem.item_id,
                                name: retrievedItem.item_name,
                                stock_count: retrievedItem.stock_count,
                                qty: 1,
                                price: retrievedItem.item_price,
                              })
                            }
                          }
                        >
                          <div>{retrievedItem.item_name}</div>
                          <div className="price-qty">
                            <div className="price">
                              {PesoFormat.format(retrievedItem.item_price)}
                            </div>
                            <div className="qty">
                              {retrievedItem.stock_count} items
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={retrievedItemIndex}
                          className={"add-btn error"}
                        >
                          <div>{retrievedItem.item_name}</div>
                          <div className="price-qty">
                            <div className="price">
                              {PesoFormat.format(retrievedItem.item_price)}
                            </div>
                            <div className="qty">No stock</div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              {tab === "mechanics" && (
                <div className="mechanics-list">
                  {/* Display all mechanics */}
                  {retrievedMechanics.length === 0 && (
                    <div className="add-btn empty">
                      <div>No mechanics found</div>
                    </div>
                  )}
                  {retrievedMechanics.map(
                    (retrievedMechanic, retrievedMechanicIndex) => {
                      return (
                        <div
                          key={retrievedMechanicIndex}
                          className={
                            checkOutListView !== "not" ||
                            mechanicSelected !== ""
                              ? "add-btn"
                              : "add-btn error"
                          }
                          onClick={() => {
                            selectMechanic();
                            setMechanicSelected({
                              id: retrievedMechanic.mechanic_id,
                              name: retrievedMechanic.mechanic_name,
                              qty: 1,
                              price: 1,
                              edit: "no",
                            });
                            closePos();
                          }}
                        >
                          {retrievedMechanic.mechanic_name}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        }
        rightContent={
          <div className={checkOutContainer}>
            {/* IF MECHANIC IS NOT ADDED */}

            {receiptView === true ? (
              <div className="receipt-container">
                {receiptStatus === "" && (
                  <div className="receipt-loading">
                    <div className="nav-tab">
                      <h4>Receipt</h4>
                    </div>
                    <p>Processing transaction...</p>
                  </div>
                )}
                {receiptStatus === "success" && (
                  <div className="receipt-success">
                    <div className="nav-tab">
                      <h4>Receipt</h4>
                    </div>
                    <p>Transaction successful!</p>
                    <p className="checkout-total">Print Receipt</p>
                    <p
                      className="checkout-total"
                      onClick={() => {
                        setReviewOrderView(false);
                        setChargeView(false);
                        setReceiptView(false);
                        setReceiptStatus("");
                        setCheckOutListView("items");
                        setTab("items");
                        setItemsList([]);
                        setMechanicsList([]);
                        closeCheckOut();
                      }}
                    >
                      Process another purchase order
                    </p>
                  </div>
                )}
                {receiptStatus === "failed" && (
                  <div className="receipt-failed">
                    <div className="nav-tab">
                      <h4>Receipt</h4>
                      <p
                        className="remove"
                        onClick={() => setReceiptView(false)}
                      >
                        Go back
                      </p>
                    </div>
                    <p>Transaction failed!</p>
                    <p
                      className="checkout-total"
                      onClick={() => {
                        confirmSaleService(
                          items,
                          mechanics,
                          totalPrice,
                          amountReceived,
                          change
                        );
                        setReceiptStatus("");
                      }}
                    >
                      Retry transaction
                    </p>
                  </div>
                )}
              </div>
            ) : chargeView === true ? (
              <div className="process-sale-container">
                <div className="nav-tab">
                  <h4>Charge</h4>
                  <p className="remove" onClick={() => setChargeView(false)}>
                    Go back
                  </p>
                </div>
                <div className="payment-list-items">
                  <p className="title">Details</p>
                  <div className="payment-list-item">
                    <div className="left">
                      <p>Total</p>
                    </div>
                    <div className="right">
                      <p className="item-price">
                        {PesoFormat.format(totalPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="payment-list-item">
                    <div className="left">
                      <p>Amount received</p>
                    </div>
                    <div className="right">
                      <NumericFormat
                        className="amount-received"
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={"₱"}
                        allowNegative={false}
                        value={amountReceived}
                        onValueChange={(values) => {
                          const { formattedValue, value } = values;
                          console.log(formattedValue); // formatted value
                          setChange(value - totalPrice); // numeric value
                          setAmountReceived(Number(value));
                        }}
                      />
                    </div>
                  </div>
                  <div className="payment-list-item">
                    <div className="left">
                      <p>Change</p>
                    </div>
                    <div className="right">
                      {change >= 0 ? (
                        <p>{PesoFormat.format(change)}</p>
                      ) : (
                        <p>Insufficient amount!</p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className={
                    change >= 0 ? "checkout-total" : "checkout-total-error"
                  }
                  onClick={() => {
                    if (change >= 0) {
                      confirmSaleService(
                        items,
                        mechanics,
                        totalPrice,
                        amountReceived,
                        change
                      );
                      setReceiptView(true);
                    }
                  }}
                >
                  Confirm Sale {PesoFormat.format(totalPrice)}
                </button>
              </div>
            ) : reviewOrderView === true ? (
              // SHOW REVIEW ORDER PAGE
              <div className="charge-payment-container">
                <div className="nav-tab">
                  <h4>Review Order</h4>
                  <p
                    className="remove"
                    onClick={() => {
                      setReviewOrderView(false);
                      setCheckOutListView("items");
                      closePos();
                    }}
                  >
                    Go back
                  </p>
                </div>
                {/* LIST IN REVIEW ORDER */}
                <div className="payment-list-items">
                  {/* ITEMS LIST */}
                  {/* <strong>{item.name}</strong> */}
                  {items.length !== 0 && (
                    <p className="title">
                      {totalItemsQty} {totalItemsQty > 1 ? "Items" : "Item"}
                    </p>
                  )}
                  {items.map((item, itemIndex) => {
                    return (
                      <div className="payment-list-item" key={itemIndex}>
                        <div className="left">
                          <p>
                            {item.name} 
                          </p>
                          <p><em>Qty: {item.qty}</em></p>
                        </div>
                        <div className="right">
                          <p className="item-price">
                            {PesoFormat.format(item.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {/* MECHANICS LIST */}
                  {mechanics.length !== 0 && (
                    <p className="title">
                      {totalMechanicsQty}{" "}
                      {totalMechanicsQty > 1 ? "Mechanics" : "Mechanic"}
                    </p>
                  )}
                  {mechanics &&
                    mechanics.map((mechanic, mechanicIndex) => {
                      return (
                        <div className="payment-list-item" key={mechanicIndex}>
                          <div className="left">
                            <p>{mechanic.name}</p>
                          </div>
                          <div className="right">
                            <p className="mechanic-price">
                              {PesoFormat.format(mechanic.price)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {/* SUBTOTALS */}
                <div className="sub-total-content">
                  <div
                    className={
                      totalItemPrice > 0 ? "sub-total" : "sub-total none"
                    }
                  >
                    <p>Items Subtotal:</p>
                    <p>{PesoFormat.format(totalItemPrice)}</p>
                  </div>
                  <div
                    className={
                      totalMechanicPrice > 0 ? "sub-total" : "sub-total none"
                    }
                  >
                    <p>Mechanics Subtotal:</p>
                    <p>{PesoFormat.format(totalMechanicPrice)}</p>
                  </div>
                  <button
                    className="checkout-total"
                    onClick={() => {
                      setChargeView(true);
                      setAmountReceived(Number(totalPrice));
                      setChange(0);
                      console.log(items);
                      console.log(mechanics);
                    }}
                  >
                    Charge {PesoFormat.format(totalPrice)}
                  </button>
                </div>
              </div>
            ) : mechanicAdded === true ? (
              // IF MECHANIC IS ADDED, SHOW SET MECHANIC PRICE PAGE
              <div className="add-mechanic-container">
                <p
                  className="remove"
                  onClick={() => {
                    setMechanicAdded(false);
                    setCheckOutContainer("checkout-container");
                    setRightContainerStyle("right-container");
                    setPosContainer("pos-container");
                    closeCheckOut();
                  }}
                >
                  Cancel
                </p>
                <h4>
                  {mechanicSelected.edit === "yes" ? "Edit " : "Add "}
                  {mechanicSelected.name}
                </h4>
                <div className="add-mechanic">
                  <div className="set-price">
                    <label>Set {mechanicSelected.name}'s price</label>
                    <div>
                      <NumericFormat
                        className="price-input"
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        prefix={"₱"}
                        minimumValue={1}
                        allowNegative={false}
                        value={mechanicSelected.price}
                        onValueChange={(values) => {
                          const { formattedValue, value } = values;
                          console.log(formattedValue); // formatted value
                          setMechanicSelected((mechanicSelected) => ({
                            ...mechanicSelected,
                            price: Number(value),
                          })); // numeric value
                        }}
                      />
                    </div>
                    {mechanicSelected.edit === "yes" && (
                      <button
                        onClick={() => {
                          addMechanic({
                            id: mechanicSelected.id,
                            name: mechanicSelected.name,
                            qty: 1,
                            price: mechanicSelected.price,
                            edit: "yes",
                          });
                          closePos();
                        }}
                      >
                        Save edit
                      </button>
                    )}

                    {mechanicSelected.edit === "no" && mechanicSelected.price > 0 && (
                      <button
                        onClick={() => {
                          addMechanic({
                            id: mechanicSelected.id,
                            name: mechanicSelected.name,
                            qty: 1,
                            price: mechanicSelected.price,
                            edit: "no",
                          });
                          closePos();
                        }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // IF MECHANIC IS NOT ADDED, SHOW CHECKOUT, REVIEW ORDER, CHARGE PAGE
              <div className="inner-checkout-container">
                <div className="nav-tab">
                  <h4>Checkout</h4>
                  <p
                    id="close-checkout"
                    className="remove"
                    onClick={() => {
                      closeCheckOut();
                    }}
                  >
                    Go back
                  </p>
                </div>
                {/* CHECKOUT TABS */}
                <div className="checkout-tabs">
                  <button
                    className={checkOutListView === "items" ? "active" : ""}
                    onClick={() => setCheckOutListView("items")}
                  >
                    Items ({totalItemsQty})
                  </button>
                  <button
                    className={checkOutListView === "mechanics" ? "active" : ""}
                    onClick={() => setCheckOutListView("mechanics")}
                  >
                    Mechanics ({totalMechanicsQty})
                  </button>
                </div>
                {checkOutListView === "items" ? (
                  // LIST OF ITEMS IN CHECKOUT
                  <div className="list">
                    <div className="bar">
                      <p>Items</p>
                      <p>Subtotal: {PesoFormat.format(totalItemPrice)}</p>
                      {/* <button onClick={()=> setItemsList([])} className='remove'>Remove all</button> */}
                    </div>
                    <div className="list-items">
                      {items.map((item, itemIndex) => {
                        return (
                          <div className="list-item" key={itemIndex}>
                            <div className="left">
                              <p className="item-name">{item.name}</p>
                              <div className="qty">
                                {item.qty <= 1 ? (
                                  <button className="no-decrease">-</button>
                                ) : (
                                  <button
                                    onClick={() => updateItemQty(item, -1)}
                                  >
                                    -
                                  </button>
                                )}
                                <input
                                  type="number"
                                  value={item.qty}
                                  min="1"
                                  onChange={(e) => {
                                    const newQty = Number(e.target.value);
                                    if (newQty >= 1 && newQty <= item.stock_count) {
                                      updateItemQty(item, newQty - item.qty);
                                    }
                                  }} // Update qty based on input change
                                />
                                {item.stock_count > item.qty ? (
                                  <button
                                    onClick={() => updateItemQty(item, 1)}
                                  >
                                    +
                                  </button>
                                ) : (
                                  <button className="no-decrease">+</button>
                                )}
                                <p className="max-qty">Max: {item.stock_count}</p>
                              </div>
                            </div>
                            <div className="right">
                              <p className="price">
                                {PesoFormat.format(item.qty * item.price)}
                              </p>
                              <p
                                onClick={() => {
                                  removeItem(item);
                                  deleteItem(itemIndex);
                                }}
                                className="remove"
                              >
                                Remove
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // LIST OF MECHANICS IN CHECKOUT
                  <div className="list">
                    <div className="bar">
                      <p>Mechanics</p>
                      <p>Subtotal: {PesoFormat.format(totalMechanicPrice)}</p>
                      {/* <button onClick={()=> setMechanicsList([])} className='remove'>Remove all</button> */}
                    </div>
                    <div className="list-items">
                      {mechanics.map((mechanic, mechanicIndex) => {
                        return (
                          <div className="list-item" key={mechanicIndex}>
                            <div className="left">
                              <p>{mechanic.name}</p>
                              <p
                                onClick={() => {
                                  setMechanicAdded(true);
                                  setMechanicSelected({
                                    id: mechanicSelected.id,
                                    name: mechanic.name,
                                    qty: 1,
                                    price: Number(mechanic.price),
                                    edit: "yes",
                                  });
                                  closePos();
                                }}
                                className="mechanic-price"
                              >
                                Edit price
                              </p>
                            </div>

                            <div className="right">
                              <p className="mechanic-price-text">
                                {PesoFormat.format(mechanic.price)}
                              </p>
                              <p
                                onClick={() => deleteMechanic(mechanicIndex)}
                                className="remove"
                              >
                                Remove
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {totalPrice !== 0 && (
                  <button
                    className="checkout-total"
                    onClick={() => {
                      setReviewOrderView(true);
                      setCheckOutListView("not");
                    }}
                  >
                    Review Order {PesoFormat.format(totalPrice)}
                  </button>
                )}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default PointOfSales;
