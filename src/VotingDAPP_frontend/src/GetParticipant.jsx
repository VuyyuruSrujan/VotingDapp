import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';

function GetParticipant(){
    let proposalsINGet = [];

    async function GetParti(){
       var proposalId = document.getElementById('proposalId').value;

       var result = await VotingDAPP_backend.getParticipantsById(proposalId);

       console.log(result);
       proposalsINGet = result;
    renderProposals();
    }

    // function renderProposals(){
    //     document.getElementById("proposalsInGetPage").innerHTML = proposalsINGet.map(proposalOne => (
    //         `<div key=${proposalOne.proposalid}>
    //           <h5>Proposal ID: ${proposalOne.proposalid}</h5>
    //           <h5>Participants in proposal: ${proposalOne.Addpart}</h5>              
    //           </div>`
    //       )).join('');
    // }

    function renderProposals() {
        document.getElementById("proposalsInGetPage").innerHTML = proposalsINGet.map(proposalOne => (
            `<div key=${proposalOne.proposalid}>
                <h5>Proposal ID: ${proposalOne.proposalid}</h5>
                <h5>Participants in proposal:</h5>
                <ul>
                    ${proposalOne.Addpart.map(participant => (
                        `<div>
                            <input type="radio" name="participant" value="${participant}" id="${participant}" />
                            <label for="${participant}">${participant}</label>
                        </div>`
                    )).join('')}
                </ul>
            </div>`
        )).join('');
    }

    return(
        <div>
            <div>
                <label>Enter proposal id</label>
                <input type="text" id="proposalId" required />
                <button onClick={GetParti}>Get proposal and participants</button>
            </div>
            <div id="proposalsInGetPage"> </div>
        </div>
    );
}

export default GetParticipant;


