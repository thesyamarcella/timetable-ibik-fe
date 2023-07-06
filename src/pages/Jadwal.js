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

const Jadwal = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [room, setRoom] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [classtype, setClassType] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [lecturers, setLecturers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [classTypes, setClassTypes] = useState([]);


  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedStudyPrograms, setSelectedStudyPrograms] = useState([]);
  const [selectedClassType, setSelectedClassType] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
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
          id: generateUniqueId(),
          title: eventTitle,
          start: selectedEvent.start,
          end: selectedEvent.end,
          lecturerId: lecturers,
          roomId: rooms,
          studyProgramId: studyPrograms,
          classtypeId: classTypes,
          isHoliday: isHoliday,
        };
        setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
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
    [eventTitle, selectedEvent, lecturer, room, studyProgram, classtype, handleCloseFormModal]
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
    setStudyProgram('');
    setClassType('');
    setIsHoliday(false);
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
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
      .get('http://localhost:3000/api/studyprograms') 
      .then((response) => setStudyPrograms(response.data))
      .catch((error) => console.error('Error fetching study programs:', error));
  
    axios
      .get('http://localhost:3000/api/classtypes') 
      .then((response) => setClassTypes(response.data))
      .catch((error) => console.error('Error fetching class types:', error));
  }, []);
  

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
            
            <div className='filter-container'>
          <Form.Select value={selectedFilter} onChange={handleFilterChange}>
            <option value=''>Pilih Filter</option>
            <option value='studyPrograms'>Study program</option>
            <option value='classType'>Class</option>
            <option value='room'>Room</option>
            <option value='lecturer'>Lecturer</option>
          </Form.Select>
          {selectedFilter === 'studyPrograms' && (
            <Typeahead
              options={studyPrograms.map(studyProgram => studyProgram.name)}
              selected={selectedStudyPrograms}
              onChange={handleStudyProgramsChange}
              placeholder='Pilih Study program'
              renderMenuItemChildren={(option, { text }) => (
                <div>
                  {text}
                  <div>
                    <small>{option}</small>
                  </div>
                </div>
              )}
              inputProps={{ style: { width: '100%' } }}
            />
          )}
          {selectedFilter === 'classType' && (
            <Typeahead
              options={classTypes.map(classType => classType.name)}
              selected={selectedClassType}
              onChange={handleClassTypeChange}
              placeholder='Pilih Class'
              renderMenuItemChildren={(option, { text }) => (
                <div>
                  {text}
                  <div>
                    <small>{option}</small>
                  </div>
                </div>
              )}
              inputProps={{ style: { width: '100%' } }}
            />
          )}
          {selectedFilter === 'room' && (
            <Typeahead
              options={rooms.map(room => room.name)}
              selected={selectedRoom}
              onChange={handleRoomChange}
              placeholder='Pilih Room'
              renderMenuItemChildren={(option, { text }) => (
                <div>
                  {text}
                  <div>
                    <small>{option}</small>
                  </div>
                </div>
              )}
              inputProps={{ style: { width: '100%' } }}
            />
          )}
          {selectedFilter === 'lecturer' && (
            <div>
              <Typeahead
                options={searchOptions(
                  lecturers.map(lecturer => lecturer.name),
                  searchQuery
                )}
                selected={selectedLecturer}
                onChange={handleLecturerChange}
                placeholder='Pilih Lecturer'
                renderMenuItemChildren={(option, { text }) => (
                  <div>
                    {text}
                    <div>
                      <small>{option}</small>
                    </div>
                  </div>
                )}
                inputProps={{ style: { width: '100%'   } }}
              />
            </div>
          )}
        </div>

            <div className="calendar" >
              <DragAndDropCalendar
                localizer={localizer}
                selectable
                events={calendarEvents}
                defaultView="week"
                defaultDate={new Date()}
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
          <Form.Label column sm="3"> Subject </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter the Subject name"
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
            <option value="">Pilih Lecturer</option>
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
            <option value="">Pilih Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
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
            <option value="">Pilih Class</option>
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
            schedule off
          </Form.Label>
          <Col sm="9" className='mt-2'>
            <Form.Check
              type="checkbox"
              label="schedule off"
              checked={isHoliday}
              onChange={(e) => setIsHoliday(e.target.checked)}
            />
          </Col>
        </Form.Group>


            <div className="text-end">
              <Button variant="light" className="me-2 " style={{ borderRadius: '15px' }} onClick={handleCloseFormModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className='custom-button'>
                Save Schedule
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

export default Jadwal;
