
import NotFound from './not-found/not-found.jsx';
import Login from './login/login.jsx';
import LoginPOS from './login-pos/login-pos.jsx';
import SetUpAccount from './set-up-account/set-up-account.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import POSUsers from './pos-users/pos-users.jsx';
import Inventory from './inventory/inventory.jsx';
import Summaries from './summaries/summaries.jsx';
import Reports from './reports/reports.jsx';
import Records from './records/records.jsx'
import Waitlist from './waitlist/waitlist.jsx';
import BikeBuilderUpgrader from './bike-builder-upgrader/bike-builder-upgrader.jsx';
    import Frame from './bike-builder-upgrader/parts/frame/frame.jsx';
    import Fork from './bike-builder-upgrader/parts/fork/fork.jsx';
    import Groupset from './bike-builder-upgrader/parts/groupset/groupset.jsx';
    import Wheelset from './bike-builder-upgrader/parts/wheelset/wheelset.jsx';
    import Seat from './bike-builder-upgrader/parts/seat/seat.jsx';
    import Cockpit from './bike-builder-upgrader/parts/cockpit/cockpit.jsx';
    import Headset from './bike-builder-upgrader/parts/headset/headset.jsx';
    import Handlebar from './bike-builder-upgrader/parts/handlebar/handlebar.jsx';
    import Stem from './bike-builder-upgrader/parts/stem/stem.jsx';
    import Hubs from './bike-builder-upgrader/parts/hubs/hubs.jsx';
import Orders from './orders/orders.jsx';
import PointOfSales from './point-of-sales/point-of-sales.jsx';
import Expenses from './expenses/expenses.jsx';
import Receipts from './receipts/receipts.jsx';
import Mechanics from './mechanics/mechanics.jsx';

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

    // Records Page
    Records,

    // Waitlist Page
    Waitlist,

    // Bike Builder and Upgrader Page
    BikeBuilderUpgrader,

        // Parts Page
        Frame,
        Fork,
        Groupset,
        Wheelset,
        Seat,
        Cockpit,
        Headset,
        Handlebar,
        Stem,
        Hubs,

    // Order Page
    Orders,

    // Point of Sales Page
    PointOfSales,

    // Expenses Page
    Expenses,

    // Receipts Page
    Receipts,

    // Mechanics Page
    Mechanics
};

export default Pages;