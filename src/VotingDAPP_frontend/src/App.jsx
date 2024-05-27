import React from 'react';
import FPage from './FPage.jsx';
import Register from './Register.jsx';
import AddParticipants from './AddParticipants.jsx';
import GetParticipant from './GetParticipant.jsx';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';

  function App() {

   async function verifying(){
   var verifying = await VotingDAPP_backend.GetPrincipal();

   var result = await VotingDAPP_backend.getMember(verifying);
   console.log("after verifying",result);
  }
  for(var i=0;i<1;i++){
    verifying();
  };
  return(
    <>
      {/* <Register /> */}
      <FPage />
      {/* <AddParticipants /> */}
      {/* <GetParticipant /> */}
    </>
  );
}

export default App;
