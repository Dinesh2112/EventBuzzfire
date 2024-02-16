import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { imgDB, txtDB, auth } from "./firebase";
import { getDoc, getDocs, collection, query, where, doc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
//import { ref, equalTo, onValue, set } from 'firebase/storage'
import Navbarcommon from "./Navbarcomon";
import { useSelector } from 'react-redux';


const Events = () => {

  // Get Id of user logged in
  const userId = useSelector((state) => state.users.userID);
  
  console.log(userId)

  const [eventDetails, setEventDetails] = useState([]);

  
const getEventData = async() =>{
  try {
    const usersRef = collection(txtDB, 'users');
    const usersSnapshot = await getDocs(usersRef);

    const allEvents = [];

    for (const userDoc of usersSnapshot.docs) {
      const eventsRef = collection(userDoc.ref, 'events');
      const eventsSnapshot = await getDocs(eventsRef);

      eventsSnapshot.forEach((eventDoc) => {
        allEvents.push({ userId: userDoc.id, eventId: eventDoc.id, ...eventDoc.data() });
      });
    }

    setEventDetails(allEvents);
  }
  catch(err){
    console.log(err);
  }
}
  

  useEffect(() => {
    getEventData();
  }, [userId]);

  const logDetails = () =>{
    console.log(eventDetails);

  }

  return (
    <>
    <Navbarcommon/>
    
    <div className="events-page">
      {/* <button onClick={logDetails}>Get data</button> */}
      {eventDetails.map((event, index) => (
        <Link to={`/event/${event.title}`} key={index} className="event-card">
          <div className="event-card-img">
            {event.coverPhoto ? (
              <img src={event.coverPhoto} alt={event.title} />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
          <div className="event-card-details">
            <h3>{event.title}</h3>
            {/* Additional event details can be displayed here */}
          </div>
        </Link>
      ))}
    </div>
    </>
  );
};

export default Events;
