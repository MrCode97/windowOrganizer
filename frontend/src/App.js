// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Registration from './components/Registration';
import Calendar from './components/Calendar';
import DefaultCalendar from './components/DefaultCalendar';

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/default" element={<DefaultCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;