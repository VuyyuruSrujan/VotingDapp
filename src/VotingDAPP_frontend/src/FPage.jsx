import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { useState, useEffect } from 'react';

function FPage() {
  const [proposals, setProposals] = useState([]);
  const [participants, setParticipants] = useState(null);
  var [selectedParticipant, setSelectedParticipant] = useState(null);
  const [status, setStatus] = useState('notVoted');

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
    var proptext = {
      AddGoal: prop
    };
    var result = await VotingDAPP_backend.createProposal(proptext);
    console.log(result);
  }

  function handleSelectParticipant(participantName) {
    setSelectedParticipant(participantName);
  }

  async function handleSubmit() {
    var propId = BigInt((participants.proposalid));
    console.log(propId)
    var checking = await VotingDAPP_backend.getVotedIds();
  console.log("verification result:", checking);

  // Check if the proposal ID is already in the list of voted IDs
  if (checking.some(item => item.id == propId)) {
      console.log("you already voted");
    }
    else{
      // Count the number of selections for each participant
      const selectionsCount = {};
      participants.Addpart.forEach(participant => {
        selectionsCount[participant] = document.getElementById(participant).checked ? 1 : 0;
      });
  
      // Find the participant with the highest number of selections
      let maxSelections = 0;
      selectedParticipant = null;
      Object.keys(selectionsCount).forEach(participant => {
        if (selectionsCount[participant] > maxSelections) {
          maxSelections = selectionsCount[participant];
          selectedParticipant = participant;
        }
      });
  
      // Print the result to the console along with the proposal ID
      console.log("Selected participant with the highest number of selections:", selectedParticipant);
      console.log("Number of selections:", maxSelections);
      console.log("Proposal ID:", participants.proposalid);
      var bewkj = {
        id:BigInt((participants.proposalid))
      };
      var afterPushing = await VotingDAPP_backend.VotedIdList(bewkj);
      console.log("id pushed to backend",afterPushing);
      // Update status to 'voted' and disable further voting
      setStatus('voted');
      disableVoting();
    }
  }

  function disableVoting() {
    participants.Addpart.forEach(participant => {
      document.getElementById(participant).disabled = true;
    });
  }

  function calculatePercentage(participant) {
    if (!participants || participants.Addpart.length === 0) return 0;
    const totalVotes = participants.Addpart.reduce((total, participant) => {
      return total + (document.getElementById(participant).checked ? 1 : 0);
    }, 0);
    return ((document.getElementById(participant).checked ? 1 : 0) / totalVotes) * 100;
  }
  

  return (
    <div>
      <div id='proposalsBox'>
        <h1 id="ALLproposals">All proposals</h1>
        <div id="proposals">
          {proposals.length === 0 ? null :
            <div>
              {proposals.map((proposal) => {
                return (
                  <div key={proposal.id} onClick={() => getProposal(proposal.id)}>
                    <hr />
                    <h3>Proposal ID:{Number(proposal.id)}</h3>
                    <p>Content: {proposal.content.AddGoal}</p>
                    <p>Creator:{proposal.creator.toString()}</p>
                    <p>Created:{proposal.created}</p>
                    <p>Votes: {proposal.votes.length}</p>
                    <p>Vote Score: {proposal.voteScore}</p>
                    <p>Status: {proposal.status ? 'Open' : 'Closed'}</p>
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
                    {status === 'voted' ? <span> - {calculatePercentage(participant).toFixed(2)}%</span> : null}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        }
      </div>
      <div id="CreateProposal">
        <label>Enter your proposal:</label>
        <input type='text' id="propCont" required /><br /><br />
        <button onClick={CreateProposal}>Create proposal</button>
      </div>
      <div>
        <button onClick={handleSubmit} disabled={status === 'voted'}>Submit</button>
      </div>
    </div>
  );
}

export default FPage;
