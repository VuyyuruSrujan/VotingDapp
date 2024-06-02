import React, { useState,useEffect } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthClient } from "@dfinity/auth-client";

function AddParticipants() {
  const [participants, setParticipants] = useState([]);
  const [proposalId, setProposalId] = useState('');
  const [identity, setIdentity] = useState(null);

  async function handleConnect() {
    const authClient = await AuthClient.create();
    if (identity !== null) {
      authClient.logout();
      setIdentity(null);
      toast.info('Logged Out Successfully.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      authClient.login({
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          setIdentity(await authClient.getIdentity());
          toast.success('Logged In Successfully.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        },
      });
    }
  }

  useEffect(() => {
    async function init() {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        setIdentity(await authClient.getIdentity());
      }
    }
    init();
  }, []);


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
    var CurrentPrincipal = identity.getPrincipal();
    var checkingOwnerOfPrincipal  = await VotingDAPP_backend.getProposal(BigInt(proposalId));
    console.log("checkingOwnerOfPrincipal",checkingOwnerOfPrincipal);
    if(checkingOwnerOfPrincipal[0].creator.toString() === CurrentPrincipal.toString()){
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
      
    }else{
      console.log('you are not the creator of this proposal');
      alert("you are not the creator of this proposal");
    }
    
  };

  return (
    <div>
      <div id='NoteProp'>
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
          <button onClick={handleAddParticipant} id='AddPartBtn'>Add Participant</button><br /><br />
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