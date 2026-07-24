import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';
import NotFound from '../pages/NotFound.jsx';

import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import FranchiseLayout from '../components/FranchiseLayout.jsx';
import StaffLayout from '../components/StaffLayout.jsx';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import FranchiseList from '../pages/admin/FranchiseList.jsx';
import CreateFranchise from '../pages/admin/CreateFranchise.jsx';
import EditFranchise from '../pages/admin/EditFranchise.jsx';
import FranchiseOverview from '../pages/admin/FranchiseOverview.jsx';
import UsersList from '../pages/admin/UsersList.jsx';
import AdminStaffList from '../pages/admin/AdminStaffList.jsx';
import AdminProductList from '../pages/admin/AdminProductList.jsx';

// Franchise Owner Pages
import FranchiseDashboard from '../pages/franchise/FranchiseDashboard.jsx';
import StaffList from '../pages/franchise/StaffList.jsx';
import AddStaff from '../pages/franchise/AddStaff.jsx';
import EditStaff from '../pages/franchise/EditStaff.jsx';
import ProductList from '../pages/franchise/ProductList.jsx';
import AddProduct from '../pages/franchise/AddProduct.jsx';
import EditProduct from '../pages/franchise/EditProduct.jsx';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard.jsx';
import StaffProductList from '../pages/staff/StaffProductList.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes (All Logged-in Users) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Protected Admin Routes (Super Admin Only) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/franchises" element={<FranchiseList />} />
          <Route path="/admin/franchises/create" element={<CreateFranchise />} />
          <Route path="/admin/franchises/edit/:id" element={<EditFranchise />} />
          <Route path="/admin/franchises/:id" element={<FranchiseOverview />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/staff" element={<AdminStaffList />} />
          <Route path="/admin/users" element={<UsersList />} />
        </Route>
      </Route>

      {/* Protected Franchise Owner Routes */}
      <Route element={<ProtectedRoute allowedRoles={['franchise']} />}>
        <Route element={<FranchiseLayout />}>
          <Route path="/franchise" element={<Navigate to="/franchise/dashboard" replace />} />
          <Route path="/franchise/dashboard" element={<FranchiseDashboard />} />
          <Route path="/franchise/staff" element={<StaffList />} />
          <Route path="/franchise/staff/add" element={<AddStaff />} />
          <Route path="/franchise/staff/edit/:id" element={<EditStaff />} />
          <Route path="/franchise/products" element={<ProductList />} />
          <Route path="/franchise/products/add" element={<AddProduct />} />
          <Route path="/franchise/products/edit/:id" element={<EditProduct />} />
        </Route>
      </Route>

      {/* Protected Staff Routes */}
      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/products" element={<StaffProductList />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
