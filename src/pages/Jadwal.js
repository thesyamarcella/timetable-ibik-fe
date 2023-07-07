import React, { useState, useRef, useEffect } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { nanoid } from "nanoid";
import { Container, Row, Col } from "reactstrap";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "./custom.css";
import axios from "axios";

import events from "./events";
import CustomModal from "./component/CustomModal";

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


function resetForm() {
  setTitle("");
  setStart(new Date("2023-10-01"));
  setEnd(new Date("2023-10-07"));
  setIsHoliday(false);
  setLecturer("");
  setRoom("");
  setSemester("");
  setStudyProgram("");
  setClasstype("");
}



  const handleCloseModal = () => {
    resetForm();
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
  
    return (
      <div>
        <i
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "#333",
            maxWidth: "10px",
          }}
        >
          <strong>{eventInfo.event.title}</strong>
          <p>{eventInfo.event.extendedProps.lecturer}</p>
          <p style={{ fontSize: "10px" }}>{eventInfo.event.extendedProps.room} | {eventStart} - {eventEnd}</p>
        </i>
      </div>
    );
  }
  
  
  

  function handleEventClick(clickInfo) {
    setState({ clickInfo, state: "update" });
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);
    setModal(true);
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  function handleEventDrop(checkInfo) {
    setState({ checkInfo, state: "drop" });
    setConfirmModal(true);
  }

  function handleEventResize(checkInfo) {
    setState({ checkInfo, state: "resize" });
    setConfirmModal(true);
  }

  function handleEdit() {
    state.clickInfo.event.setStart(start);
    state.clickInfo.event.setEnd(end);
    state.clickInfo.event.mutate({
      standardProps: { title }
    });
    handleClose();
  }

  function handleSubmit() {
    const newEvent = {
      id: nanoid(),
      title,
      start: state.selectInfo?.startStr || start.toISOString(),
      end: state.selectInfo?.endStr || end.toISOString(),
      isHoliday,
      lecturerId: parseInt(lecturer),
      roomId: parseInt(room),
      semesterId: parseInt(semester),
      studyProgramId: parseInt(studyProgram),
      classTypeId: parseInt(classtype),
      extendedProps: {
        room,
        lecturer
      }
    };

    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(newEvent);
    handleClose();
  }

  function handleDelete() {
    state.clickInfo.event.remove();
    handleClose();
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
    <div className="App">
      <h1>Hello FullCalendar</h1>
      <Container>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          hiddenDays={[0]}
          weekends={weekendsVisible}
          dayHeaderContent={(args) =>
            args.date.toLocaleString("default", { weekday: "long" })
          }
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
          events={events}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={() => handleEvents(events)}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          dateClick={handleDateClick}
          slotMinTime="07:30:00"
          slotMaxTime="22:00:00"
          slotDuration="00:15:00"
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
  );
}
