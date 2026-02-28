import React from 'react';
import '../css/Account.css';
import Navbar from '../components/Navbar.jsx';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Account() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="account-container">
                    <div className="account-card">
                        <h2>No has iniciado sesión</h2>
                        <button className="account-btn" onClick={() => navigate('/login')}>IR AL LOGIN</button>
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
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            user.name ? user.name.charAt(0).toUpperCase() : '?'
                        )}
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