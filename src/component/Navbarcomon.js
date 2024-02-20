import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from './logo.png';

const Navbarcommon = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Hook to get the navigate function

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

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  // Updated function to redirect to Dashboard
  const redirectToDashboard = () => {
    // Assuming user has a userId
    const userId = user?.uid;
    if (userId) {
      navigate(`/dashboard/${userId}`);
    }
  };

  return (
    <div className='navbar-common'>
      <img src={logo} className='logo' alt='/' />

      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className='search-btn' onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
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
            <div className='user-info' onClick={redirectToDashboard}>
              {user.providerData[0].providerId === 'google.com' && user.photoURL && (
                <img src={user.photoURL} alt='profile' className='profile-image' />
              )}
              {(!user.providerData[0].providerId || user.providerData[0].providerId !== 'google.com') && (
                <div className='plain-circle'></div>
              )}
              <p className='username'>{user.displayName}</p>
            </div>
            <button className='text-button logout-button' onClick={handleLogout}>
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
};

export default Navbarcommon;
