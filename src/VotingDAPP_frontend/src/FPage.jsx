import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AddParticipants from './AddParticipants';
import GetMyProposals from './GetMyProposals';
import Balance from './Balance';
import { AuthClient } from "@dfinity/auth-client";

function FPage() {
  const [proposals, setProposals] = useState([]);
  const [participants, setParticipants] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [votingResults, setVotingResults] = useState({});
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
///////////////////////////////////////////////////////////////////////principal data
const [identity, SetIdentity] = useState(null);

async function handleConnect() {
   var authClient = await AuthClient.create();
   if (identity !== null) {
      authClient.logout();
      SetIdentity(null);
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
            SetIdentity(await authClient.getIdentity());
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
      var authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
         SetIdentity(await authClient.getIdentity());
      }
   }
   init();
}, []);

///////////////////////////////////////////////////////////////////////////////////////
    async function fetchData() {
      const res = await VotingDAPP_backend.getAllProposals();
      setProposals(res);
    }
    
    for(var i=0;i<1;i++){
      fetchData();
    }

  async function getProposal(id) {
    const result = await VotingDAPP_backend.getParticipantsById(String(id));
    if (result.length > 0) {
      setParticipants(result[0]);
      setSelectedProposalId(id);
      setIsModalVisible(true);
    } else {
      setParticipants(null);
      setSelectedProposalId(null);
      setIsModalVisible(false);
      alert("no participants for this proposal");
    }
  }

  async function CreateProposal() {
    const prop = document.getElementById('propCont').value;

    if (prop === "") {
      toast.warn('Proposal should not be empty', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.success('Successfully created', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      const proptext = {
        AddGoal: prop,
        creator:identity.getPrincipal()
      };
      const result = await VotingDAPP_backend.createProposal(proptext);
      console.log(result);
      // Refresh proposals list after creating a new proposal
      fetchData();
    }
  }

  function handleSelectParticipant(participantName) {
    setSelectedParticipant(participantName);
  }

  async function handleSubmit() {
    if (!participants || !participants.proposalid) {
      alert("no participants for this proposal");
      return;
    }
    // const principal = await VotingDAPP_backend.GetPrincipal();
    const principal = identity.getPrincipal();
    const propId = BigInt(participants.proposalid);
    console.log(propId);

    const checking = await VotingDAPP_backend.GetVotedListByPrincipal(principal); 
    console.log("checking", checking);

    // Check if the user has already voted on the current proposal
    const hasVoted = checking.some(vote => vote.Id === propId);

    if (hasVoted) {
      // toast.warn('You have already voted on this proposal.', {
      //   position: "bottom-left",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
      alert("You have already voted on this proposal.");
    }else {
      const VotedData = {
        caller: principal,
        Id: propId
      };

      const push = await VotingDAPP_backend.VotedList(VotedData);
      console.log("after pushing", push);

      // Print the selected participant directly
      console.log("Selected participant:", selectedParticipant);
      console.log("Proposal ID:", participants.proposalid);

      const voteData = {
        votingProposalId: BigInt(participants.proposalid),
        VotedName: selectedParticipant
      };
      const FinalResult = await VotingDAPP_backend.finalRes(voteData);
      console.log(FinalResult);
      toast.success('Voted successfully', {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  function handleBackgroundClick(event) {
    if (event.target === event.currentTarget) {
      setIsModalVisible(false);
    }
  }

  return (
    <div>
      <Balance />
      <div id='proposalsBox'>
        <h1 id="ALLproposals">All proposals</h1>
        <div id="proposals">
          {proposals.length === 0 ? null :
            <div>
              {proposals.map((proposal) => {
                return (
                  <div id='propContent' key={proposal.id} onClick={() => getProposal(proposal.id)}>
                    <h3>Proposal ID:{Number(proposal.id)}</h3>
                    <p>Content: {proposal.content.AddGoal}</p>
                    <p>Creator:{proposal.creator.toString()}</p>
                    <p>Created:{proposal.created}</p>
                    <p>Status: {proposal.status ? 'Open' : 'Closed'}</p>
                    {votingResults[proposal.id] &&
                      <div>
                        <p>Most Voted Name: {votingResults[proposal.id].name}</p>
                        <p>Votes: {votingResults[proposal.id].count}</p>
                      </div>
                    }
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>
      {isModalVisible && (
        <div id="modalFPageBackground" onClick={handleBackgroundClick}>
          <div id='TransFPageDiv'>
            {participants === null ? null :
              <div>
                <div key={participants.proposalid}>
                  <h5>Proposal ID: {participants.proposalid}</h5>
                  <h5>Participants in proposal:</h5>
                  {participants.Addpart.length === 0 ? (
                    <p>There are no participants to vote.</p>
                  ) : (
                    <ul>
                      {participants.Addpart.map(participant => (
                        <div key={participant}>
                          <input type="radio" name="participant" value={participant} id={participant} onChange={() => handleSelectParticipant(participant)} />
                          <label htmlFor={participant}>{participant}</label>
                        </div>
                      ))}
                    </ul>
                  )}
                  <button onClick={handleSubmit} id='FPageSubmitBtn'>Submit</button>
                </div>
              </div>
            }
          </div>
        </div>
      )}
      <div id="CreateProposal">
        <p id="msg"><b>Note:</b>For voting you can click on any proposal(in all proposals) you want to vote and then continue your voting</p>
        <p>Create proposal and then add participants to participate in voting</p>
        <p><b>Note:</b>If you create a proposal then <b>1 MIC Token will Burn</b></p>
        <label>Create your new proposal:</label>
        <input type='text' id="propCont" required /><br /><br />
        <button onClick={CreateProposal} id='CreateProposalBtn'>Create proposal</button>
      </div>
      <div id='AddpartComp'>
        <AddParticipants />
      </div>
      <GetMyProposals />
      <ToastContainer />
    </div>
  );
}

export default FPage;