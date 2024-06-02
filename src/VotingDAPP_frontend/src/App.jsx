import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FPage from './FPage.jsx';
import Register from './Register.jsx';
import { VotingDAPP_backend } from 'declarations/VotingDAPP_backend';
import SignUp from './SignUp';
import { AuthClient } from "@dfinity/auth-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isVerified, setIsVerified] = useState(null);
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
    async function verifying() {
      if (identity) {
        try {
          const userPrincipal = identity.getPrincipal();
          const result = await VotingDAPP_backend.getMember(userPrincipal);
          console.log("after verifying", result);

          if (result.ok) {
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
        } catch (error) {
          console.error('Error during verification:', error);
          setIsVerified(false);
        }
      } else {
        setIsVerified(false);
      }
    }

    verifying();
  }, [identity]);

  if (isVerified == null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/check-verification" element={isVerified ? <Navigate to="/fpage" /> : <Register />} />
        <Route path="/fpage" element={<FPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

