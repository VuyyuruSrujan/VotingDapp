import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AddParticipants from './AddParticipants';
import GetMyProposals from './GetMyProposals';

function FPage() {
  const [proposals, setProposals] = useState([]);
  const [participants, setParticipants] = useState(null);
  var [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [votingResults, setVotingResults] = useState({});


  useEffect(() => {
    async function fetchData() {
      const res = await VotingDAPP_backend.getAllProposals();
      setProposals(res);
    }
    fetchData();
  }, []);

  async function getProposal(id) {
    var result = await VotingDAPP_backend.getParticipantsById(String(id));
    setParticipants(result[0]);
  }

  async function CreateProposal() {
    var prop = document.getElementById('propCont').value;

    if(prop == ""){
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
    } else{
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
    var proptext = {
      AddGoal: prop,
    };
    var result = await VotingDAPP_backend.createProposal(proptext);
    console.log(result);
    setIsDivVisible(!isDivVisible);
  };
};

  function handleSelectParticipant(participantName) {
    setSelectedParticipant(participantName);
  }

  async function handleSubmit() {
    var principal = await VotingDAPP_backend.GetPrincipal();
    var propId = BigInt(participants.proposalid);
    console.log(propId);

    var checking = await VotingDAPP_backend.GetVotedListByPrincipal(principal);
    console.log("checking", checking);

    // Check if the user has already voted on the current proposal
    const hasVoted = checking.some(vote => vote.Id === propId);

    if (hasVoted) {
        toast.warn('You have already voted on this proposal.', {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    } else {
        var VotedData = {
            caller: principal,
            Id: propId
        };

        var push = await VotingDAPP_backend.VotedList(VotedData);
        console.log("after pushing", push);

        // Print the selected participant directly
        console.log("Selected participant:", selectedParticipant);
        console.log("Proposal ID:", participants.proposalid);
        
        var voteData ={
            votingProposalId:BigInt((participants.proposalid)),
            VotedName:selectedParticipant
        }
        var FinalResult = await VotingDAPP_backend.finalRes(voteData);
        console.log(FinalResult);
        toast.success('voted successfully', {
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
};
  

  async function EndVoting(id) {
    var end = await VotingDAPP_backend.GetresultByProposalId(BigInt(id));
    console.log(end);

    const voteCounts = end.reduce((acc, vote) => {
        if (acc[vote.VotedName]) {
            acc[vote.VotedName]++;
        } else {
            acc[vote.VotedName] = 1;
        }
        return acc;
    }, {});

    // Determine the name with the highest count
    const mostVotedName = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);

    setVotingResults(prevResults => ({
        ...prevResults,
        [id]: { name: mostVotedName, count: voteCounts[mostVotedName] }
    }));

    console.log(`Most voted name: ${mostVotedName} with ${voteCounts[mostVotedName]} votes.`);
    
};
  return (
    <div>
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
                    {/* <p>Votes: {proposal.votes.length}</p> */}
                    {/* <p>Vote Score: {proposal.voteScore}</p> */}
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
      <div>
        {participants === null ? null :
          <div>
            <div key={participants.proposalid}>
              <h5>Proposal ID: {participants.proposalid}</h5>
              <h5>Participants in proposal:</h5>
              <ul>
                {participants.Addpart.map(participant => (
                  <div key={participant}>
                    <input type="radio" name="participant" value={participant} id={participant} onChange={() => handleSelectParticipant(participant)} />
                    <label htmlFor={participant}>{participant}</label>
                  </div>
                ))}
              </ul>
              <button onClick={handleSubmit} >Submit</button>
            </div>
          </div>
        }
      </div>
      <div id="CreateProposal">
        <p>Create proposal and then add participants to participate in voting</p>
        <label>Create your new proposal:</label>
        <input type='text' id="propCont" required /><br /><br />
        <button onClick={CreateProposal}>Create proposal
        {/* {isDivVisible ? '' : ''} */}
        </button>
      </div>
      {/* {isDivVisible && ( */}
        <div id='AddpartComp'>
            <AddParticipants />
        </div>
      {/* )} */}
      <div>
      </div>
      <ToastContainer />

      <GetMyProposals />

    </div>
  );
}


export default FPage;
