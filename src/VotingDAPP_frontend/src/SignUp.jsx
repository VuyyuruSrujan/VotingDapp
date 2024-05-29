import React from 'react';
import { Helmet } from 'react-helmet';
import { useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

export default function SignUp() {
   const navigate = useNavigate(); // Initialize navigate function

   async function handleConnect() {
      const authClient = await AuthClient.create();
      authClient.login({
         maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
         identityProvider: "https://identity.ic0.app/#authorize",
         onSuccess: async () => {
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
            // Navigate to '/First' when successfully logged in
            navigate('/check-verification');
         },
      });
   }

   return (
      <>
         <Helmet>
            <title>Student_results_ICP</title>
            {/* Add other meta tags as needed */}
         </Helmet>

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

         <div>
            <h1></h1>
            <button onClick={handleConnect} id='ConnectBtn'>Connect</button>
         </div>
         <div>
         <ul>
          <li> <b>Connect to Internet Identity</b> to Cast your vote </li><br /><br />
          <li><b>Note : You can vote for the proposals which are shown in <b>all proposals</b></b></li><br /><br />
          <li>you can create voting and can add participants to participate in voting</li><br /><br />
          <li>And can End the voting so that you will get the result</li><br /><br />
          <li>A User can vote only one time for a proposal</li><br /><br />
          </ul>


         </div>
      </>
   );
}

