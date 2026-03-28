import React from 'react';

export const metadata = {
  title: 'Authentication | Factory Flow',
  description: 'Login or create an account for the Factory Flow digital ecosystem.',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* 
        We use a flex layout to center the auth content. 
        The split-screen design will be handled inside the individual pages 
        to allow flexibility, but we provide a unified clean background here.
      */}
      {children}
    </div>
  );
}
