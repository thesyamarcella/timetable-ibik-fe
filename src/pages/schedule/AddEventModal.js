import React, { useState } from 'react';

const AddEventModal = ({ show, handleClose, handleFormSubmit }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [room, setRoom] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [classType, setClassType] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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
      <h2>Add Event</h2>
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
        <button onClick={handleClose}>Close</button>
      </form>
    </div>
  );
};

export default AddEventModal;
