// import React from 'react';
// import FPage from './FPage.jsx';
// import Register from './Register.jsx';
// import AddParticipants from './AddParticipants.jsx';
// import GetParticipant from './GetParticipant.jsx';
// import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';

//   function App() {

//    async function verifying(){
//    var verifying = await VotingDAPP_backend.GetPrincipal();

//    var result = await VotingDAPP_backend.getMember(verifying);
//    console.log("after verifying",result);
//   }
//   for(var i=0;i<1;i++){
//     verifying();
//   };
//   return(
//     <>
//       <Register />
//       {/* <FPage /> */}
//       {/* <AddParticipants /> */}
//       {/* <GetParticipant /> */}
//     </>
//   );
// }

// export default App;
//////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FPage from './FPage.jsx';
import Register from './Register.jsx';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import SignUp from './SignUp';

function App() {
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    async function verifying() {
      try {
        const principal = await VotingDAPP_backend.GetPrincipal();
        const result = await VotingDAPP_backend.getMember(principal);
        console.log("after verifying", result);

        if (result.ok) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setIsVerified(false);
      }
    }

    verifying();
  }, []);

  if (isVerified === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/check-verification" element={isVerified ? <Navigate to="/fpage" /> : <Register />} />
        <Route path="/fpage" element={<FPage />} />
      </Routes>
    </Router>
  );
}

export default App;

