
import React, { useState, useCallback,Fragment } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import Sidebar from '../component/Sidebar/Sidebar';
import './Pages.css';
import {FcInfo} from 'react-icons/fc'
import { ChevronLeft,ChevronRight } from 'react-bootstrap-icons';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CustomToolbar = () => {
  return <div className="rbc-toolbar" />;
};

const CustomDayHeader = ({ label }) => {
  return <div className="rbc-header">{moment(label).format('ddd')}</div>;
};

const Jadwal = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [dosen, setDosen] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [kelas, setKelas] = useState('');
  const [isLibur, setIsLibur] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };

    // const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenFormModal = useCallback(() => {
    setShowFormModal(true);
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
          dosen,
          ruangan,
          programStudi,
          kelas,
          isLibur : isLibur,
        };
        setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
        // Simpan event baru ke database di sini

        resetFormFields();
        setSelectedEvent(null);
        handleCloseFormModal();
      }
    },
    [eventTitle, selectedEvent.start, selectedEvent.end, dosen, ruangan, programStudi, kelas, isLibur, handleCloseFormModal]
  );

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      setSelectedEvent(slotInfo);
      handleOpenFormModal();
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
        // Simpan perubahan ke database di sini
        return updatedEvents;
      });
    },
    []
  );

  const handleEventResize = useCallback(
    ({ event, start, end }) => {
      setCalendarEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((prevEvent) =>
          prevEvent.id === event.id ? { ...prevEvent, start, end } : prevEvent
        );
        // Simpan perubahan ke database di sini
        return updatedEvents;
      });
    },
    []
  );

  const handleEventClick = useCallback(
    (event) => {
      setSelectedEvent(event);
    },
    []
  );

  const handleEditEvent = useCallback(
    (updatedEvent) => {
      setCalendarEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((prevEvent) =>
          prevEvent.id === updatedEvent.id ? updatedEvent : prevEvent
        );
        // Simpan perubahan ke database di sini
        return updatedEvents;
      });
      setSelectedEvent(null);
    },
    []
  );

  const handleDeleteEvent = useCallback(
    (eventId) => {
      setCalendarEvents((prevEvents) => {
        const updatedEvents = prevEvents.filter((event) => event.id !== eventId);
        // Hapus event dari database di sini
        return updatedEvents;
      });
      setSelectedEvent(null);
    },
    []
  );

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 100000);
  };

  const resetFormFields = () => {
    setEventTitle('');
    setDosen('');
    setRuangan('');
    setProgramStudi('');
    setKelas('');
  };

  const eventTimeRangeFormat = ({ start, end }) => {
    const startTime = moment(start).format('ddd HH:mm');
    const endTime = moment(end).format('HH:mm');
    return `${startTime} - ${endTime}`;
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: '#3174ad',
      color: '#fff',
    };
  
    if (event.isLibur) {
      style.backgroundColor = '#ff0000';
    };
  };

  const customDayPropGetter = (date) => {
    const day = date.getDay();
    if (day === 0) {
      // Mengubah warna latar belakang kolom Minggu menjadi pink
      return {
        className: 'custom-sunday',
      };
    }
    return null;
  };

  return (
    <div>
          <style>
      {`
      .custom-sunday {
        background-color: pink;
      }
    `}
    </style>
    <Row className='content'>
    {sidebarVisible && <Sidebar />}
        <Col sm={sidebarVisible ? 10 : 12} style={{ backgroundColor: '#ffffff', padding: '20px' }}>
        <Fragment>
        <Row className='spacebet'>
          <Col>
          <Row>
            <Col className="d-flex align-items-center">
              <Button variant="light" onClick={toggleSidebar} className="me-2 mb-2">
                {sidebarVisible ?  <ChevronLeft /> : <ChevronRight />}
              </Button>
              <h4>IBIK</h4>
              <h5>timetable</h5>
            </Col>
          </Row>
          </Col>
          <Col md={6} className="text-md-end">
            <p><b>Admin</b></p>
          </Col>
        </Row>
          <div className="info-container">
            <p> <FcInfo/> klik pada kolom untuk menambahkan jadwal baru, geser kotak jadwal untuk memindahkan waktu.</p>
          </div>

          <div className="calendar-container">
            <DragAndDropCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              selectable
              resizable
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleEventClick}
              timeslots={4}
              step={15}
              defaultView="week"
              components={{
                toolbar: CustomToolbar,
                dayHeader: CustomDayHeader,
              }}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={customDayPropGetter}
            />
          </div>

          {selectedEvent && (
            <div className='col sm-2'>
              <h2>Edit Event</h2>
              <Form onSubmit={() => handleEditEvent(selectedEvent)}>
                <Form.Group controlId="eventTitle">
                  <Form.Label>Mata Pelajaran:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent((prevEvent) => ({ ...prevEvent, title: e.target.value }))
                    }
                  />
                </Form.Group>
                <Form.Group controlId="dosen">
                  <Form.Label>Dosen:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedEvent.dosen}
                    onChange={(e) =>
                      setSelectedEvent((prevEvent) => ({ ...prevEvent, dosen: e.target.value }))
                    }
                  >
                    <option value="">-- Pilih Dosen --</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="ruangan">
                  <Form.Label>Ruangan:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedEvent.ruangan}
                    onChange={(e) =>
                      setSelectedEvent((prevEvent) => ({ ...prevEvent, ruangan: e.target.value }))
                    }
                  >
                    <option value="">-- Pilih Ruangan --</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="programStudi">
                  <Form.Label>Program Studi:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedEvent.programStudi}
                    onChange={(e) =>
                      setSelectedEvent((prevEvent) => ({ ...prevEvent, programStudi: e.target.value }))
                    }
                  >
                    <option value="">-- Pilih Program Studi --</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="kelas">
                  <Form.Label>Kelas:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedEvent.kelas}
                    onChange={(e) =>
                      setSelectedEvent((prevEvent) => ({ ...prevEvent, kelas: e.target.value }))
                    }
                  >
                    <option value="">-- Pilih Kelas --</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formLibur">
                <Form.Check
                  type="checkbox"
                  label="Libur"
                  checked={isLibur}
                  onChange={(e) => setIsLibur(e.target.checked)}
                />
              </Form.Group>

              <Row className='row-justify-content-end mt-2'>
            <Col>
              <Button variant="primary" type="submit" style={{ marginRight: '2px' }}>Save</Button>
              <Button variant="secondary" onClick={() => setSelectedEvent(null)} style={{ marginRight: '2px' }}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDeleteEvent(selectedEvent.id)}>Delete</Button>
            </Col>
          </Row>
              </Form>
            </div>
          )}

          <Modal show={showFormModal} onHide={handleCloseFormModal}>
            <Modal.Header closeButton>
              <Modal.Title>Tambah Jadwal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="eventTitle">
                  <Form.Label>Mata Pelajaran:</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="dosen">
                  <Form.Label>Dosen:</Form.Label>
                  <Form.Control
                    as="select"
                    value={dosen}
                    onChange={(e) => setDosen(e.target.value)}
                  >
                    <option value="">-- Pilih Dosen --</option>
                    <option value="Dosen 1">Septian Cahyadi</option>
                    <option value="Dosen 2">Febri Damatraseta</option>
                    <option value="Dosen 3">Edi Nurachmad</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="ruangan">
                  <Form.Label>Ruangan:</Form.Label>
                  <Form.Control
                    as="select"
                    value={ruangan}
                    onChange={(e) => setRuangan(e.target.value)}
                  >
                    <option value="">-- Pilih Ruangan --</option>
                    <option value="Ruangan 1">215</option>
                    <option value="Ruangan 2">305</option>
                    <option value="Ruangan 3">305</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="programStudi">
                  <Form.Label>Program Studi:</Form.Label>
                  <Form.Control
                    as="select"
                    value={programStudi}
                    onChange={(e) => setProgramStudi(e.target.value)}
                  >
                    <option value="">-- Pilih Program Studi --</option>
                    <option value="Program Studi 1">Teknologi Informasi</option>
                    <option value="Program Studi 2">Sistem Informasi</option>
                    <option value="Program Studi 3">Pariwisata</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="kelas">
                  <Form.Label>Kelas:</Form.Label>
                  <Form.Control
                    as="select"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  >
                    <option value="">-- Pilih Kelas --</option>
                    <option value="Kelas 1">TI 20 PA</option>
                    <option value="Kelas 2">TI 21 PA</option>
                    <option value="Kelas 3">TI 19  </option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save
                </Button>
                <Button variant="secondary" onClick={handleCloseFormModal}>
                  Cancel
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Fragment>
          </Col>
    </Row>

    </div>
  );
};

CustomDayHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Jadwal;