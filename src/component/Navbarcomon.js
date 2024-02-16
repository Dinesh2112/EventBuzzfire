import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import logo from './logo.png';

export default function Navbarcommon() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateEvent = () => {
    if (user) {
      navigate('/create-event');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='nav'>
      <img src={logo} className='logo' alt='/' />

      <div className='search-bar'>
        <input type='text' placeholder='Search...' />
      </div>

      <div className='menu-items'>
        <Link to='/'>
          <h4>HOME</h4>
        </Link>
        <Link to='/events'>
          <h4>EVENTS</h4>
        </Link>
        <h4 onClick={handleCreateEvent}>CREATE EVENT</h4>

        {user ? (
          <div className='user-profile'>
            <div className='user-info'>
              {user.providerData[0].providerId === 'google.com' && user.photoURL && (
                <img src={user.photoURL} alt='profile' className='profile-image' />
              )}
              {(!user.providerData[0].providerId || user.providerData[0].providerId !== 'google.com') && (
                <div className='plain-circle'></div>
              )}
              <p className='username'>{user.displayName}</p>
            </div>
            <button className='text-button' onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        ) : (
          <div className='menu-items'>
            <Link to='/login'>
              <button className='text-button'>LOGIN</button>
            </Link>
            <Link to='/signup'>
              <button className='text-button'>SIGNUP</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
