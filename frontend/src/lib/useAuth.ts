/**
 * useAuth.ts — Centralized Twitter authentication hook for 界念
 *
 * Flow:
 * 1. On mount: restore session from localStorage
 * 2. On mount: check URL for ?token= (Twitter callback) or ?auth_error=
 * 3. Provides user state, login modal control, and logout
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8081');

export interface AuthUser {
  name: string;        // e.g. "@summer0942"
  displayName: string; // e.g. "Summer"
  avatar: string;      // Twitter profile_image_url
  type: 'twitter';
}

/** Decode a JWT payload without verifying (client-side only) */
function decodeJwtPayload(token: string): any {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore session on mount + handle Twitter callback redirect
  useEffect(() => {
    // 1. Check URL for ?token= (Twitter OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlError = params.get('auth_error');

    if (urlToken) {
      // Decode JWT and store
      const payload = decodeJwtPayload(urlToken);
      if (payload && payload.name) {
        const authUser: AuthUser = {
          name: payload.name,
          displayName: payload.displayName || payload.name,
          avatar: payload.avatar || '',
          type: 'twitter',
        };
        localStorage.setItem('jn_token', urlToken);
        localStorage.setItem('jn_user', JSON.stringify(authUser));
        setUser(authUser);
      }
      // Clean URL
      const clean = new URL(window.location.href);
      clean.searchParams.delete('token');
      window.history.replaceState({}, '', clean.pathname + clean.hash);
      return;
    }

    if (urlError) {
      setAuthError(urlError === 'cancelled' ? '登录已取消' : '登录失败，请重试');
      const clean = new URL(window.location.href);
      clean.searchParams.delete('auth_error');
      window.history.replaceState({}, '', clean.pathname + clean.hash);
      // Auto-clear after 5s
      setTimeout(() => setAuthError(null), 5000);
      return;
    }

    // 2. Restore from localStorage
    const storedToken = localStorage.getItem('jn_token');
    const storedUser = localStorage.getItem('jn_user');
    if (storedToken && storedUser) {
      try {
        // Check if token is expired
        const payload = decodeJwtPayload(storedToken);
        if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
        } else {
          // Token expired, clean up
          localStorage.removeItem('jn_token');
          localStorage.removeItem('jn_user');
        }
      } catch {
        localStorage.removeItem('jn_token');
        localStorage.removeItem('jn_user');
      }
    }
  }, []);

  const openLogin = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jn_token');
    localStorage.removeItem('jn_user');
    setUser(null);
  }, []);

  const getToken = useCallback((): string | null => {
    return localStorage.getItem('jn_token');
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isLoginModalOpen,
    authError,
    openLogin,
    closeLogin,
    logout,
    getToken,
  };
}
