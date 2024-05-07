import React from 'react';
import FPage from './FPage.jsx';
import Register from './Register.jsx';
import AddParticipants from './AddParticipants.jsx';
import GetParticipant from './GetParticipant.jsx';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';

function App() {


  return(
    <>
      <Register />
     <FPage />
     <AddParticipants />
     <GetParticipant />
    </>
  );
}

export default App;
