import React, {  useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import logo from './logo.png';
import bgvideo from './bgvideo.mp4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    var crsr = document.querySelector('.cursor');
    var crsrblr = document.querySelector('.cursor-blr');

    if (crsr && crsrblr) {
      document.addEventListener('mousemove', function (dets) {
        crsr.style.left = dets.x + 'px';
        crsr.style.top = dets.y + 'px';
        crsrblr.style.left = dets.x - 100 + 'px';
        crsrblr.style.top = dets.y - 100 + 'px';
      });
    }

    gsap.to('.nav', {
      backgroundColor: '#000',
      height: '110px',
      duration: 0.5,
      scrollTrigger: {
        trigger: '.nav',
        scroller: 'body',
        start: 'top -10%',
        end: 'top -11%',
        scrub: 1,
      },
    });

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
    <>
      <div className='nav'>
        <img src={logo} className='logo' alt='/' />

        {/* <div className='search-bar'>
          <input type='text' placeholder='Search...' />
        </div> */}

        <div className='menu-items'>
          <Link to='/'>
            <h4>HOME</h4>
          </Link>
          <Link to='/events'>
            <h4>EVENTS</h4>
          </Link>
          {/* <Link to='/create-event'> */}
            <h4 onClick={handleCreateEvent}>CREATE EVENT</h4>
          {/* </Link> */}

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

      <div className='cursor'></div>
      <div className='cursor-blr'></div>

      <video autoPlay loop muted src={bgvideo} />
    </>
  );
}