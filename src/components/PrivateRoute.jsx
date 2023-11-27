import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { UserProfile } from '../models/UserProfile';
import Homepage from '../pages/Homepage';
import { getUser } from '../api/Service'
import Loader from './Loader';
import Login from '../pages/Login';

function PrivateRoute({ children }) {

    const { currentUser } = useAuth();
    const { pathname } = useLocation();

    const [isLoading, setLoading] = useState(true);
    const { profile, updateProfile } = UserProfile();

    const getUserProfile = async () => {

        getUser(currentUser.uid).then((value) => {
            if (value.data() != null) {
                const userProfile = value.data()
                updateProfile(userProfile)
            }

            setLoading(false)
        });
    }

    if (currentUser != null) {

        if (profile.userId == null || profile.userId != currentUser.uid) {
            getUserProfile();
        }

        return (
            <>
                {(pathname === '/') ?
                    (isLoading ?
                        <Loader message='Loading, please wait...' /> :
                        <Homepage userType={profile.userType} />)
                    : <Navigate to='/' />}
            </>
        )
    }

    return <Login />

}

export default PrivateRoute