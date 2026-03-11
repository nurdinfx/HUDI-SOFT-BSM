import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Branches from './pages/Branches';
import Products from './pages/Products';
import POS from './pages/POS';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Expenses from './pages/Expenses';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import UsersRoles from './pages/UsersRoles';
import SettingsPage from './pages/Settings';
import AuditLog from './pages/AuditLog';
import DashboardLayout from './layout/DashboardLayout';

const App = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            token ? (
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/purchases" element={<Purchases />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users" element={<UsersRoles />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/audit" element={<AuditLog />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
