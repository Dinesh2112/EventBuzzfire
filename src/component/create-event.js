import React, { useState, useEffect } from "react";
import { imgDB, txtDB, auth } from "./firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUser(user);
        } else {
          // Redirect to login if user is not authenticated
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [navigate]);

  const [eventData, setEventData] = useState({
    title: "",
    organizerName: "",
    organizerProfile: "",
    eventDescription: "",
    eventType: "",
    eventCategory: "",
    tags: [],
    location: {
      type: "venue",
      venue: {
        location: "",
        landmark: "",
      },
      online: "",
    },
    dateAndTime: {
      starts: "",
      ends: "",
    },
    coverPhoto: "",
    eventImages: [],
    ticketPrice: 0,
    ticketQuantity: 0,
    isFree: true,
  });

  const [enteredTag, setEnteredTag] = useState('');

  const [eventTypeOptions] = useState([
    "College Fest",
    "Musical Concert",
    "Night Club",
    "Standup Comedy",
  ]);

  const [eventCategoryOptions] = useState([
    "Competition",
    "Jamming",
    "Dancing",
    "Singing",
    "Other",
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "starts" || name === "ends") {
      setEventData((prevData) => ({
        ...prevData,
        dateAndTime: {
          ...prevData.dateAndTime,
          [name]: value,
        },
      }));
    } else if (name === "location") {
      setEventData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          venue: {
            ...prevData.location.venue,
            location: value,
          },
        },
      }));
    } else if (name === "landmark") {
      setEventData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          venue: {
            ...prevData.location.venue,
            landmark: value,
          },
        },
      }));
    } else if (name === "online") {
      setEventData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          online: value,
        },
      }));
    } else if (name === "tags") {
      setEnteredTag(value);
    } else if (name === "ticketPrice" || name === "ticketQuantity" || name === "isFree") {
      setEventData((prevData) => ({
        ...prevData,
        [name]: name === "isFree" ? !prevData.isFree : value,
      }));
    } else {
      setEnteredTag('');

      setEventData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLocationToggle = () => {
    setEventData((prevData) => {
      const isVenue = prevData.location?.type === "venue";
      const locationUpdates = isVenue
        ? { type: "online", online: prevData.location?.online || "" }
        : { type: "venue", venue: { location: "", landmark: "" } };

      return {
        ...prevData,
        location: {
          ...prevData.location,
          ...locationUpdates,
        },
      };
    });
  };

  const handleCoverPhotoUpload = (e) => {
    const coverPhotoFile = e.target.files[0];
    const coverPhotoRef = ref(imgDB, `coverPhotos/${v4()}`);
  
    uploadBytes(coverPhotoRef, coverPhotoFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setEventData((prevData) => ({
          ...prevData,
          coverPhoto: url,
        }));
      });
    });
  };
  
  const handleRemoveCoverPhoto = () => {
    setEventData((prevData) => ({
      ...prevData,
      coverPhoto: null,
    }));
  };

  const handleEventImagesUpload = (e) => {
    const eventImageFiles = e.target.files;
  
    for (let i = 0; i < eventImageFiles.length; i++) {
      const file = eventImageFiles[i];
      const eventImageRef = ref(imgDB, `eventImages/${v4()}`);
  
      uploadBytes(eventImageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setEventData((prevData) => ({
            ...prevData,
            eventImages: [...prevData.eventImages, { url, name: file.name }],
          }));
        });
      });
    }
  };
  
  const handleRemoveEventImage = (index) => {
    const updatedEventImages = [...eventData.eventImages];
    updatedEventImages.splice(index, 1);
    setEventData((prevData) => ({
      ...prevData,
      eventImages: updatedEventImages,
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = enteredTag.trim();
    if (trimmedTag && !eventData.tags.includes(trimmedTag)) {
      const newTags = [...eventData.tags, trimmedTag];
      setEventData((prevData) => ({
        ...prevData,
        tags: newTags,
      }));
      setEnteredTag('');
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...eventData.tags];
    updatedTags.splice(index, 1);
    setEventData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

  const handleTicketToggle = () => {
    setEventData((prevData) => ({
      ...prevData,
      ticketPrice: prevData.isFree ? 0 : "",
      ticketQuantity: 0,
      isFree: !prevData.isFree,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        // Redirect to login if the user is not authenticated
        navigate("/login");
        return;
      }

      const eventRef = collection(txtDB, `users/${user.uid}/events`);
      const newEventDoc = await addDoc(eventRef, {
        ...eventData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      const updatedUserEvents = Array.isArray(user.events) ? [...user.events, newEventDoc.id] : [newEventDoc.id];

      const userRef = doc(txtDB, "users", user.uid);
      await setDoc(userRef, {
        events: updatedUserEvents,
      }, { merge: true });

      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    }
  };

  if (!user) {
    // If the user is not authenticated, you may want to redirect them to the login page
    // This check might not be needed if the redirect is already handled in useEffect
    navigate("/login");
    return null;
  }

  return (
    <div className="create-event-container">
      
      <form className="event-form" onSubmit={handleSubmit}>
        <h1>Event Details</h1>
        <br></br>
        <h2 className="form-section-title">Name your event and tell event-goers why they should come.</h2> <h2>Add details that highlight what makes it unique.</h2>
        <label>
          Event Title:
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
            required
            className="event-input"
          />
        </label>
        <label>
          Organizer Name:
          <textarea
            name="organizerName"
            value={eventData.organizerName}
            onChange={handleInputChange}
            required
            className="event-input"
          />
        </label>
        <label>
          Organizer Profile:
          <textarea
            name="organizerProfile"
            value={eventData.organizerProfile}
            onChange={handleInputChange}
            required
            className="event-input"
          />
        </label>
        <label>
          Event Description:
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            onChange={handleInputChange}
            required
            className="event-input"
          />
        </label>
        <label>
          Event Type:
          <select
            name="eventType"
            value={eventData.eventType}
            onChange={handleInputChange}
            required
            className="event-input"
          >
            <option value="" disabled>Select Event Type</option>
            {eventTypeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Event Category:
          <select
            name="eventCategory"
            value={eventData.eventCategory}
            onChange={handleInputChange}
            required
            className="event-input"
          >
            <option value="" disabled>Select Event Category</option>
            {eventCategoryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tags:
          <div className="tags-container">
            {Array.isArray(eventData.tags) && eventData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(index)}>
                  X
                </button>
              </span>
            ))}
            <input 
              type="text"
              name="tags"
              value={enteredTag}
              onChange={handleInputChange}
              onKeyDown={handleTagInput}
              placeholder="Press Enter to add tags"
              className="tag-input"
            />
          </div>
        </label>

        <h2 className="form-section-title">Date and Time</h2>
        <label>
          Starts:
          <input
            type="datetime-local"
            name="starts"
            value={eventData.dateAndTime.starts}
            onChange={handleInputChange}
            required
            className="event-input"
          />
        </label>
        <label>
          Ends:
          <input
            type="datetime-local"
            name="ends"
            value={eventData.dateAndTime.ends}
            onChange={handleInputChange}
            required
            className="event-input"
          />
        </label>

        <h2 className="form-section-title">Location</h2>
        <label>
          <input
            type="radio"
            name="locationType"
            value="venue"
            checked={eventData.location?.type === "venue"}
            onChange={handleLocationToggle}
          />
          Venue:
          <input
            type="text"
            name="location"
            value={eventData.location?.venue?.location}
            onChange={handleInputChange}
            placeholder="Venue Location"
            className="event-input"
          />
          <input
            type="text"
            name="landmark"
            value={eventData.location?.venue?.landmark}
            onChange={handleInputChange}
            placeholder="Landmark"
            className="event-input"
          />
        </label>
        <label>
          <input
            type="radio"
            name="locationType"
            value="online"
            checked={eventData.location?.type === "online"}
            onChange={handleLocationToggle}
          />
          Online:
          <input
            type="text"
            name="online"
            value={eventData.location?.online}
            onChange={handleInputChange}
            placeholder="Online Link"
            className="event-input"
          />
        </label>

        <h2 className="form-section-title">Images</h2>
        <label>
  Cover Photo:
  <input
    type="file"
    accept="image/*"
    onChange={handleCoverPhotoUpload}
    className="event-input"
  />
  {eventData.coverPhoto && (
    <div className="uploaded-image">
      <span>{eventData.coverPhoto.name}</span>
      <button type="button" onClick={handleRemoveCoverPhoto}>
        Remove
      </button>
    </div>
  )}
</label>
        <label>
  Event Images:
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleEventImagesUpload}
    className="event-input"
  />
  <div className="uploaded-images-container">
    {eventData.eventImages.map((image, index) => (
      <div key={index} className="uploaded-image">
        <span>{image.name}</span>
        <button type="button" onClick={() => handleRemoveEventImage(index)}>
          Remove
        </button>
      </div>
    ))}
  </div>
</label>
        <div className="event-checkbox">
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="isFree"
              checked={!eventData.ticketPrice}
              onChange={() => handleTicketToggle()}
            />
            <span className="slider"></span>
          </label>
          <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
            {eventData.isFree ? 'Free' : 'Paid'}
          </span>
        </div>
        {!eventData.isFree && (
          <>
            <label>
              Ticket Price (INR):
              <input
                type="number"
                name="ticketPrice"
                value={eventData.ticketPrice}
                onChange={handleInputChange}
                required={!eventData.isFree}
                className="event-input"
              />
            </label>
            <label>
              Quantity of Tickets:
              <input
                type="number"
                name="ticketQuantity"
                value={eventData.ticketQuantity}
                onChange={handleInputChange}
                className="event-input"
              />
            </label>
          </>
        )}

        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;