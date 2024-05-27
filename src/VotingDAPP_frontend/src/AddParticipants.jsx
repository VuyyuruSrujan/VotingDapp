import React, { useState } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddParticipants() {
  const [participants, setParticipants] = useState([]);
  const [proposalId, setProposalId] = useState('');

  const handleAddParticipant = () => {
    setParticipants([...participants, '']);
  };

  const handleParticipantNameChange = (index, event) => {
    const newParticipants = [...participants];
    newParticipants[index] = event.target.value;
    setParticipants(newParticipants);
  };

  const handleProposalIdChange = (event) => {
    setProposalId(event.target.value);
  };

  async function handleSubmit() {
    // Here you can handle submission, for example, send data to backend or store it in a variable.
    console.log("Proposal ID:", proposalId);
    console.log("Participants:", participants);
    var Addpart = participants
    var proposalid;
    var AddParticipant = {
      Addpart:participants,
      proposalid:proposalId
    }
    var result = await VotingDAPP_backend.AddParticipant(AddParticipant);
    console.log("after pushing",result);
    
    toast.success("Participants added successfully", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    
  };

  return (
    <div>
      <div>
        <p><b>Note</b>:<p id='propNote'>Enter your proposal id and add participants to get voted (enter the proposal id by checking 
        it in the my proposals)</p></p>
        <label>Enter proposal id </label>
        <input type="text" value={proposalId} onChange={handleProposalIdChange} required />
      </div>
      {participants.map((participant, index) => (
        <div key={index}><br />
          <label>Participant {index + 1} Name:</label>
          <input
            type="text"
            value={participant}
            onChange={(e) => handleParticipantNameChange(index, e)}
            required
          />
        </div>
      ))}
      <div>
          <button onClick={handleAddParticipant}>Add Participant</button><br /><br />
          <button onClick={handleSubmit} id='PartSubmit'>Submit</button>
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
          />
      </div>
            
    </div>
  );
}

export default AddParticipants;