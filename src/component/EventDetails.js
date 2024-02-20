import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbarcommon from './Navbarcomon';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getDoc, doc } from 'firebase/firestore';
import { txtDB } from './firebase';
import Footer from './footer';
import PaymentGateway from './PaymentGateway';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

const EventDetails = () => {
  const { userId, eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [userInfo, setUserInfo] = useState({ name: '', phoneNumber: '' });
  const [showPopup, setShowPopup] = useState(false);

  // Script loading function (adds it on top of the screen)
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Loads Razorpay script
  useEffect(() => {
    async function initializeRazorpay() {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
      }
    }

    initializeRazorpay();
  }, []);

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

  const handleQuantityChange = (event) => {
    const quantity = parseInt(event.target.value, 10);
    setSelectedTickets(quantity);
  };

  const handlePaymentInitiation = () => {
    // Open the popup to collect name and phone number
    setShowPopup(true);
  };

  const handlePopupSubmit = async () => {
    // Validate phone number
    const phoneNumberRegex = /^[0-9]+$/;
    if (!userInfo.phoneNumber.match(phoneNumberRegex)) {
      alert('Please enter a valid phone number with only digits.');
      return;
    }
  
    setShowPopup(false);
  
    // Create a document in the userTicketDetails collection
    try {
      const ticketDetailsDocRef = await addDoc(collection(db, 'userTicketDetails'), {
        userId,
        eventId,  // Add eventId to the document data
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        eventTitle: eventData.title,
        amountPaid: eventData.ticketPrice * selectedTickets,
        ticketQuantity: selectedTickets,
      });
  
      console.log('Ticket details stored successfully. Document ID:', ticketDetailsDocRef.id);
  
      // Now proceed to payment
      PaymentGateway({
        totalCostInPaisa: eventData.ticketPrice * selectedTickets * 100,
        userInfo: userInfo,
      });
    } catch (error) {
      console.error('Error storing ticket details:', error);
    }
  };

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
              <div className='ticket-details'>
                <div className='ticket-info'>
                  <h2 className='ticket-price'>Price: ₹{eventData.ticketPrice}</h2>
                  <h2 className='available-quantity'>Available Quantity: {eventData.ticketQuantity}</h2>
                </div>
              </div>
              <div className='checkout-section'>
                <h2 className='Ticket-label'>Ticket Quantity:</h2>
                <div className='Ticket-input'>
                  <button
                    className='Ticket-minus-btn'
                    onClick={() => setSelectedTickets((prev) => Math.max(prev - 1, 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className='Ticket-input-field'
                    value={selectedTickets || 1} 
                    onChange={handleQuantityChange}
                  />
                  <button
                    className='Ticket-plus-btn'
                    onClick={() => setSelectedTickets((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <h2 className='total-price'>Total: ₹{(eventData.ticketPrice * selectedTickets).toFixed(2)}</h2>
                <button className='book-now-btn' onClick={handlePaymentInitiation}>
                  Check out for ₹{(eventData.ticketPrice * selectedTickets).toFixed(2)}
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Popup for collecting name and phone number */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>Enter Your Details</h2>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              value={userInfo.phoneNumber}
              onChange={(e) => {
                // Validate and allow only numbers
                if (/^[0-9]*$/.test(e.target.value)) {
                  setUserInfo({ ...userInfo, phoneNumber: e.target.value });
                }
              }}
            />
            <button onClick={handlePopupSubmit}>Submit</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default EventDetails;