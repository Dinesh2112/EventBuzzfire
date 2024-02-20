import React, { useEffect, useState } from 'react';
import Navbarcommon from './Navbarcomon';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useParams } from 'react-router-dom';

const Dashboard = ({ history }) => {
  const { userId } = useParams();
  const [userTicketDetails, setUserTicketDetails] = useState([]);

  useEffect(() => {
    const fetchUserTicketDetails = async () => {
      try {
        if (!userId) {
          console.error('User ID is missing. Redirecting to login.');
          history?.push('/login');
          return;
        }

        // Adjusted query to get ticket details based on the user's document ID
        const q = query(collection(db, 'userTicketDetails'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const ticketDetailsData = [];
        querySnapshot.forEach((doc) => {
          const { eventId, ...rest } = doc.data();  // Extract eventId
          ticketDetailsData.push({ ticketId: doc.id, eventId, ...rest });  // Include eventId in the data
        });

        setUserTicketDetails(ticketDetailsData);
      } catch (error) {
        console.error('Error fetching user ticket details:', error);
        history?.push('/login');
      }
    };

    fetchUserTicketDetails();
  }, [userId, history]);

  return (
    <>
      <nav>
        <Navbarcommon />
      </nav>
      <div className="dashboard-container">
        <div className='dasboard-table'>
          <h1>Your Ticket Details</h1>
          {userTicketDetails.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Event Title</th>
                  
                  <th>Amount Paid (₹)</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Ticket Quantity</th>
                </tr>
              </thead>
              <tbody>
                {userTicketDetails.map((ticket) => (
                  <tr key={ticket.ticketId}>
                    <td>{ticket.eventTitle}</td>
                    
                    <td>{ticket.amountPaid}</td>
                    <td>{ticket.name}</td>
                    <td>{ticket.phoneNumber}</td>
                    <td>{ticket.ticketQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No ticket details found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;