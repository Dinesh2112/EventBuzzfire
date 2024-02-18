import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { imgDB, txtDB, auth } from "./firebase";
import { getDocs, collection } from "firebase/firestore";
import Navbarcommon from './Navbarcomon';
import { useSelector } from 'react-redux';

const Events = () => {
  const userId = useSelector((state) => state.users.userID);
  const [allEvents, setAllEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const getEventData = async () => {
    try {
      const usersRef = collection(txtDB, 'users');
      const usersSnapshot = await getDocs(usersRef);

      const allEventsData = [];

      for (const userDoc of usersSnapshot.docs) {
        const eventsRef = collection(userDoc.ref, 'events');
        const eventsSnapshot = await getDocs(eventsRef);

        eventsSnapshot.forEach((eventDoc) => {
          allEventsData.push({ userId: userDoc.id, eventId: eventDoc.id, ...eventDoc.data() });
        });
      }

      setAllEvents(allEventsData);
      setSearchResults(allEventsData); // Set initial search results
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEventData();
  }, [userId]);

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults(allEvents); // If the query is empty, show all events
      return;
    }

    const filteredEvents = allEvents.filter((event) =>
      (event.title && event.title.toLowerCase().includes(query.toLowerCase())) ||
      (event.eventDate && event.eventDate.toLowerCase().includes(query.toLowerCase())) ||
      (event.eventTags && event.eventTags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))) ||
      (event.eventCategory && event.eventCategory.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(filteredEvents);
  };

  return (
    <>
      <Navbarcommon onSearch={handleSearch} />

      <div className="events-page">
        {searchResults.map((event, index) => (
          <Link to={`/event/${event.userId}/${event.eventId}`} key={index} className="event-card">
            <div className="event-card-img">
              {event.coverPhoto ? (
                <img className="event-img" src={event.coverPhoto} alt={event.title} />
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
