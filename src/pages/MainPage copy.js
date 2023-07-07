import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import CustomNavbar from "../component/Sidebar/Navbar";

export default function () {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

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
            lecturer: schedule.Lecturer ? schedule.Lecturer.name : "",
            room: schedule.Room ? schedule.Room.name : "",
            semester: schedule.Semester ? schedule.Semester.name : "",
            classType: schedule.ClassType ? schedule.ClassType.name : "",
            studyProgram: schedule.StudyProgram ? schedule.StudyProgram.name : "",
          },
        }));
        setCurrentEvents(events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }

  const renderEventContent = (eventInfo) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const eventStart = eventInfo.event.start.toLocaleTimeString([], options);
    const eventEnd = eventInfo.event.end.toLocaleTimeString([], options);

    return (
      <div>
        <i>
          <strong>{eventInfo.event.title}</strong>
          <p>{eventInfo.event.extendedProps.lecturer}</p>
          <p>{eventInfo.event.extendedProps.room}</p>
          <p>{eventStart} - {eventEnd}</p>
        </i>
      </div>
    );
  };

  return (
    <div className="main-container mx-2 mt-2">
      <CustomNavbar />
      <div className="page-content">
        <div className="container-fluid">
          <h5>Jadwal</h5>
          <div>
            <Container>
              <FullCalendar
                height="auto"
                contentHeight="auto"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                editable={false}
                selectable={false}
                selectMirror={false}
                dayMaxEvents={true}
                hiddenDays={[0]}
                weekends={weekendsVisible}
                headerToolbar={null}
                buttonText={{
                  today: "Hari Ini",
                  month: "Bulan",
                  week: "Minggu",
                  day: "Hari",
                  list: "Agenda"
                }}
                events={currentEvents}
                eventContent={renderEventContent}
                validRange={{
                  start: "2023-10-01",
                  end: "2023-10-08"
                }}
                slotMinTime="07:30:00"
                slotMaxTime="22:00:00"
                className="full-width-calendar"
              />
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
