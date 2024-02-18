import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbarcommon from './Navbarcomon';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getDoc, doc } from 'firebase/firestore';
import { txtDB } from './firebase';
import Footer from './footer';


const EventDetails = () => {
  const { userId, eventId } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventQuery = doc(txtDB, 'users', userId, 'events', eventId);
        const eventSnapshot = await getDoc(eventQuery);

        if (eventSnapshot.exists()) {
          setEventData(eventSnapshot.data());
        } else {
          console.log('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [userId, eventId]);

  const formatEventStartTime = (startTime) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(startTime).toLocaleString('en-US', options);
  };

  const NextArrow = ({ onClick }) => (
    <div className="slick-arrow next-arrow" onClick={onClick}>
      &#9654; {/* Unicode for right-pointing arrow */}
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow prev-arrow" onClick={onClick}>
      &#9664; {/* Unicode for left-pointing arrow */}
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  const [selectedTickets, setSelectedTickets] = useState(1);
  return (
    <>
      <nav><Navbarcommon /></nav>
      <div className="event-info">
        {eventData ? (
          <>
            {eventData.coverPhoto && (
              <div className="event-container">
                {eventData.eventImages && eventData.eventImages.length > 0 ? (
                  <Slider {...settings} className="custom-carousel">
                    <div>
                      <img src={eventData.coverPhoto} alt="Cover" />
                    </div>
                    {eventData.eventImages.map((image, index) => (
                      <div key={index}>
                        {typeof image === 'string' ? (
                          <img src={image} alt={`Image ${index + 1}`} />
                        ) : (
                          <img src={image.url} alt={`Image ${index + 1}`} />
                        )}
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img src={eventData.coverPhoto} alt="Cover" />
                )}
              </div>
            )}
            {eventData.dateAndTime && (
              <h3 className='event-start-time'> {formatEventStartTime(eventData.dateAndTime.starts)}</h3>
            )}
            <h1>Event Title: {eventData.title}</h1>
            {eventData.organizerName && (
              <h2 className='event-organizer'>Event Creators: {eventData.organizerName}</h2>
            )}
            {eventData.organizerProfile && (
              <h2 className='event-profile'>Organized by: {eventData.organizerProfile}</h2>
            )}
            {eventData.dateAndTime && (
              <>
                <h3 className='event-date'>Event Start Date: {formatEventStartTime(eventData.dateAndTime.starts)}</h3>
                <h3 className='event-date'>Event End Date: {formatEventStartTime(eventData.dateAndTime.ends)}</h3>
              </>
            )}
            {eventData.eventDescription && (
              <h2 className='event-description'>About Event: <p className='event-about'>{eventData.eventDescription}</p></h2>
            )}

            {eventData.location && (
              <>
                <h2 className='location-heading'>Location:</h2>
                {eventData.location.type === 'venue' && (
                  <div className='venue-location'>
                    <p className='location-type'>&#127968;</p> {/* Unicode for building symbol */}
                    <p className='full-location'>{eventData.location.venue.location}</p>
                    <p className='landmark'>Landmark: {eventData.location.venue.landmark}</p>
                  </div>
                )}
                {eventData.location.type === 'onlinee' && (
                  <p className='online-location'>Online Event:{eventData.location.onlinee.online}</p>
                )}
              </>
            )}
            <div className='ticket-section'>
      <h2 className='ticket-heading'>Tickets:</h2>
      <h2 className='ticket-info'>Price:₹{eventData.ticketPrice}</h2>
      <h2 className='ticket-info'>Available Quantity: {eventData.ticketQuantity}</h2>
      <button className='book-now-btn'>Book Now</button>
    </div>

          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default EventDetails;
