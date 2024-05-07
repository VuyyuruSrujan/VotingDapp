import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register(){

    async function SubmitDet(){
        var name = document.getElementById('username').value;
        var  age =BigInt(document.getElementById('usrAge').value);
        var mail = document.getElementById('userMail').value;

        const member = {
            name:name,
            age:age,
            mail:mail
        }
        if(name.trim() !== "" && age > 0) {
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
            }
        }
        
    }
    

    return(
        <div>
            <div id="body1">
                <div id="userDetailsContainer">
                    <div id="userDetails">

                        <label>Enter your name:</label>
                        <input type="text" id="username" required/><br/><br /><br />

                        <label>Enter Age:</label>
                        <input type="number" id="usrAge" required/><br/><br /><br />

                        <label>Enter Mail:</label>
                        <input type='text' id="userMail" required /><br/><br /><br />

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
                                transition: Bounce
                        />                   
                         
                    </div>
                </div>

                <div id="message">
                    Fill your information
                </div>
            </div>
        </div>
    );
}
export default Register;

