import React, { useState } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';

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

    
  };

  return (
    <div>
      <div>
        <label>Enter proposal id </label>
        <input type="text" value={proposalId} onChange={handleProposalIdChange} required />
      </div>
      {participants.map((participant, index) => (
        <div key={index}>
          <label>Participant {index + 1} Name:</label>
          <input
            type="text"
            value={participant}
            onChange={(e) => handleParticipantNameChange(index, e)}
            required
          />
        </div>
      ))}
      <button onClick={handleAddParticipant}>Add Participant</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AddParticipants;