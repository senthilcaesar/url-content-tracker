import React from 'react';
import { Layout } from 'lucide-react';

export function Login({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card glass">
        <div className="login-header">
          <div className="login-icon">
            <Layout size={32} />
          </div>
          <h1>ZenShelf</h1>
          <p>Your digital sanctuary for knowledge & curation</p>
        </div>
        
        <div className="login-content">
          <p>Sign in to sync your collection across all your devices securely.</p>
          <button onClick={onLogin} className="btn-primary login-button">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
            Continue with Google
          </button>
        </div>
        
        <div className="login-footer">
          <p>Private • Secure • Cloud Synced</p>
        </div>
      </div>
    </div>
  );
}
