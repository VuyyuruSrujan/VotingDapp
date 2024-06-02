import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from 'react-router-dom';

export default function VotePage() {
   const [identity, setIdentity] = useState(null);
   const navigate = useNavigate(); 

   async function handleConnect() {
      var authClient = await AuthClient.create();
      authClient.login({
         maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
         identityProvider: "https://identity.ic0.app/#authorize",
         onSuccess: async () => {
            const identity = await authClient.getIdentity();
            setIdentity(identity);
            navigate('/check-verification');
         },
      });
   }

   useEffect(() => {
      async function init() {
         var authClient = await AuthClient.create();
         if (await authClient.isAuthenticated()) {
            const identity = await authClient.getIdentity();
            setIdentity(identity);
         }
      }
      init();
   }, []);
   
   return (
      <>
         <div>
            <button id="ConnectBtn"
               onClick={handleConnect}
               style={{
                  cursor: "pointer",
                  marginTop: "32px"
               }}
            >
               Connect
            </button>
         </div>
         <div>
            <ul>
               <li>Create your profile and get <b>100 MIC</b> Tokens.</li><br /><br />
               <li>With that <b>MIC TOKENS</b> you can create proposal for voting then every one can vote for your proposal.</li><br /><br />
               <li>For creating each proposal it will burn <b>1 MIC TOKEN</b></li><br /><br />
               <li>You can <b>transfer</b> the <b>MIC TOKENS</b> for anyone by using <b>Principal Id's</b></li><br /><br />
               <li>To cast your vote you can click on any proposal in all proposals and can cast your vote</li><br /><br />
               <li>You can only vote once for a proposal</li>
            </ul>
         </div>
         
      </>
   );
}
