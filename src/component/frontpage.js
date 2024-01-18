import React ,{ useEffect }from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);
export default function Frontpage() {
  useEffect(() => {
    gsap.to(".common-background", {
      backgroundColor: "#000",
      scrollTrigger: {
        trigger: ".common-background",
        scroller: "body",
        start: "top -25%",
        end: "top -70%",
        scrub: 2,
      },
    });
  }, []); 
  
  return (
    <>
    <div className='common-background'>
    <div className='main'>
        <div className='page1'>
            <h1>DISCOVER NEW EVENTS AROUND YOU</h1>
            <h4>Explore hundreds of music festivals with our comprehensive guide,</h4> 
            <h4>featuring past lineups, set times, ticket prices, festival maps, and latest news.</h4>
            <button>Explore now</button>
        </div>

        <div className='page2'>
          <div className='scroller'>
            <div className='scroller-in'>
            <h4>WHAT</h4> 
            <h4>ARE </h4>
            <h4>YOU</h4> 
            <h4>WAITING </h4>
            <h4>FOR </h4>
            <h4>GO </h4>
            <h4>BOOK </h4>
            <h4> AN </h4>
            <h4>EVENT </h4>
            <h4>AND </h4>
            <h4>ENJOY </h4>
            <h4>WITH </h4>
            <h4>YOUR</h4> 
            <h4>FRIENDS</h4>
            </div>
            <div className='scroller-in'>
            <h4>WHAT</h4> 
            <h4>ARE </h4>
            <h4>YOU</h4> 
            <h4>WAITING </h4>
            <h4>FOR </h4>
            <h4>GO </h4>
            <h4>BOOK </h4>
            <h4> AN </h4>
            <h4>EVENT </h4>
            <h4>AND </h4>
            <h4>ENJOY </h4>
            <h4>WITH </h4>
            <h4>YOUR</h4> 
            <h4>FRIENDS</h4>
            </div>
          
          </div>
        </div>





    </div>
    </div>
    
    
    </>
  )
}
