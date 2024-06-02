import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { AuthClient } from "@dfinity/auth-client";

function Register() {
  const [showAward, setShowAward] = useState(false);
  const navigate = useNavigate();
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
            // toast.success('Logged In Successfully.', {
            //    position: "top-right",
            //    autoClose: 5000,
            //    hideProgressBar: false,
            //    closeOnClick: true,
            //    pauseOnHover: true,
            //    draggable: true,
            //    progress: undefined,
            //    theme: "light",
            // });
         },
      });
   }
}

// useEffect(() => {
   async function init() {
      var authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
         SetIdentity(await authClient.getIdentity());
      }
   }
   for(var i=0;i<1;i++){
    init();
   }
// }, []);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async function SubmitDet() {
    var name = document.getElementById('username').value;
    var age = BigInt(document.getElementById('usrAge').value);
    var mail = document.getElementById('userMail').value;
   var principal = identity.getPrincipal();
    const member = {
      name: name,
      age: age,
      mail: mail,
      creator:principal
    }

    if (name.trim() !== "" && age > 0) {
      var res = await VotingDAPP_backend.addMember(member);
      if (res.err) {
        toast.error(res.err, {
          position: "bottom-right",
          autoClose: 900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.success("Member added successfully", {
          position: "bottom-right",
          autoClose: 900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setShowAward(true);
        setTimeout(() => {
          setShowAward(false);
          navigate('/fpage'); // Navigate to Fpage
        }, 5000); // Hide confetti and navigate after 5 seconds
      }
    } else if (name === "" || age === "" || mail === "") {
      toast.error("Fill all the details", {
        position: "bottom-right",
        autoClose: 900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  return (
    <div>
      <div id="body1">
        <div id="message">
          Complete Your Profile & Get <b>100</b> MIC Tokens
        </div>

        <div id="userDetailsContainer">
          <div id="userDetails">
            <label>Enter your name:</label>
            <input type="text" id="username" required /><br /><br /><br />

            <label>Enter Age:</label>
            <input type="number" id="usrAge" required /><br /><br /><br />

            <label>Enter Mail:</label>
            <input type='text' id="userMail" required /><br /><br /><br />

            <button onClick={SubmitDet} id="UserDetbtn">Next</button>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </div>
      </div>
      {showAward && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
          />
          <div className={`award-card ${showAward ? 'show' : 'hide'}`}>
            Congratulations! You've earned 100 MIC Tokens!
          </div>
        </>
      )}
    </div>
  );
}

export default Register;
