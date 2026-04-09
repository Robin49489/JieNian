/**
 * useWeb3Auth.ts — Real MetaMask authentication hook for 界念
 *
 * Flow:
 * 1. Request wallet account via eth_requestAccounts
 * 2. Fetch nonce/message from backend challenge endpoint
 * 3. Prompt MetaMask personal_sign → user signs message
 * 4. Backend verifies ECDSA signature and returns JWT
 * 5. Save token + user to localStorage, update app state
 */

import { useState } from 'react';

const isProd = import.meta.env.PROD;
const API_BASE = import.meta.env.VITE_API_URL || (isProd ? '' : 'http://localhost:8081');

export interface AuthUser {
  name: string;
  type: 'twitter' | 'metamask';
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

export function useWeb3Auth(
  setUser: (user: AuthUser | null) => void,
  setIsLoginModalOpen: (open: boolean) => void
) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setError(null);

    // Guard: MetaMask must be installed
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      alert(
        'MetaMask is not detected.\n\nPlease install the MetaMask browser extension and try again.\nhttps://metamask.io/download/'
      );
      return;
    }

    setIsConnecting(true);

    try {
      // Step 1: Request account access — triggers MetaMask popup if not yet connected
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask');
      }

      const address = accounts[0].toLowerCase();

      // Step 2: Get signing challenge from backend
      const challengeRes = await fetch(
        `${API_BASE}/api/v1/auth/web3/challenge?address=${encodeURIComponent(address)}`
      );

      if (!challengeRes.ok) {
        const err = await challengeRes.json().catch(() => ({}));
        throw new Error((err as any).error || 'Failed to get signing challenge from server');
      }

      const { message } = await challengeRes.json();

      // Step 3: Ask MetaMask to sign the message — triggers MetaMask popup
      const signature: string = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Step 4: Verify signature on backend, receive JWT
      const verifyRes = await fetch(`${API_BASE}/api/v1/auth/web3/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error((err as any).error || 'Signature verification failed');
      }

      const { token, name } = await verifyRes.json();

      // Step 5: Persist to localStorage and update state
      localStorage.setItem('jn_token', token);
      localStorage.setItem('jn_user', JSON.stringify({ name, type: 'metamask' }));

      setUser({ name, type: 'metamask' });
      setIsLoginModalOpen(false);

    } catch (err: any) {
      if (err?.code === 4001) {
        // User rejected the MetaMask request
        setError('Connection cancelled.');
      } else {
        setError(err?.message || 'MetaMask connection failed. Please try again.');
        console.error('[Web3Auth]', err);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect, isConnecting, error };
}
