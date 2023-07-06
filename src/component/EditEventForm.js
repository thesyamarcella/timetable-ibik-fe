import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const EditEventForm = ({ selectedEvent, handleEditEvent, handleDeleteEvent, setSelectedEvent }) => {
  return (
    <div>
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
            <option value="Dosen 1">Dosen 1</option>
            <option value="Dosen 2">Dosen 2</option>
            <option value="Dosen 3">Dosen 3</option>
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
            <option value="Ruangan 1">Ruangan 1</option>
            <option value="Ruangan 2">Ruangan 2</option>
            <option value="Ruangan 3">Ruangan 3</option>
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
            <option value="Program Studi 1">Program Studi 1</option>
            <option value="Program Studi 2">Program Studi 2</option>
            <option value="Program Studi 3">Program Studi 3</option>
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
        <Row className='justify-content-end'>
          <Col><Button variant="primary" type="submit">Save </Button></Col>
          <Col><Button variant="secondary" onClick={() => setSelectedEvent(null)}>Cancel</Button></Col>
          <Col><Button variant="danger" onClick={() => handleDeleteEvent(selectedEvent.id)}>Delete</Button></Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditEventForm;
