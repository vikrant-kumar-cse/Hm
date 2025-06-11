import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import SendVerificationEmail from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';
import WardenLogin from './pages/WardenLogin';
import MessManagerLogin from './pages/MessManagerLogin';
import CaretakerLogin from './pages/CaretakerLogin';
import AdminDashboard from './pages/AdminDashboard';
import WardenDashboard from './pages/WardenDashboard';
import MessManagerDashboard from './pages/MessManagerDashboard';
import CaretakerDashboard from './pages/CaretakerDashboard';
import Navigation from './pages/Navigation';
import MessReductionForm from './components/AdminSettings';
import StoreManager from './components/StoreManager';
import StudentProfile from './components/Studentprofile';
import AllotmentForm from './components/AllotmentForm';
import MessReduction from './components/MessReduction';
import MessReductionTracking from './components/MessReductionTracking';
import UserTable from './components/UserTable';
import VerifyRedirect from './pages/VerifyRedirect';
import SennForgotpasswordmail from './pages/forgotpassword';
import ResetPasswordRedirect from './pages/ResetPasswordRedirect';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import MessReduction_info from './components/Mess_Red_Info';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const PrivateRoute02 = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/admin-login" />;
  };

  const PrivateRoute03 = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/warden-login" />;
  };

  const PrivateRoute04 = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/mess_manager-login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />

      <Routes>
        <Route path="/" element={<Navigate to="/navigation" />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SendVerificationEmail />} />
        <Route path="/forgot-password" element={<SennForgotpasswordmail />} />
        <Route path="/verify" element={<VerifyRedirect />} />
        <Route path="/forgot-password-verify" element={<ResetPasswordRedirect />} />



        {/* ✅ USER DASHBOARD */}
        <Route path="/user-dashboard/*" element={<PrivateRoute element={<UserDashboard />} />}>
          <Route index element={<h3>📊 User Dashboard Overview</h3>} />
          <Route path="Student-profile" element={<StudentProfile />} />
          <Route path="hostel-allotment" element={<AllotmentForm />} />
          <Route path="mess-reduction" element={<MessReduction/>} />
          <Route path="mess_Red-tracking" element={<MessReductionTracking />} />
          <Route path="mess-calendar" element={<StoreManager />} />
          <Route path="grievance" element={<StoreManager />} />
          <Route path="rules" element={<StoreManager />} />
        </Route>

        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ✅ ADMIN DASHBOARD */}
        <Route path="/admin-dashboard/*" element={<PrivateRoute02 element={<AdminDashboard />} />}>
          <Route index element={<h3>📊 Admin Dashboard Overview</h3>} />
          <Route path="user-details" element={<UserTable />} />
          <Route path="admin-create" element={<h3>✏️ Create Sub Admin Page</h3>} />
          <Route path="store-manager" element={<StoreManager />} />
        </Route>


        <Route path="/warden-login" element={<WardenLogin />} />
        
        <Route path="/warden-dashboard/*" element={<PrivateRoute03 element={<WardenDashboard />} />}>
              <Route index element={<h3>📊 Warden Dashboard Overview</h3>} />
              <Route path="user-details" element={<UserTable />} />
              <Route path="admin-create" element={<h3>✏️ Create Sub Admin Page</h3>} />
              <Route path="Mess_Reduction_Application" element={<MessReduction_info />} />
        </Route>


       


       <Route path="/mess_manager-login" element={<MessManagerLogin />}/>
      
      {/* Mess_Manager-Dashboard */}
      <Route path="/mess_manager-dashboard/*" element={<PrivateRoute04 element={<MessManagerDashboard />} />}>
               <Route index element={<h3>📊 MessManager Dashboard Overview</h3>} />
               <Route path="user-details" element={<UserTable />} />
               
               <Route path="admin-create" element={<h3>✏️ Create Sub Admin Page</h3>} />
        
        </Route>
        

        <Route path="/hostel-care-tacker-login" element={<CaretakerLogin />}/>

       {/* Care Tacker Dashboard */}
       
       <Route path="/caretaker-dashboard/*" element={<PrivateRoute04 element={<CaretakerDashboard />} />}>
               <Route index element={<h3>📊 Caretaker Dashboard Overview</h3>} />
               <Route path="user-details" element={<UserTable />} />
               
               <Route path="admin-create" element={<h3>✏️ Create Sub Admin Page</h3>} />
               
        </Route>


       
      </Routes>
    </div>
  );
}

export default App;
