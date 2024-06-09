import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/guest/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/userContext';
import { ConsultantContextProvider } from './context/ConsultantContext';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import AppraiserDashboard from './pages/appraiser/AppraiserDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';

import ViewUsers from './pages/admin/ViewUsers';
import ViewStaffs from './pages/admin/ViewStaffs';
import AddingForm from './pages/admin/AddingForm';

import AboutUsGuest from './pages/guest/AboutUsGuest';
import ConsultingServicesGuest from './pages/guest/ConsultingServicesGuest';
import ValuationTool from './pages/guest/ValuationTool';



import BookingForm from './pages/customer/BookingForm';
import AboutUsCustomer from './pages/customer/AboutUsCustomer';
import ConsultingServicesCustomer from './pages/customer/ConsultingServicesCustomer';


import RequestViewDetail from './pages/consultant/RequestViewDetail';
import AppointmentCalendar from './pages/consultant/AppointmentCalendar';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <ConsultantContextProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard (this one is public, assuming it's a general overview) */}
          <Route path="/dashboard" element={<CustomerDashboard />} />

          {/* Routes for Role-Specific Dashboards */}
          <Route path="/admin/users" element={<ViewUsers />} /> 
          <Route path="/admin/staff" element={<ViewStaffs />} /> 
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/consultant" element={<ConsultantDashboard />} />
          <Route path="/appraiser" element={<AppraiserDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />

          <Route path="/admin/add-user" element={<AddingForm />} />

          <Route path="/about-us-guest" element={<AboutUsGuest />} />
          <Route path="/consulting-services-guest" element={<ConsultingServicesGuest />} />
          <Route path="/valuation-tool" element={<ValuationTool />} />

          <Route path="/about-us-customer" element={<AboutUsCustomer />} />
          <Route path="/consulting-services-customer" element={<ConsultingServicesCustomer />} />
          {/* <Route path="/valuation-tool" element={<ValuationTool />} /> */}

          <Route path="/booking" element={<BookingForm />} />
          <Route path="/consultant/requests/:bookingId" element={<RequestViewDetail />} /> 
          <Route path="/consultant/appointments" element={<AppointmentCalendar />} /> 
        </Routes>
      </ConsultantContextProvider>
    </UserContextProvider>
  );
}

export default App;
