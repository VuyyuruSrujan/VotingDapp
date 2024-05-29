import { useState, useEffect } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function GetMyProposals() {
    const [proposals, setProposals] = useState([]);
    const [participants, setParticipants] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [votingResults, setVotingResults] = useState({});

    useEffect(() => {
        async function fetchProposals() {
            var principal = await VotingDAPP_backend.GetPrincipal();
            var result = await VotingDAPP_backend.getProposalsByPrincipal(principal);
            setProposals(result);
        }
        fetchProposals();
    }, []);

    // async function getProposal(id) {
    //     var result = await VotingDAPP_backend.getParticipantsById(String(id));
    //     setParticipants(result[0]);
    //     if (participants == null) {
    //         alert("no participants for this proposal");
    //         return;
    //       }
    // }

    // function handleSelectParticipant(participantName) {
    //     setSelectedParticipant(participantName);
    // }

    // async function handleSubmit() {
    //     var principal = await VotingDAPP_backend.GetPrincipal();
    //     var propId = BigInt(participants.proposalid);
    //     console.log(propId);

    //     var checking = await VotingDAPP_backend.GetVotedListByPrincipal(principal);
    //     console.log("checking", checking);

    //     // Check if the user has already voted on the current proposal
    //     const hasVoted = checking.some(vote => vote.Id === propId);

    //     if (hasVoted) {
    //         toast.warn('You have already voted on this proposal.', {
    //             position: "bottom-left",
    //             autoClose: 2000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //         });
    //     } else {
    //         var VotedData = {
    //             caller: principal,
    //             Id: propId
    //         };

    //         var push = await VotingDAPP_backend.VotedList(VotedData);
    //         console.log("after pushing", push);

    //         // Print the selected participant directly
    //         console.log("Selected participant:", selectedParticipant);
    //         console.log("Proposal ID:", participants.proposalid);

    //         var voteData = {
    //             votingProposalId: BigInt((participants.proposalid)),
    //             VotedName: selectedParticipant
    //         }
    //         var FinalResult = await VotingDAPP_backend.finalRes(voteData);
    //         console.log(FinalResult);
    //         toast.success('Voted successfully', {
    //             position: "bottom-left",
    //             autoClose: 2000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //         });
    //     }
    // }

    async function EndVoting(id) {
        var end = await VotingDAPP_backend.GetresultByProposalId(BigInt(id));
        console.log(end);

        if (!end || end.length == "") {
            toast.warn('No votes found for this proposal.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

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
    }

    return (
        <div>
            <div id='UserProposals'>
                <h1 id="MyProposals">My proposals</h1>
                <div id="UsProposals">
                    {proposals.length === 0 ? <p>No proposals found.</p> :
                        <div>
                            {proposals.map((proposal) => {
                                return (
                                    <div id='MyPropContent' key={proposal.id} onClick={() => getProposal(proposal.id)}>
                                        <h3>Proposal ID:{Number(proposal.id)}</h3>
                                        <p>Content: {proposal.content.AddGoal}</p>
                                        <p>Creator:{proposal.creator.toString()}</p>
                                        <p>Created:{proposal.created}</p>
                                        <p>Vote Score: {proposal.voteScore}</p>
                                        <p>Status: {proposal.status ? 'Open' : 'Closed'}</p>

                                        <button id="EndBtn" onClick={() => EndVoting(Number(proposal.id))}>End This Voting</button>
                                        {votingResults[proposal.id] &&
                                            <div><br />
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
{/* 
            <div>
                {participants === null ? <p>Select a proposal to see participants.</p> :
                    <div>
                        <div key={participants.proposalid}>
                            <h5>Proposal ID: {participants.proposalid}</h5>
                            <h5>Participants in proposal:</h5>
                            {participants.Addpart.length === 0 ? <p>No participants found.</p> :
                                <ul>
                                    {participants.Addpart.map(participant => (
                                        <div key={participant}>
                                            <input type="radio" name="participant" value={participant} id={participant} onChange={() => handleSelectParticipant(participant)} />
                                            <label htmlFor={participant}>{participant}</label>
                                        </div>
                                    ))}
                                </ul>
                            }
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                }
            </div> */}
            <ToastContainer />
        </div>
    );
}

export default GetMyProposals;
