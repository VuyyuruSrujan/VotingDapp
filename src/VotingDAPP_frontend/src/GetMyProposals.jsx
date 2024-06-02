import { useState, useEffect } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AuthClient } from "@dfinity/auth-client";

function GetMyProposals() {
    const [proposals, setProposals] = useState([]);
    const [participants, setParticipants] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [votingResults, setVotingResults] = useState({});
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

    useEffect(() => {
        async function fetchProposals() {
            if (identity) {
                try {
                    const MyProposal = identity.getPrincipal();
                    const result = await VotingDAPP_backend.getProposalsByPrincipal(MyProposal);
                    setProposals(result);
                    console.log("Only my proposals", result);
                } catch (error) {
                    console.error("Error fetching proposals:", error);
                }
            }
        }
        fetchProposals();
    }, [identity]);

    async function EndVoting(id) {
        try {
            const end = await VotingDAPP_backend.GetresultByProposalId(BigInt(id));
            if (!end || end.length === 0) {
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

            setVotingResults(prevResults => ({
                ...prevResults,
                [id]: voteCounts
            }));
        } catch (error) {
            console.error("Error ending voting:", error);
        }
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
                                    <div id='MyPropContent' key={proposal.id}>
                                        <h3>Proposal ID:{Number(proposal.id)}</h3>
                                        <p>Content: {proposal.content.AddGoal}</p>
                                        <p>Creator:{proposal.creator.toString()}</p>
                                        <p>Created:{proposal.created}</p>
                                        <p>Vote Score: {proposal.voteScore}</p>
                                        <p>Status: {proposal.status ? 'Open' : 'Closed'}</p>

                                        <button id="EndBtn" onClick={(e) => {
                                            e.stopPropagation(); // Prevent click event from bubbling up to the proposal div
                                            EndVoting(Number(proposal.id));
                                        }}>End This Voting</button>
                                        {votingResults[proposal.id] &&
                                            <div><br />
                                                <h4>Voting Results:</h4>
                                                <ul>
                                                    {Object.entries(votingResults[proposal.id]).map(([name, count]) => (
                                                        <li key={name}>{name}: {count} votes</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default GetMyProposals;
