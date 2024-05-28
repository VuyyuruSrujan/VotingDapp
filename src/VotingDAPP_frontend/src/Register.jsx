// import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
// import React from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function Register(){

//     async function SubmitDet(){
//         var name = document.getElementById('username').value;
//         var  age =BigInt(document.getElementById('usrAge').value);
//         var mail = document.getElementById('userMail').value;

//         const member = {
//             name:name,
//             age:age,
//             mail:mail
//         }
//         if(name.trim() !== "" && age > 0) {
//             var res = await VotingDAPP_backend.addMember(member);
//             if (res.err) {
//                 toast.error(res.err, {
//                     position: "bottom-right",
//                     autoClose: 900,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "colored",
//                 });
//             } else {
//                 toast.success("Member added successfully", {
//                     position: "bottom-right",
//                     autoClose: 900,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "colored",
//                 });
//             }
//         }else if(name == "" || age == "" || mail == ""){
//             toast.error("fill all the details", {
//                 position: "bottom-right",
//                 autoClose: 900,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "colored",
//             });
//         };
        
//     }
    

//     return(
//         <div>
//             <div id="body1">    
//                 <div id="message">
//                     Complete Your Profile & Get <b>100</b> MIC Tokens
//                 </div>

//                 <div id="userDetailsContainer">
//                     <div id="userDetails">

//                         <label>Enter your name:</label>
//                         <input type="text" id="username" required/><br/><br /><br />

//                         <label>Enter Age:</label>
//                         <input type="number" id="usrAge" required/><br/><br /><br />

//                         <label>Enter Mail:</label>
//                         <input type='text' id="userMail" required /><br/><br /><br />

//                         <button onClick={SubmitDet} id="UserDetbtn">Next</button>
//                         <ToastContainer
//                                 position="bottom-right"
//                                 autoClose={3000}
//                                 hideProgressBar={false}
//                                 newestOnTop={false}
//                                 closeOnClick
//                                 rtl={false}
//                                 pauseOnFocusLoss
//                                 draggable
//                                 pauseOnHover
//                                 theme="colored"
//                         />                   
                         
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }
// export default Register;

import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

function Register() {
  const [showAward, setShowAward] = useState(false);
  const navigate = useNavigate();

  async function SubmitDet() {
    var name = document.getElementById('username').value;
    var age = BigInt(document.getElementById('usrAge').value);
    var mail = document.getElementById('userMail').value;

    const member = {
      name: name,
      age: age,
      mail: mail
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
