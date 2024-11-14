
import NotFound from './not-found/not-found.jsx';
import Login from './login/login.jsx';
import LoginPOS from './login-pos/login-pos.jsx';
import SetUpAccount from './set-up-account/set-up-account.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import POSUsers from './pos-users/pos-users.jsx';
import Inventory from './inventory/inventory.jsx';
import Summaries from './summaries/summaries.jsx';
import Reports from './reports/reports.jsx';
    import SalesReport from '../components/reports/sales-report.jsx';
    import ExpensesReport from '../components/reports/expenses-report.jsx';
    import LaborReport from '../components/reports/labor-cost-report.jsx';
    import OrderSalesReport from '../components/reports/order-sales-report.jsx';
    import RevenueReport from '../components/reports/revenue.jsx';
import Records from './records/records.jsx'
import Waitlist from './waitlist/waitlist.jsx';
import BikeBuilderUpgrader from './bike-builder-upgrader/bike-builder-upgrader.jsx';
    import MountainBike from './bike-builder-upgrader/mountain-bike/mountain-bike.jsx';
        import Frame from './bike-builder-upgrader/mountain-bike/parts/frame/frame.jsx';
        import Fork from './bike-builder-upgrader/mountain-bike/parts/fork/fork.jsx';
        import Groupset from './bike-builder-upgrader/mountain-bike/parts/groupset/groupset.jsx';
        import Wheelset from './bike-builder-upgrader/mountain-bike/parts/wheelset/wheelset.jsx';
        import Seat from './bike-builder-upgrader/mountain-bike/parts/seat/seat.jsx';
        import Cockpit from './bike-builder-upgrader/mountain-bike/parts/cockpit/cockpit.jsx';
    import RoadBike from './bike-builder-upgrader/road-bike/road-bike.jsx';
import Orders from './orders/orders.jsx';
import PointOfSales from './point-of-sales/point-of-sales.jsx';
import Expenses from './expenses/expenses.jsx';
import Receipts from './receipts/receipts.jsx';
import Mechanics from './mechanics/mechanics.jsx';
import Profile from './profile/profile.jsx';
import ResetPassword from './reset-password/reset-password.jsx';

const Pages = {
    // Not Found Page
    NotFound,

    // Login Admin Page
    Login,

    // Login POS Page
    LoginPOS,

    // Set Up Admin Account Page
    SetUpAccount,

    // Dashboard Page
    Dashboard,

    // POS Users Page
    POSUsers,

    // Inventory Page
    Inventory,

    // Summaries Page
    Summaries,

    // Reports Page
    Reports,

        // Reports 
        SalesReport,
        ExpensesReport,
        LaborReport,
        OrderSalesReport,
        RevenueReport,

    // Records Page
    Records,

    // Waitlist Page
    Waitlist,

    // Bike Builder and Upgrader Page
    BikeBuilderUpgrader,

        // Mountain Bike Page
        MountainBike, 
            // Parts Page
            Frame,
            Fork,
            Groupset,
            Wheelset,
            Seat,
            Cockpit,
        
        // Road Bike Page
        RoadBike,

    // Order Page
    Orders,

    // Point of Sales Page
    PointOfSales,

    // Expenses Page
    Expenses,

    // Receipts Page
    Receipts,

    // Mechanics Page
    Mechanics,

    // Profile Page
    Profile,

    // Forgot Password Page
    ResetPassword
};

export default Pages;