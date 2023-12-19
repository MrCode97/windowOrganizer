// Registration.js
// THIS FILE IS NO MORE NEEDED!
import React from 'react';
import { Typography, Tabs, Tab } from '@mui/material';
import UserRegistrationForm from './UserRegistrationForm';
import AdventCalendarRegistrationForm from './AdventCalendarRegistrationForm';
import Login from './Login';

function Registration() {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Typography variant="h2">Registration</Typography>
      <Tabs value={activeTab} onChange={handleChangeTab}>
        <Tab label="User Registration" />
        <Tab label="Advent Calendar Registration" />
        <Tab label="Login" />
      </Tabs>

      {activeTab === 0 && <UserRegistrationForm />}
      {activeTab === 1 && <AdventCalendarRegistrationForm />}
      {activeTab === 2 && <Login />}
    </div>
  );
}

export default Registration;
