import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BsPencil, BsTrash } from 'react-icons/bs';
import axios from 'axios';
import CustomNavbar from '../component/Sidebar/Navbar';

const MasterDataKelasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/classtypes');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddData = () => {
    setEditMode(false);
    setFormData({
      id: '',
      name: '',
    });
    setShowModal(true);
  };

  const handleEditData = (id) => {
    const selectedData = data.find((item) => item.id === id);
    setEditMode(true);
    setFormData(selectedData);
    setShowModal(true);
  };

  const handleDeleteData = (id) => {
    Swal.fire({
      title: 'Yakin hapus data ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/classtypes/${id}`);
          setData((prevData) => prevData.filter((item) => item.id !== id));
          Swal.fire('Terhapus!', 'Data telah dihapus.', 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editMode) {
      try {
        await axios.put(`http://localhost:3000/api/classtypes/${formData.id}`, formData);
        const updatedData = data.map((item) => {
          if (item.id === formData.id) {
            return {
              id: formData.id,
              name: formData.name,
            };
          }
          return item;
        });
        setData(updatedData);
        Swal.fire('Berhasil!', 'Data telah diperbarui.', 'success');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3000/api/classtypes', formData);
        const newData = {
          id: response.data.id,
          name: formData.name,
        };
        setData((prevData) => [...prevData, newData]);
        Swal.fire('Berhasil!', 'Data telah ditambahkan.', 'success');
      } catch (error) {
        console.log(error);
      }
    }
    setFormData({
      id: '',
      name: '',
    });
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Container fluid>
      <CustomNavbar/>
        <div className="px-4 pt-2">
          <Row>
            <Col className="d-flex align-items-center">
              <h5>Master Data Kelas</h5>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form>
                <Form.Group controlId="searchTerm">
                  <Form.Control type="text" placeholder="Cari Kelas" onChange={handleSearch} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6} className="text-md-end">
            <Button variant="primary" onClick={handleAddData} className='custom-button'>
              Tambah Data
            </Button>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kelas</th>
                <th className="col-1 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <Button variant="white" size="sm" onClick={() => handleEditData(item.id)} style={{ fontWeight: 'bold', color: '#5272E9', marginRight: '4px' }}>
                      <BsPencil />
                    </Button>{' '}
                    <Button variant="white" size="sm" onClick={() => handleDeleteData(item.id)} style={{ fontWeight: 'bold', color: '#5272E9' }}>
                      <BsTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Data' : 'Tambah Data'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="light" style={{ borderRadius:'15px' }} onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button variant="primary" type="submit" className='custom-button'>
                {editMode ? 'Simpan' : 'Tambah'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MasterDataKelasPage;
