import React ,{ useEffect }from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);
export default function Cards() {
  
    // Animation for cards-container
    useEffect(() => {
      gsap.from('.cards-container', {
        backgroundColor: "#000",
        scrollTrigger: {
          trigger: ".cards-container",
          scroller: "body",
          start: "top -25%",
          end: "top -100%",
          scrub: 2,
        },
      });
      
      gsap.from('.green-div', {
        backgroundColor: "#000",
        scrollTrigger: {
          trigger: ".green-div",
          scroller: "body",
          start: "top -25%",
          end: "top -100%",
          scrub: 2,
        },
      });

      
  
      gsap.from('.redirect-cards', {
        backgroundColor: "#000",
        scrollTrigger: {
          trigger: ".redirect-cards",
          scroller: "body",
          start: "top -25%",
          end: "top -70%",
          scrub: 2,
        },
      });
    }, []);

    
  return (
    <>
    <div className='main1'>
    <div className=' cards-container'>
      <h1 className='mood'>WHAT YOUR MOOD ?</h1>
      <div className='card' id='card1'>
        <div className='overlay'>
        <Link to="/events?type=collegefest" className="card" id="card1">
          <h4>COLLEGE FEST </h4>
        
        <p>Explore the College Fest according to you with your friends </p>
        </Link>
      </div></div>
      
      <div className='card' id='card2'>
      <div className='overlay'>
      <Link to="/events?type=nightclubs" className="card" id="card2">
        <h4>Night Clubs </h4>
        <p>Explore the Night Club according to you with your friends </p>
        </Link>
      </div>
      </div>
      <div className='card' id='card3'>
      <div className='overlay'>
      <Link to="/events?type=musicalconcert" className="card" id="card3">
        <h4>Muscical Concert </h4>
        <p>Explore the Musical concert according to you with your friends </p>
        </Link>
      </div>
      </div>
    
    </div>
    <div className="green-div">
          <img
            src="https://eiwgew27fhz.exactdn.com/wp-content/themes/puttosaurus/img/dots-side.svg"
            alt=""
          />
          <h4>
            SIGN UP FOR THE NEW EVENTS AROUND YOU AND ENJOY WITH YOUR FRIENDS
          </h4>
          <img
            src="https://eiwgew27fhz.exactdn.com/wp-content/themes/puttosaurus/img/dots-side.svg"
            alt=""
          />
        </div>

        <div className='redirect-cards'>
        <h1 className='spotlight'>EVENTS IN SPOTLIGHT</h1>
        <button className='explr-btn'>Explore events</button>
      <div className='spotlight-card' id='spotlight-card1'>
        <div className='overlay'>
        <h4>COLLEGE FEST </h4>
        <p>Explore the College Fest according to you with your friends </p>
      </div></div>
      
      <div className='spotlight-card' id='spotlight-card2'>
      <div className='overlay'>
        <h4>Night Clubs </h4>
        <p>Explore the Night Club according to you with your friends </p>
      </div>
      </div>
      <div className='spotlight-card' id='spotlight-card3'>
      <div className='overlay'>
        <h4>Muscical Concert </h4>
        <p>Explore the Musical concert according to you with your friends </p>
      </div>
      </div>


        </div>
        </div>
  </>
  )
}
