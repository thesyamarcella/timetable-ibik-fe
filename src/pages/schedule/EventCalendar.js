import React from 'react';

const EventCalendar = ({ events, onEditEvent }) => {
  return (
    <div>
      <h2>Calendar</h2>
      {events.map((event) => (
        <div key={event.id}>
          <div>Title: {event.title}</div>
          <div>Lecturer: {event.lecturer}</div>
          <div>Room: {event.room}</div>
          <div>Study Program: {event.studyProgram}</div>
          <div>Class Type: {event.classType}</div>
          <div>Time: {event.time}</div>
          <button onClick={() => onEditEvent(event)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default EventCalendar;
