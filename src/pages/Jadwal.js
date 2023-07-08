import React, { useState, useRef, useEffect } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { nanoid } from "nanoid";
import { Container, Row, Col, Button } from "reactstrap";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "./custom.css";
import axios from "axios";

import events from "./events";
import CustomModal from "./component/CustomModal";
import CustomNavbar from "../component/Sidebar/Navbar";

export default function Jadwal() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const calendarRef = useRef(null);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date("2023-10-01"));
  const [end, setEnd] = useState(new Date("2023-10-07"));
  const [isHoliday, setIsHoliday] = useState(false);
  const [lecturer, setLecturer] = useState("");
  const [room, setRoom] = useState("");
  const [semester, setSemester] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [classtype, setClasstype] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);


  const isFullscreen = window.innerWidth > 768; // Menggunakan breakpoint 768px sebagai pemisah layar penuh dan layar kecil

  const dayHeaderContent = (args) => {
    const weekdayFormat = isFullscreen ? "long" : "short";
    return (
      <div style={{ ttextDecoration: "none", color: "black", pointerEvents: "none" }}>
        {args.date.toLocaleString("default", { weekday: weekdayFormat })}
      </div>
    );
  };
  

useEffect(() => {
  axios
    .get("http://localhost:3000/api/lecturers")
    .then((response) => setLecturers(response.data))
    .catch((error) => console.error("Error fetching lecturers:", error));

  axios
    .get("http://localhost:3000/api/rooms")
    .then((response) => setRooms(response.data))
    .catch((error) => console.error("Error fetching rooms:", error));

  axios
    .get("http://localhost:3000/api/semesters")
    .then((response) => setSemesters(response.data))
    .catch((error) => console.error("Error fetching semesters:", error));

  axios
    .get("http://localhost:3000/api/studyprograms")
    .then((response) => setStudyPrograms(response.data))
    .catch((error) => console.error("Error fetching study programs:", error));

  axios
    .get("http://localhost:3000/api/classtypes")
    .then((response) => setClassTypes(response.data))
    .catch((error) => console.error("Error fetching class types:", error));
}, []);





const handleCloseModal = () => {
  handleClose();
  setModal(false);
};


  function handleDateClick(arg) {
    // bind with an arrow function
    // console.log(arg.dateStr);
  }

  function handleDateSelect(selectInfo) {
    if (
      selectInfo.view.type === "timeGridWeek" ||
      selectInfo.view.type === "timeGridDay"
    ) {
      selectInfo.view.calendar.unselect();
      setState({ selectInfo, state: "create" });
      setStart(selectInfo.start);
      setEnd(selectInfo.end);
      setModal(true);
    }
  }

  function renderEventContent(eventInfo) {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const eventStart = eventInfo.event.start.toLocaleTimeString([], options);
    const eventEnd = eventInfo.event.end.toLocaleTimeString([], options);
    const lecturerId = eventInfo.event.lecturerId;
    const roomId = eventInfo.event.roomId;
  
    // Find lecturer by ID
    const lecturer = lecturers.find((lecturer) => lecturer.id === lecturerId);
  
    // Find room by ID
    const room = rooms.find((room) => room.id === roomId);
  
    return (
      <div className="p-1">
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "#333",
            maxWidth: "100px",
          }}
        >
          <strong>{eventInfo.event.title}</strong>
          <p>{eventInfo.event.extendedProps.lecturer}</p>
          <p style={{ fontSize: "10px" }}>{eventInfo.event.extendedProps.room} | {eventStart} - {eventEnd}</p>
        </div>
      </div>
    );
  }
  
  function handleEventClick(clickInfo) {
    const event = clickInfo.event;
  
    setState({ clickInfo, state: "update" });
    setClickedEvent(event);
    setTitle(event.title);
    setStart(event.start);
    setEnd(event.end);
    setIsHoliday(event.extendedProps.isHoliday);
    setLecturer(event.extendedProps.lecturer);
    setRoom(event.extendedProps.room);
    setSemester(event.extendedProps.semester);
    setStudyProgram(event.extendedProps.studyProgram);
    setClasstype(event.extendedProps.classType);
    setModal(true);
  }
  

  useEffect(() => {
    handleEvents();
  }, []);
  
  function handleEvents() {
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

  function handleEventDrop(checkInfo) {
    const { event } = checkInfo;
    const newStart = checkInfo.event.start;
    const newEnd = checkInfo.event.end;
  
    axios
      .put(`http://localhost:3000/api/schedules/${event.id}`, {
        ...event.extendedProps, // Menyertakan data acara lama kecuali start dan end
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
      })
      .then((response) => {
        console.log("Event updated:", response.data);
        // ...
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        // ...
      });
  }
  
  function handleEventResize(checkInfo) {
    const { event } = checkInfo;
    const newStart = checkInfo.event.start;
    const newEnd = checkInfo.event.end;
  
    axios
      .put(`http://localhost:3000/api/schedules/${event.id}`, {
        ...event.extendedProps, // Menyertakan data acara lama kecuali start dan end
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
      })
      .then((response) => {
        console.log("Event updated:", response.data);
        // ...
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        // ...
      });
  }
  

  function handleEdit() {
    if (!state.clickInfo || !state.clickInfo.event || !start || !end) {
      console.error("Invalid data for editing event");
      return;
    }
  
    const { event } = state.clickInfo;
    const newStart = start || event.start;
    const newEnd = end || event.end;
  
    event.setDates(newStart, newEnd);
    event.setProp("title", title);
  
    axios
      .put(`http://localhost:3000/api/schedules/${event.id}`, {
        title: title,
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
        isHoliday: isHoliday,
        lecturerId: parseInt(lecturer),
        semesterId: parseInt(semester),
        classTypeId: parseInt(classtype),
        roomId: parseInt(room),
        studyProgramId: parseInt(studyProgram),
      })
      .then((response) => {
        const updatedSchedule = response.data;
        console.log("Updated schedule:", updatedSchedule);
        handleClose();
      })
      .catch((error) => {
        console.error("Error updating schedule:", error);
        // Rollback event changes if update fails
        event.setDates(state.clickInfo.oldStart, state.clickInfo.oldEnd);
        event.setProp("title", state.clickInfo.oldTitle);
      });
  }
  
  function handleSubmit() {
    axios
    .post("http://localhost:3000/api/schedules", {
      title: title,
      start: start,
      end: end,
      isHoliday: isHoliday,
      lecturerId: parseInt(lecturer),
      semesterId: parseInt(semester),
      classTypeId: parseInt(classtype),
      roomId: parseInt(room),
      studyProgramId: parseInt(studyProgram),
    })
    .then((response) => {
      const createdSchedule = response.data;
      console.log("Created schedule:", createdSchedule);
  
      let calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent({
        id: createdSchedule.id,
        title: createdSchedule.title,
        start: new Date(createdSchedule.start),
        end: new Date(createdSchedule.end),
        isHoliday: createdSchedule.isHoliday,
        extendedProps: {
          lecturer: createdSchedule.Lecturer ? createdSchedule.Lecturer.name : "",
        room: createdSchedule.Room ? createdSchedule.Room.name : "",
        semester: createdSchedule.Semester ? createdSchedule.Semester.name : "",
        classType: createdSchedule.ClassType ? createdSchedule.ClassType.name : "",
        studyProgram: createdSchedule.StudyProgram ? createdSchedule.StudyProgram.name : "",
        },
      });
    })
    .catch((error) => {
      console.error("Error creating schedule:", error);
    });
  
    handleClose();
  }

function handleDelete() {
  const { event } = state.clickInfo;

  // Hapus acara dari kalender
  event.remove();

  // Hapus acara dari server menggunakan Axios
  axios
    .delete(`http://localhost:3000/api/schedules/${event.id}`)
    .then((response) => {
      console.log("Schedule deleted:", response.data);
      handleClose();
    })
    .catch((error) => {
      console.error("Error deleting schedule:", error);
      // Jika ada kesalahan, tambahkan kembali acara yang dihapus dari kalender
      let calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        isHoliday: event.extendedProps.isHoliday,
        extendedProps: {
          lecturer: event.extendedProps.lecturer,
          room: event.extendedProps.room,
          semester: event.extendedProps.semester,
          classType: event.extendedProps.classType,
          studyProgram: event.extendedProps.studyProgram,
        },
      });
      handleClose();
    });
}


  function handleClose() {
    setTitle("");
    setStart(new Date("2023-10-01"));
    setEnd(new Date("2023-10-07"));
    setState({});
    setModal(false);
  }

  const [state, setState] = useState({});

  return (

    <div className="main-container mx-2 mt-2">
        <CustomNavbar/>
    <div className="page-content">
      <div className="container-fluid">
        <h5>Manajemen Jadwal</h5>
        <div className="info-container">
        <p>  klik pada kolom untuk menambahkan jadwal baru, geser kotak jadwal untuk memindahkan waktu.</p>
      </div>
      <div>
      <Container>
        <FullCalendar
         height="auto"
          contentHeight="auto"
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          hiddenDays={[0]}
          weekends={weekendsVisible}
          dayHeaderContent={dayHeaderContent}
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
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={() => handleEvents(events)}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          dateClick={handleDateClick}
          slotMinTime="07:30:00"
          slotMaxTime="22:00:00"
          className="full-width-calendar"
          // slotDuration="00:15:00"
        />
      </Container>

      <CustomModal
        title={state.state === "update" ? "Update Event" : "Add Event"}
        isOpen={modal}
        toggle={handleCloseModal}
        onCancel={handleCloseModal}
        onSubmit={state.clickInfo ? handleEdit : handleSubmit}
        submitText={state.clickInfo ? "Update" : "Save"}
        onDelete={state.clickInfo && handleDelete}
        deleteText="Delete"
      >
        <FormGroup row>
          <Label for="exampleEmail" sm={3}>
            Title
          </Label>
          <Col sm={9}>
            <Input
              type="text"
              name="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="lecturer" sm={3}>
            Lecturer
          </Label>
          <Col sm={9}>
            <Input
              type="select"
              name="lecturer"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
            >
              <option value="">Choose Lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="room" sm={3}>
            Room
          </Label>
          <Col sm={9}>
            <Input
              type="select"
              name="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="">Choose Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="semester" sm={3}>
            Semester
          </Label>
          <Col sm={9}>
            <Input
              type="select"
              name="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Choose Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="studyProgram" sm={3}>
            Study Program
          </Label>
          <Col sm={9}>
            <Input
              type="select"
              name="studyProgram"
              value={studyProgram}
              onChange={(e) => setStudyProgram(e.target.value)}
            >
              <option value="">Choose Study Program</option>
              {studyPrograms.map((studyProgram) => (
                <option key={studyProgram.id} value={studyProgram.id}>
                  {studyProgram.name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="classtype" sm={3}>
            Class Type
          </Label>
          <Col sm={9}>
            <Input
              type="select"
              name="classtype"
              value={classtype}
              onChange={(e) => setClasstype(e.target.value)}
            >
              <option value="">Choose Class Type</option>
              {classTypes.map((classType) => (
                <option key={classType.id} value={classType.id}>
                  {classType.name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        {/* <FormGroup row>
        <Label for="isHoliday" sm={3}>
          Is Holiday
        </Label>
        <Col sm={9}>
          <Input
            type="checkbox"
            name="isHoliday"
            checked={isHoliday}
            onChange={(e) => setIsHoliday(e.target.checked)}
          />
        </Col>
      </FormGroup> */}
        </CustomModal>

      <CustomModal
        title={state.state === "resize" ? "Resize Event" : "Drop Event"}
        isOpen={confirmModal}
        toggle={() => {
          state.checkInfo.revert();
          setConfirmModal(false);
        }}
        onCancel={() => {
          state.checkInfo.revert();
          setConfirmModal(false);
        }}
        cancelText="Cancel"
        onSubmit={() => setConfirmModal(false)}
        submitText={"OK"}
      >
        Do you want to {state.state} this event?
      </CustomModal>
      </div>

      </div>
    </div>
  </div>

  );
}
