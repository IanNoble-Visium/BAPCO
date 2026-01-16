import { Routes, Route } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import Landing from './Landing';
import Facility from './Facility';
import Process from './Process';
import Equipment from './Equipment';
import Safety from './Safety';
import Cyber from './Cyber';
import ToastContainer from '../components/ui/ToastContainer';

function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <Navigation />
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/facility" element={<Facility />} />
          <Route path="/process" element={<Process />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/cyber" element={<Cyber />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
