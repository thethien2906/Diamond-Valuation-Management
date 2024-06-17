// Client/src/App.js
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
import ConsultantDashboardLayout from './pages/consultant/ConsultantDashboardLayout';
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

import PendingRequests from './pages/consultant/PendingRequests';
import RequestViewDetail from './pages/consultant/RequestViewDetail';
import AppointmentCalendar from './pages/consultant/AppointmentCalendar';
import AppointmentViewDetail from './pages/consultant/AppointmentViewDetail';
import GenerateReceiptForm from './pages/consultant/ReceiptForm';
import ReceiptDetail from './pages/consultant/ReceiptDetail';
import RecordView from './pages/consultant/RecordView';
import RecordViewDetail from './pages/consultant/RecordViewDetail';


import TaskView from './pages/appraiser/TaskView';
import ValuationRecordAppraiserDetail from './pages/appraiser/TaskViewDetail';
import TaskDoneView from './pages/appraiser/TaskDoneView';
import TaskDoneViewDetail from './pages/appraiser/TaskDoneViewDetail';import RequestView from './pages/consultant/RequestView';
import Receipt from './pages/consultant/Receipt';
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
          
          <Route path="/dashboard" element={<CustomerDashboard />} />

          {/* Nested routes under AdminDashboard */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="users" element={<ViewUsers />} />
            <Route path="staff" element={<ViewStaffs />} />
            <Route path="add-user" element={<AddingForm />} />
          </Route>

          {/* Nested routes under ConsultantDashboard */}
          <Route path="/consultant" element={<ConsultantDashboardLayout />}>
            <Route index element={<PendingRequests />} />
            <Route path="requestView/:bookingId" element={<RequestView/>}/>
            <Route path="receipt" element={<Receipt/>}/>
            <Route path="requests/:bookingId" element={<RequestViewDetail />} />
            <Route path="appointments" element={<AppointmentCalendar />} />
            <Route path="appointments/:bookingId" element={<AppointmentViewDetail />} />
            <Route path="receipt-form/:bookingId" element={<GenerateReceiptForm />} />  {/* New route for ReceiptForm */}
            <Route path="receipts/:receiptId" element={<ReceiptDetail />} />
            <Route path="valuation-records" element={<RecordView />} /> 
            <Route path="valuation-records/:recordId" element={<RecordViewDetail />} /> {/* Add this route */}

          </Route>


          
          <Route path="/appraiser" element={<AppraiserDashboard />} />
          <Route path="/appraiser/task-view" element={<TaskView />}/>
          <Route path="/appraiser/valuation-records/:recordId" element={<ValuationRecordAppraiserDetail />} /> {/* Add this route */}
          <Route path="/appraiser/task-done-view" element={<TaskDoneView />}/>
          <Route path="/appraiser/task-view/:recordId" element={<TaskDoneViewDetail />} />
            


          <Route path="/manager" element={<ManagerDashboard />} />
          
          <Route path="/about-us-guest" element={<AboutUsGuest />} />
          <Route path="/consulting-services-guest" element={<ConsultingServicesGuest />} />
          <Route path="/valuation-tool" element={<ValuationTool />} />

          <Route path="/about-us-customer" element={<AboutUsCustomer />} />
          <Route path="/consulting-services-customer" element={<ConsultingServicesCustomer />} />
          
          <Route path="/booking" element={<BookingForm />} />
        </Routes>
      </ConsultantContextProvider>
    </UserContextProvider>
  );
}

export default App;
