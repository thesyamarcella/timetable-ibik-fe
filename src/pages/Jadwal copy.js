import React, { useState, useCallback, Fragment, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import './Pages.css';
import { FcInfo } from 'react-icons/fc';
import CustomNavbar from '../component/Sidebar/Navbar';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CustomToolbar = () => {
  return <div className="rbc-toolbar" />;
};

const CustomDayHeader = ({ label }) => {
  const isSunday = moment(label).day() === 0; 
  const dayHeaderStyle = {
    backgroundColor: isSunday ? '#F4F4F4' : 'white', // Set gray background for Sunday, white for other days
  };

  return (
    <div className={`rbc-header ${isSunday ? 'sunday' : ''}`} style={dayHeaderStyle}>
      {moment(label).format('ddd')}
    </div>
  );
};

const Jadwalcopy = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [room, setRoom] = useState('');
  const [semester, setSemester] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [classtype, setClassType] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [lecturers, setLecturers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [classTypes, setClassTypes] = useState([]);


  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedStudyPrograms, setSelectedStudyPrograms] = useState([]);
  const [selectedClassType, setSelectedClassType] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setSelectedStudyPrograms([]);
    setSelectedClassType([]);
    setSelectedRoom([]);
    setSelectedLecturer([]);
    setSearchQuery('');
  };
  
  const handleStudyProgramsChange = (selected) => {
    setSelectedStudyPrograms(selected);
  };
  
  const handleClassTypeChange = (selected) => {
    setSelectedClassType(selected);
  };
  
  const handleRoomChange = (selected) => {
    setSelectedRoom(selected);
  };

  const handleSemesterChange = (selected) => {
    setSelectedSemester(selected);
  };
  
  const handleLecturerChange = (selected) => {
    setSelectedLecturer(selected);
  };
  
  const searchOptions = (options, query) => {
    return options.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleOpenFormModal = useCallback(() => {
    setShowFormModal(true);
    setSelectedTime('');
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    resetFormFields();
  }, []);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (eventTitle) {
        const newEvent = {
          title: eventTitle,
          start: selectedEvent.start,
          end: selectedEvent.end,
          isHoliday: isHoliday,
          lecturerId:parseInt(lecturer),
          roomId: parseInt(room),
          semesterId: parseInt(semester),
          studyProgramId: parseInt(studyProgram),
          classTypeId: parseInt(classtype),
        };

        // setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
        axios 
        .post('http://localhost:3000/api/schedules', newEvent)
        .then((response) => {
          console.log(response.data); 
          setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        console.log(newEvent)

        resetFormFields();
        setSelectedEvent(null);
        handleCloseFormModal();
      }
    },
    [eventTitle, selectedEvent, lecturer, room,semester, studyProgram, classtype, handleCloseFormModal]
  );

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      if (!isSunday(slotInfo.start)) {
        setSelectedEvent(slotInfo);
        handleOpenFormModal();
        const startTime = moment(slotInfo.start).format('HH:mm');
        const endTime = moment(slotInfo.end).format('HH:mm');
        setSelectedTime(`${startTime} - ${endTime}`);
      }
    },
    [handleOpenFormModal]
  );

  const handleEventDrop = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      } else if (allDay && !droppedOnAllDaySlot) {
        event.allDay = false;
      }
  
      setCalendarEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((prevEvent) =>
          prevEvent.id === event.id ? { ...prevEvent, start, end, allDay } : prevEvent
        );
        // Save updatedEvents ke database di sini
        return updatedEvents;
      });
    },
    []
  );
  

  const eventStyleGetter = useCallback(
    (event, start, end, isSelected) => {
      const style = {
        backgroundColor: event.isHoliday ? '#FFE9ED' : '#E9EFFF',
        borderRadius: '5px',
        color: 'black',
        borderLeft: event.isHoliday ? '5px solid #E95252' : '5px solid #5272E9',
        display: 'block',
      };

      if (isSunday(start)) {
        style.backgroundColor = '#F4F4F4';
        style.borderLeft = '5px solid red'; // Change the border color to red
        style.cursor = 'not-allowed';
      }
  
      return {
        style,
      };
    },
    []
  );

  const resetFormFields = () => {
    setEventTitle('');
    setLecturer('');
    setRoom('');
    setSemester('');
    setStudyProgram('');
    setClassType('');
    setIsHoliday(false);
  };

  const isSunday = (date) => {
    return moment(date).day() === 0;
  };


  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  useEffect(() => {
    axios
    .get('http://localhost:3000/api/lecturers') 
    .then((response) => setLecturers(response.data))
    .catch((error) => console.error('Error fetching lecturers:', error));

    axios
      .get('http://localhost:3000/api/rooms') 
      .then((response) => setRooms(response.data))
      .catch((error) => console.error('Error fetching rooms:', error));

      axios
      .get('http://localhost:3000/api/semesters') 
      .then((response) => setSemesters(response.data))
      .catch((error) => console.error('Error fetching semesters:', error));
  
    axios
      .get('http://localhost:3000/api/studyprograms') 
      .then((response) => setStudyPrograms(response.data))
      .catch((error) => console.error('Error fetching study programs:', error));
  
    axios
      .get('http://localhost:3000/api/classtypes') 
      .then((response) => setClassTypes(response.data))
      .catch((error) => console.error('Error fetching class types:', error));

    axios
      .get('http://localhost:3000/api/schedules') 
      .then((response) => console.log(response.data))
      .catch((error) => console.error('Error fetching class types:', error));
    
  }, []);

  const EventRender = (info) =>{
    console.log(info);
    return (
      <div>
        Test
      </div>
    )
  }
  

  return (
    <Fragment>
      <CustomNavbar />
      <div className="main-container mx-2 mt-2">
        <div className="page-content">
          <div className="container-fluid">
                <h5>Manajemen Jadwal</h5>
            <div className="info-container">
            <p> <FcInfo/> klik pada kolom untuk menambahkan jadwal baru, geser kotak jadwal untuk memindahkan waktu.</p>
          </div>

            <div className="calendar" >
              
              <DragAndDropCalendar
                localizer={localizer}
                selectable
                events={calendarEvents}
                eventContent={(info)=> EventRender(info)}
                defaultView="week"
                defaultDate={new Date(2023,9,1)}
                startAccessor="start"
                endAccessor="end"
                timeslots={4}
                step={15}
                min={new Date(0, 1, 0, 7, 30, 0)}
                max={new Date(0, 7, 0, 23, 0, 0)}
                style={{ minHeight: 500 }}
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                components={{
                  toolbar: CustomToolbar,
                  day: {
                    header: CustomDayHeader,
                  },
                }}
                eventPropGetter={eventStyleGetter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent && moment(selectedEvent.start).format('dddd')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group as={Row}>
                <Form.Label column sm="3">
                  Jam
                </Form.Label>
                <Col sm="9">
                  <Form.Control type="text" value={selectedTime} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formEventTitle">
          <Form.Label column sm="3"> Mata Kuliah </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="masukkan Nama Mata Kuliah"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formLecturer">
        <Form.Label column sm="3">
          Lecturer
        </Form.Label>
        <Col sm="9">
          <Form.Select
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
          >
            <option value="">Pilih Dosen</option>
            {lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formRoom">
        <Form.Label column sm="3">
          Room
        </Form.Label>
        <Col sm="9">
          <Form.Select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="">Pilih Ruangan</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formSemester">
        <Form.Label column sm="3">
          Semester
        </Form.Label>
        <Col sm="9">
          <Form.Select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Pilih Semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formStudyProgram">
        <Form.Label column sm="3">
          Prodi
        </Form.Label>
        <Col sm="9">
          <Form.Select
            value={studyProgram}
            onChange={(e) => setStudyProgram(e.target.value)}
          >
            <option value="">Pilih Prodi</option>
            {studyPrograms.map((studyProgram) => (
              <option key={studyProgram.id} value={studyProgram.id}>
                {studyProgram.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formClassType">
        <Form.Label column sm="3">
          Class
        </Form.Label>
        <Col sm="9">
          <Form.Select
            value={classtype}
            onChange={(e) => setClassType(e.target.value)}
          >
            <option value="">Pilih Kelas</option>
            {classTypes.map((classType) => (
              <option key={classType.id} value={classType.id}>
                {classType.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

        <Form.Group as={Row} controlId="formIsHoliday">
          <Form.Label column sm="3">
            Libur
          </Form.Label>
          <Col sm="9" className='mt-2'>
            <Form.Check
              type="checkbox"
              label="Kelas diliburkan?"
              checked={isHoliday}
              onChange={(e) => setIsHoliday(e.target.checked)}
            />
          </Col>
        </Form.Group>


            <div className="text-end">
              <Button variant="light" className="me-2 " style={{ borderRadius: '15px' }} onClick={handleCloseFormModal}>
                Batal
              </Button>
              <Button variant="primary" type="submit" className='custom-button'>
                Simpan Jadwal
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <FcInfo />select the time on the slot by dragging on the table to add the schedule in the table.
          </p>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

CustomDayHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Jadwalcopy;
