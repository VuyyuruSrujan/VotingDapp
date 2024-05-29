import { useState, useEffect } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { Principal } from '@dfinity/principal';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function Balance() {
    const [balance, setBalance] = useState(null);
    const [principal, setPrincipal] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchBalance() {
            try {
                var principal = await VotingDAPP_backend.GetPrincipal();
                setPrincipal(principal.toString()); // Convert principal to string
                var balance = await VotingDAPP_backend.balanceOf(principal);
                setBalance(balance);
                console.log(principal);
            } catch (error) {
                console.error("Error fetching balance or principal:", error);
            }
        }
        fetchBalance();
    }, []);

    async function TransferTokens() {
        try {
            var SenderPrincipal = Principal.fromText(principal); // Validate sender principal
            var ReceiverPrincipal = Principal.fromText(document.getElementById('ReceiverPrincipal').value); // Validate receiver principal
            var NumberOfTokens = parseFloat(document.getElementById('SendingTokens').value); // Ensure tokens are in correct format

            if (isNaN(NumberOfTokens) || NumberOfTokens <= 0) {
                throw new Error("Invalid number of tokens.");
            }

            var transfer = await VotingDAPP_backend.transfer(SenderPrincipal, ReceiverPrincipal, NumberOfTokens);
            console.log(transfer);
            toast.success('Transfer successful', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.error("Error during transfer:", error);
            toast.error(`Error during transfer: ${error.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    function handleBackgroundClick(event) {
        if (event.target.id === 'modalBackground') {
            setShowModal(false);
        }
    }

    return (
        <div>
            <div id='BalDiv' onClick={() => setShowModal(true)}>
                Balance: {balance !== null ? Number(balance) : 'Loading...'} <b>MIC</b><br /><small>(Transferable)</small>
            </div>

            {showModal && (
                <div id="modalBackground" onClick={handleBackgroundClick}>
                    <div id='TransDiv'>
                        <p>Transfer your tokens to anyone by using their principal</p>
                        <label>My Principal:</label>
                        <input type='text' id='senderPrincipal' value={principal} readOnly /><br /><br />

                        <label>Receiver's principal:</label>
                        <input type='text' id='ReceiverPrincipal' /><br /><br />

                        <label>Number of Tokens:</label>
                        <input type='number' id='SendingTokens' /><br /><br />

                        <button id='TransBtn' onClick={TransferTokens}>Transfer</button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

