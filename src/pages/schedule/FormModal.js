import React, { useState } from 'react';

const FormModal = ({
  show,
  handleClose,
  selectedEvent,
  handleFormSubmit,
  handleDeleteEvent,
}) => {
  const [eventTitle, setEventTitle] = useState(selectedEvent ? selectedEvent.title : '');
  const [lecturer, setLecturer] = useState(selectedEvent ? selectedEvent.lecturer : '');
  const [room, setRoom] = useState(selectedEvent ? selectedEvent.room : '');
  const [studyProgram, setStudyProgram] = useState(selectedEvent ? selectedEvent.studyProgram : '');
  const [classType, setClassType] = useState(selectedEvent ? selectedEvent.classType : '');
  const [selectedTime, setSelectedTime] = useState(selectedEvent ? selectedEvent.time : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title: eventTitle,
      lecturer,
      room,
      studyProgram,
      classType,
      time: selectedTime,
    };
    handleFormSubmit(eventData);
  };

  return (
    <div style={{ display: show ? 'block' : 'none' }}>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <label>Title:</label>
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        {/* Rest of the form fields */}
        <button type="submit">Save</button>
        <button onClick={handleDeleteEvent}>Delete</button>
        <button onClick={handleClose}>Close</button>
      </form>
    </div>
  );
};

export default FormModal;
