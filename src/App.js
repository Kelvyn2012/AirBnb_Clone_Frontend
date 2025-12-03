import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetail from './pages/PropertyDetail';
import Bookings from './pages/Bookings';
import HostDashboard from './pages/HostDashboard';
import CreateProperty from './pages/CreateProperty';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import OAuthCallback from './pages/OAuthCallback';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/property/:id" element={<PropertyDetail />} />

              <Route path="/bookings" element={
                <PrivateRoute><Bookings /></PrivateRoute>
              } />

              <Route path="/host/dashboard" element={
                <PrivateRoute><HostDashboard /></PrivateRoute>
              } />

              <Route path="/host/create-property" element={
                <PrivateRoute><CreateProperty /></PrivateRoute>
              } />

              <Route path="/messages" element={
                <PrivateRoute><Messages /></PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />

              <Route path="/oauth-callback" element={<OAuthCallback />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
