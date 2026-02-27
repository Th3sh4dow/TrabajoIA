import React, { useEffect, useState } from 'react';
import '../css/Account.css';
import Navbar from '../components/Navbar.jsx';

function Account() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="account-container">
                    <div className="account-card">
                        <h2>No has iniciado sesión</h2>
                        <button className="account-btn" onClick={() => window.location.href = '/login'}>IR AL LOGIN</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="account-container">
                <div className="account-card">
                    <div className="profile-img">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                    <div className="account-actions">
                        <button className="logout-btn" onClick={handleLogout}>CERRAR SESIÓN</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;