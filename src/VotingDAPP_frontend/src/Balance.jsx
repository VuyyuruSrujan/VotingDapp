import { useState, useEffect } from 'react';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import { Principal } from '@dfinity/principal';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AuthClient } from "@dfinity/auth-client";

export default function Balance() {
    const [balance, setBalance] = useState('');
    const [showModal, setShowModal] = useState(false);
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
        async function fetchBalance() {
            if (identity) {
                try {
                    const myPrincipal = identity.getPrincipal();
                    const balance = await VotingDAPP_backend.balanceOf(myPrincipal);
                    setBalance(balance);
                } catch (error) {
                    console.error("Error fetching balance or principal:", error);
                }
            }
        }
        fetchBalance();
    }, [identity]);

    async function TransferTokens() {
        // try {
            const senderPrincipal = identity.getPrincipal();
            const receiverPrincipal = Principal.fromText(document.getElementById('ReceiverPrincipal').value);
            const numberOfTokens = parseFloat(document.getElementById('SendingTokens').value);

            if (isNaN(numberOfTokens) || numberOfTokens <= 0) {
                throw new Error("Invalid number of tokens.");
            }

            const transfer = await VotingDAPP_backend.transfer(senderPrincipal, receiverPrincipal, numberOfTokens);
            console.log(transfer);
            if('ok' in transfer){
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
        }else if(transfer.err){ 
            toast.error( transfer.err, {
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
           
        // } catch (error) {
        //     console.error("Error during transfer:", error);
        //     toast.error(`Error during transfer: ${error.message}`, {
        //         position: "top-right",
        //         autoClose: 2000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "light",
        //     });
        // }
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
                        <input type='text' id='senderPrincipal' value={identity ? identity.getPrincipal().toText() : 'Loading...'} readOnly /><br /><br />

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
