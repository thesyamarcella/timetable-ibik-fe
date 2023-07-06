import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import { Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const MainPage = () => {
  const [selectedStudyPrograms, setSelectedStudyPrograms] = useState([]);
  const [selectedClassType, setSelectedClassType] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState([]);

  const [lecturers, setLecturers] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [studyprograms, setStudyPrograms] = useState([]);

  useEffect(() => {
    // Fetch lecturers
    axios
      .get('http://localhost:3000/api/lecturers')
      .then(response => {
        setLecturers(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Fetch class types
    axios
      .get('http://localhost:3000/api/classtypes')
      .then(response => {
        setClassTypes(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Fetch study programs
    axios
      .get('http://localhost:3000/api/studyprograms')
      .then(response => {
        setStudyPrograms(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Fetch rooms
    axios
      .get('http://localhost:3000/api/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      
  }, []);

  const handleStudyProgramsChange = selected => {
    setSelectedStudyPrograms(selected);
  };

  const handleClassTypeChange = selected => {
    setSelectedClassType(selected);
  };

  const handleRoomChange = selected => {
    setSelectedRoom(selected);
  };

  const handleLecturerChange = selected => {
    setSelectedLecturer(selected);
  };

  const events = [
    {
      eventTitle: 'Event 1',
      start: new Date(2023, 5, 19, 8),
      end: new Date(2023, 5, 19, 10),
      studyprograms: 'StudyPrograms A',
      classtype: 'ClassType 1',
      room: 'Room 1',
    },
    // Add more events here...
  ];

  const filteredEvents = events.filter(
    event =>
      (!selectedStudyPrograms.length ||
        selectedStudyPrograms.includes(event.studyprograms)) &&
      (!selectedClassType.length ||
        selectedClassType.includes(event.classtype)) &&
      (!selectedRoom.length || selectedRoom.includes(event.room)) &&
      (!selectedLecturer.length || selectedLecturer.includes(event.lecturer))
  );

  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
    setSearchQuery('');
  };

  // const handleSearchQueryChange = event => {
  //   setSearchQuery(event.target.value);
  // };

  const searchOptions = (options, query) => {
    return options.filter(option =>
      option.toLowerCase().includes(query.toLowerCase())
    );
  };

  const CustomToolbar = () => {
    return (
      <div className='mt-3'>
        <div className='header mb-5'>
          <div className='ibik-timetable-title'>IBIKtimetable</div>
          <div className='admin-login-button'>
            <Link to='/AdminLogin'>
              <Button variant='primary' className='custom-button'>Admin Login</Button>
            </Link>
          </div>
        </div>
        
        <div className='filter-container mb-4'>
          <Form.Select value={selectedFilter} onChange={handleFilterChange}>
            <option value=''>Pilih Filter</option>
            <option value='studyPrograms'>Program Studi</option>
            <option value='classType'>Tipe Kelas</option>
            <option value='room'>Ruangan</option>
            <option value='lecturer'>Dosen</option>
          </Form.Select>
          {selectedFilter === 'studyPrograms' && (
            <Typeahead
              options={studyprograms.map(studyProgram => studyProgram.name)}
              selected={selectedStudyPrograms}
              onChange={handleStudyProgramsChange}
              placeholder='Pilih Program Studi'
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
              placeholder='Pilih Tipe Kelas'
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
              placeholder='Pilih Ruangan'
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
                placeholder='Pilih Dosen'
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
      </div>
    );
  };

  const CustomDayHeader = ({ label }) => {
    return <div className='rbc-header'>{moment(label).format('ddd')}</div>;
  };

  const customDayPropGetter = date => {
    const day = date.getDay();
    if (day === 0) {
      return {
        className: 'custom-sunday',
      };
    }
    return null;
  };

  return (
    <Row className='mx-3'>
      <Col>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          views={['week']}
          defaultView='week'
          components={{
            toolbar: CustomToolbar,
            dayHeader: CustomDayHeader,
          }}
          dayPropGetter={customDayPropGetter}
          style={{ height: 500 }}
          timeslots={4}
          step={15}
          min={new Date(0, 1, 0, 7, 30, 0)}
          max={new Date(0, 7, 0, 23, 0, 0)}
        />
      </Col>
      <footer className='text-center text-muted small mt-4'> Timetable Institut Bisnis dan Informatika Kesatuan</footer>
    </Row>
  );
};

export default MainPage;
