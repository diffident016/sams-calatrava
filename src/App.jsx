import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider >
          <Routes>
            <Route path='*' element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            } />
            <Route path="/login" element={
              <PrivateRoute>
                <Login />
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
