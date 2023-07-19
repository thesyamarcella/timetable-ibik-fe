import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './CustomNavbar.css';

const CustomNavbar = () => {
  const location = useLocation();

  return (
    <Navbar sticky="top" bg="light" expand="lg" className='px-4 py-2'>
      <Navbar.Brand>IBIKtimetable</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        <Nav className="mr-auto">
          <Nav.Link
            href="/Jadwal"
            className={`nav-link ${location.pathname === '/Jadwal' ? 'active' : ''}`}
          >
            Mengelola Jadwal
          </Nav.Link>
          <Nav.Link
            href="/Semester"
            className={`nav-link ${location.pathname === '/Semester' ? 'active' : ''}`}
          >
            Data Semester
          </Nav.Link>
          <Nav.Link
            href="/Dosen"
            className={`nav-link ${location.pathname === '/Dosen' ? 'active' : ''}`}
          >
            Data Dosen
          </Nav.Link>
          <Nav.Link
            href="/Prodi"
            className={`nav-link ${location.pathname === '/Prodi' ? 'active' : ''}`}
          >
            Data Program Studi
          </Nav.Link>
          <Nav.Link
            href="/Ruangan"
            className={`nav-link ${location.pathname === '/Ruangan' ? 'active' : ''}`}
          >
            Data Ruangan
          </Nav.Link>
          <Nav.Link
            href="/Kelas"
            className={`nav-link ${location.pathname === '/Kelas' ? 'active' : ''}`}
          >
            Data Kelas
          </Nav.Link>
          <Nav.Link
          href="/AdminPanel"
          style={{ color: '#5272E9 ' }}
          className={`nav-link ${location.pathname === '/AdminLogin' ? 'active text-primary' : ''}`}
        >
          Logout
        </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
