import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import ApplicationModal from './components/ApplicationModal';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import NewApplication from './components/dashboard/NewApplication';
import MyApplications from './components/dashboard/MyApplications';
import Profile from './components/dashboard/Profile';
import AdminDashboard from './components/dashboard/AdminDashboard'; // Import AdminDashboard

export default function App() {
  return (
    <AuthProvider>
      <Router basename="/keneshub">
        <AuthModal />
        <ApplicationModal />
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Landing />} />

          {/* Dashboard Layout (Public wrapper, but some children are protected) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            } />
            
            {/* New Application is PUBLIC */}
            <Route path="new" element={<NewApplication />} />
            
            <Route path="applications" element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } />
            
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
