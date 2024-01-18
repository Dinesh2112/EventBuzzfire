import React, { useEffect } from 'react';
import logo from "./logo.png";
import bgvideo from "./bgvideo.mp4";
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  useEffect(() => {
    // Cursor manipulation script
    var crsr = document.querySelector(".cursor");
    var crsrblr = document.querySelector(".cursor-blr");
  
    if (crsr && crsrblr) {
      document.addEventListener("mousemove", function (dets) {
        crsr.style.left = dets.x + "px";
        crsr.style.top = dets.y + "px";
        crsrblr.style.left = dets.x - 100 + "px"; 
        crsrblr.style.top = dets.y - 100 + "px"; 
      });
    }
  
    // GSAP animation for the navigation bar
    gsap.to(".nav", {
      backgroundColor: "#000",
      height: "110px",
      duration: 0.5,
      scrollTrigger: {
        trigger: ".nav",
        scroller: "body",
        start: "top -10%",
        end: "top -11%",
        scrub: 1
      }
    });
  }, []);

  return (
    <>
      <div className='nav'>
        <img src={logo} className='logo' alt='/' />

        <div className='search-bar'>
          <input type='text' placeholder='Search...' />
        </div>

        <div className='menu-items'>
          <a href='/'><h4>HOME</h4></a>
          <a href='/'><h4>EVENTS</h4></a>
          <a href='/'><h4>CREATE EVENT</h4></a>
          <a href='/'><button className='text-button'>LOGIN</button></a>
          <a href='/'><button className='text-button'>SIGNUP</button></a>
        </div>
      </div>

      <div className='cursor'></div>
      <div className='cursor-blr'></div>

      <video autoPlay loop muted src={bgvideo} />
    </>
  );
}