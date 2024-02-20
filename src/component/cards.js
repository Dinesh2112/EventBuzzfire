import React ,{ useEffect, useState }from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { imgDB, txtDB, auth } from "./firebase";
import { getDocs, collection } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);
export default function Cards(props) {
  
  // State to store all events data
  const [topEvents, setTopEvents] = useState([]);
  const [topEventsInfo, setTopEventsInfo] = useState([]);

  // Fetch the top 3 most booked events
  useEffect(() =>{

    const fetchData = async() =>{
      const ticketRef = collection(txtDB, 'userTicketDetails');
      const ticketSnapshot = await getDocs(ticketRef);

      // Initialize an empty object to store the count of bookings and total ticket quantity for each event
      const eventCounts = {};

      // Loop through each user's ticket details
      for (const userDoc of ticketSnapshot.docs) {
        const userTicketDetails = userDoc.data();
        const eventId = userTicketDetails.eventId;
        const ticketQuantity = userTicketDetails.ticketQuantity || 1; // Default to 1 if ticketQuantity is not provided

        // Increment the count and total ticket quantity for this event
        eventCounts[eventId] = eventCounts[eventId] || { count: 0, totalTicketQuantity: 0 };
        eventCounts[eventId].count += 1;
        eventCounts[eventId].totalTicketQuantity += ticketQuantity;
      }

      // Convert the object into an array of objects for easier sorting
      const eventCountsArray = Object.keys(eventCounts).map((eventId) => ({
        eventId,
        count: eventCounts[eventId].count,
        totalTicketQuantity: eventCounts[eventId].totalTicketQuantity,
      }));

      // Sort the array in descending order based on the total ticket quantity
      eventCountsArray.sort((a, b) => b.totalTicketQuantity - a.totalTicketQuantity);

      // Get the top 3 events with the highest total ticket quantity
      const top3Events = eventCountsArray.slice(0, 3);

      console.log(top3Events);

      // Fetch top 3 event details
      const usersRef = collection(txtDB, 'users');
      const usersSnapshot = await getDocs(usersRef);
  
      const topEventsData = [];
  
      for (const userDoc of usersSnapshot.docs) {
        const eventsRef = collection(userDoc.ref, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
  
        eventsSnapshot.forEach((eventDoc) => {
          const event = top3Events.find((e) => e.eventId === eventDoc.id);
          if (event) {
            topEventsData.push({eventId: eventDoc.id, ...eventDoc.data()});
          }
        });
      }
  
      // Assuming you have a state variable to store the top events
      setTopEventsInfo(topEventsData);



  }
    

    fetchData();

    console.log("This has been fetched")

  }, []);



  useEffect(() =>{
    console.log(topEventsInfo);
  })

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
        <Link to='/events'>
          <button className='explr-btn'>Explore events</button>
          </Link>
     

{topEventsInfo.map((event, index) => (
                <Link to={`/event/${event.userId}/${event.eventId}`} key={index} className="spotlight-card">
                <div className="event-card-img">
                  {event.coverPhoto ? (
                    <img className="event-img" src={event.coverPhoto} alt={event.title} />
                  ) : (
                    <p>No Image Available</p>
                   
                  )} 
                  
                </div>
                <div className="overlay-card">
                <h3 className='card-event-title'>{event.title}</h3>
                  
                  {/* Additional event details can be displayed here */}
                </div>
              </Link>
          ))}


        </div>
        </div>
  </>
  )
}
