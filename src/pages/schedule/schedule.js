import React, { useState } from 'react';
import EventCalendar from './EventCalendar';
import AddEventModal from './AddEventModal';
import FormModal from './FormModal';

const Schedule = () => {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAddEvent = () => {
    setShowAddEventModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEditEventModal(true);
  };

  const handleFormSubmit = (eventData) => {
    if (selectedEvent) {
      // Edit existing event
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...eventData } : event
      );
      setEvents(updatedEvents);
      setSelectedEvent(null);
    } else {
      // Add new event
      const newEvent = { id: Date.now(), ...eventData };
      setEvents([...events, newEvent]);
    }

    handleCloseModals();
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((event) => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setSelectedEvent(null);
    handleCloseModals();
  };

  const handleCloseModals = () => {
    setShowAddEventModal(false);
    setShowEditEventModal(false);
  };

  return (
    <div>
      <h1>Event Calendar</h1>
      <button onClick={handleAddEvent}>Add Event</button>
      <EventCalendar events={events} onEditEvent={handleEditEvent} />
      <AddEventModal
        show={showAddEventModal}
        handleClose={handleCloseModals}
        handleFormSubmit={handleFormSubmit}
      />
      <FormModal
        show={showEditEventModal}
        handleClose={handleCloseModals}
        selectedEvent={selectedEvent}
        handleFormSubmit={handleFormSubmit}
        handleDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default Schedule;
