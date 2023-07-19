import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
// import App from './App';
import Jadwal from './pages/Jadwal';
import MasterDataDosenPage from './pages/MasterDataDosenPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import MasterDataRuanganPage from './pages/MasterDataRuanganPage';
import MasterDataProdiPage from './pages/MasterDataProdiPage';
import MasterDataSemesterPage from './pages/MasterDataSemesterPage';
import MasterDataKelasPage from './pages/MasterDataKelasPage';
import MainPage from './pages/MainPage';
import PrivateRoute from './PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/Jadwal" element ={<Jadwal />} />
      <Route path="/" element ={<MainPage />} />
      <Route path="/adminpanel" element ={<AdminLogin />} />
      <Route path="/Dosen" element ={<MasterDataDosenPage />} />
      <Route path="/Ruangan" element ={<MasterDataRuanganPage />} />
      <Route path="/Prodi" element ={<MasterDataProdiPage />} />
      <Route path="/Semester" element ={<MasterDataSemesterPage />} />
      <Route path="/Kelas" element ={<MasterDataKelasPage/>} />
      
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
