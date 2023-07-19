import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Typeahead } from 'react-bootstrap-typeahead';
import { FormGroup, Label, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import { FcInfo } from 'react-icons/fc';


export default function Jadwal() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [filterLecturer, setFilterLecturer] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/classtypes")
      .then((response) => setClassTypes(response.data))
      .catch((error) => console.error("Error fetching class types:", error));

    axios
      .get("http://localhost:3000/api/lecturers")
      .then((response) => setLecturers(response.data))
      .catch((error) => console.error("Error fetching lecturers:", error));

    axios
      .get("http://localhost:3000/api/rooms")
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [filterClass, filterLecturer, filterRoom]);

  function fetchEvents() {
    axios
      .get("http://localhost:3000/api/schedules")
      .then((response) => {
        const events = response.data.map((schedule) => ({
          id: schedule.id,
          title: schedule.title,
          start: new Date(schedule.start),
          end: new Date(schedule.end),
          isHoliday: schedule.isHoliday,
          extendedProps: {
            lecturer: schedule.lecturerId,
            room: schedule.roomId,
            semester: schedule.Semester ? schedule.Semester.name : "",
            classType: schedule.classTypeId,
            studyProgram: schedule.StudyProgram ? schedule.StudyProgram.name : "",
          },
        }));

        const filteredEvents = events.filter((event) => {
          if (filterClass && event.extendedProps.classType !== parseInt(filterClass)) {
            return false;
          }

          if (filterLecturer && event.extendedProps.lecturer !== parseInt(filterLecturer)) {
            return false;
          }

          if (filterRoom && event.extendedProps.room !== parseInt(filterRoom)) {
            return false;
          }

          return true;
        });

        setCurrentEvents(filteredEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }

  const isFullscreen = window.innerWidth > 768; 

  const dayHeaderContent = (args) => {
    const weekdayFormat = isFullscreen ? "long" : "short";
    return (
      <div style={{ ttextDecoration: "none", color: "black", pointerEvents: "none" }}>
        {args.date.toLocaleString("default", { weekday: weekdayFormat })}
      </div>
    );
  };

  function renderEventContent(eventInfo) {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const eventStart = eventInfo.event.start.toLocaleTimeString([], options);
    const eventEnd = eventInfo.event.end.toLocaleTimeString([], options);
  
    const selectedLecturer = lecturers.find((lecturer) => lecturer.id === eventInfo.event.extendedProps.lecturer);
    const selectedRoom = rooms.find((room) => room.id === eventInfo.event.extendedProps.room);
  
    const isHoliday = eventInfo.event.extendedProps.isHoliday;
    
    const eventClassName = isHoliday ? "is-holiday" : "";
  
    return (
      <div className={`p-1 ${eventClassName}`}>
        <i style={{ color: "black" }}>
          <strong>{eventInfo.event.title}</strong>
          <p style={{ fontSize: "0.8rem" }}>{selectedLecturer ? selectedLecturer.name : ""}</p>
          <p style={{ fontSize: "0.8rem" }}>{selectedRoom ? selectedRoom.name : ""} | {eventStart} - {eventEnd}</p>
        </i>
      </div>
    );
  }
  
  

  
  
  const handleFilterClass = (e) => {
    setFilterClass(e.target.value);
  };

  const handleFilterLecturer = (e) => {
    setFilterLecturer(e.target.value);
  };

  const handleFilterRoom = (e) => {
    setFilterRoom(e.target.value);
  };

  return (
    <div className="px-5">

    <div className="d-flex justify-content-between align-items-center">
      <h4 className="my-3">IBIKtimetable</h4>
    </div>
      <div className="info-container mb-3">
        <p> <FcInfo/> Silahkan filter jadwal sesuai yang dibutuhkan, Card berwarna <b>merah</b> menandakan bahwa kelas libur, dan <b>biru</b> bahwa kelas masuk </p>
      </div>
      <div className="row justify-content-center">
  <FormGroup className="col">
    <Input
      type="select"
      name="filterClass"
      id="filterClass"
      value={filterClass}
      onChange={handleFilterClass}
      style={{ width: '350px', margin: '0 auto' }}
    >
      <option value="">Semua Kelas</option>
      {classTypes.map((classType) => (
        <option key={classType.id} value={classType.id}>
          {classType.name}
        </option>
      ))}
    </Input>
  </FormGroup>

  <FormGroup className="col">
    <Input
      type="select"
      name="filterLecturer"
      id="filterLecturer"
      value={filterLecturer}
      onChange={handleFilterLecturer}
      style={{ width: '350px', margin: '0 auto' }}
    >
      <option value="">Semua Dosen</option>
      {lecturers.map((lecturer) => (
        <option key={lecturer.id} value={lecturer.id}>
          {lecturer.name}
        </option>
      ))}
    </Input>
  </FormGroup>

  <FormGroup className="col">
    <Input
      type="select"
      name="filterRoom"
      id="filterRoom"
      value={filterRoom}
      onChange={handleFilterRoom}
      style={{ width: '350px', margin: '0 auto' }}
    >
      <option value="">Semua Ruangan</option>
      {rooms.map((room) => (
        <option key={room.id} value={room.id}>
          {room.name}
        </option>
      ))}
    </Input>
  </FormGroup>
</div>


      <FullCalendar
        height="auto"
        contentHeight="auto"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        dayMaxEvents={true}
        hiddenDays={[0]}
        weekends={weekendsVisible}
        dayHeaderContent={dayHeaderContent}
        eventContent={renderEventContent}
        eventClassNames={(arg) => {
        const isHoliday = arg.event.extendedProps.isHoliday;
        const eventClassName = isHoliday ? "is-holiday" : "";
        return [eventClassName];
      }}
        initialDate="2023-10-01"
        validRange={{
          start: "2023-10-01",
          end: "2023-10-08"
        }}
        headerToolbar={null}
        buttonText={{
          today: "current",
          month: "month",
          week: "week",
          day: "day",
          list: "list"
        }}
        events={currentEvents}
        slotMinTime="07:30:00"
        slotMaxTime="22:00:00"
        className="full-width-calendar"
      />
    </div>
  );
}
