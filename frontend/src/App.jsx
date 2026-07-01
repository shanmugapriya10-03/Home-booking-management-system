import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth & Home Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import HostSignup from "./pages/HostSignup";
import AddHome from "./pages/AddHome";
import HomeDetails from "./pages/HomeDetails";
import PaymentBookings from "./pages/PaymentBookings";

// Dashboard & Management
import SellerDashboard from "./pages/SellerDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManageHomes from "./pages/ManageHomes";          // Edit/Delete homes
import ApproveRequests from "./pages/ApproveRequests";  // Admin approval
import PaymentPage from "./pages/PaymentPage";          // Payment page
import AdminPanel from "./pages/AdminPanel";            // Admin panel
// Other Pages
import Chatbot from "./pages/Chatbot";
import EditHome from "./pages/EditHome";
import CartPage from "./pages/CartPage";
import BookingPage from "./pages/BookingPage";
import HomeDesigner from "./pages/HomeDesigner";
import NeighborhoodExperience from "./pages/NeighborhoodExperience";
import HomeList from "./pages/HomeList";
import AddHomeRent from "./pages/AddHomeRent";
import AddHomeBuy from "./pages/AddHomeBuy";
import "leaflet/dist/leaflet.css";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/host-signup" element={<HostSignup />} />
        <Route path="/homes" element={<AddHome />} />
        <Route path="/home/:id" element={<HomeDetails />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/home-designer" element={<HomeDesigner />} />
        <Route path="/home/:id/neighborhood-experience" element={<NeighborhoodExperience />} />
        <Route path="/" element={<LandingPage />} />

        {/* User Routes */}
        <Route path="/user-dashboard/:email" element={<UserDashboard />} />
        <Route path="/cart/:email" element={<CartPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        

        {/* Seller / Host Routes */}
        <Route path="/dashboard/:email" element={<SellerDashboard />} />
        <Route path="/edit-home/:id" element={<EditHome />} />
        <Route path="/manage-homes/:email" element={<ManageHomes />} />
       


        {/* Admin Routes */}
        <Route path="/admin1" element={<HomeList />} />
       <Route path="/approve-requests/:email" element={<ApproveRequests />} />

        <Route path="/payments/:email" element={<PaymentPage />} />
  <Route path="/add-home-buy" element={<AddHomeBuy />} />
<Route path="/add-home-rent" element={<AddHomeRent />} />
<Route path="/payment-bookings/:email" element={<PaymentBookings />} />
<Route path="/admin" element={<AdminPanel/>} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
