import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  // Assuming you have a user object in your Redux state
  const user = useSelector((state) => state.users);

  // Check if the user object and its 'name' property are defined before accessing them
  const userName = user && user.name ? user.name : 'Guest';

  // Assuming you have an 'events' property in your user object
  const events = user && user.events ? user.events : [];

  return (
    <div>
      <h1>Welcome to your Dashboard, {userName}!</h1>
      <h2>Your Events:</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.title}</li>
            // Replace 'id' and 'title' with your actual event properties
          ))}
        </ul>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default Dashboard;
