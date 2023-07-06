import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { GrSchedules, GrDatabase } from 'react-icons/gr';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ visible }) => {
  const location = useLocation();

  return (
    <div className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#FFFFFF', paddingBottom: '100px' }}>
      <Navbar.Brand href="/" className="mb-5 fw-bold">IBIK <br/> Timetable</Navbar.Brand>
      <Navbar.Toggle aria-controls="sidebar-nav" />
      <Navbar.Collapse id="sidebar-nav">
        <Nav className="flex-column" activeKey={location.pathname}>
          <Nav.Item className={`sidebar-item`}>
            <Nav.Link href="/" className="nav-link">
              <GrSchedules className="mr-2" />
              Manajemen Jadwal
            </Nav.Link>
          </Nav.Item>
          <NavDropdown title="Master Data" id="master-data-dropdown">
            <NavDropdown.Item href="/Semester" className={`sidebar-item ${location.pathname === '/Semester' ? 'active' : ''}`}>
              <GrDatabase className="mr-2" />
              Master Data Semester
            </NavDropdown.Item>
            <NavDropdown.Item href="/Dosen" className={`sidebar-item ${location.pathname === '/Dosen' ? 'active' : ''}`}>
              <GrDatabase className="mr-2" />
              Master Data Dosen
            </NavDropdown.Item>
            <NavDropdown.Item href="/Prodi" className={`sidebar-item ${location.pathname === '/Prodi' ? 'active' : ''}`}>
              <GrDatabase className="mr-2" />
              Master Data Program Studi
            </NavDropdown.Item>
            <NavDropdown.Item href="/Ruangan" className={`sidebar-item ${location.pathname === '/Ruangan' ? 'active' : ''}`}>
              <GrDatabase className="mr-2" />
              Master Data Ruangan
            </NavDropdown.Item>
            <NavDropdown.Item href="/Kelas" className={`sidebar-item ${location.pathname === '/Kelas' ? 'active' : ''}`}>
              <GrDatabase className="mr-2" />
              Master Data Kelas
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </div>
  );
};

export default Sidebar;
