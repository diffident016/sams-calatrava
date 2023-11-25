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
            <Route path="/login" element={
              <Login />
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
