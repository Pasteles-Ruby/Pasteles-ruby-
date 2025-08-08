import React from 'react';

export const AddIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

export const DeleteIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const CakeIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c-3.31 0-6-1.34-6-3s2.69-3 6-3 6 1.34 6 3-2.69 3-6 3zm0-4c-2.21 0-4 .9-4 2s1.79 2 4 2 4-.9 4-2-1.79-2-4-2z"/>
      <path d="M4 14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1c-2.34.63-5.02 1-8 1s-5.66-.37-8-1v1zm16.5-1.5c-1.33.34-2.83.5-4.5.5s-3.17-.16-4.5-.5c-1.33-.34-2.83-.5-4.5-.5S4.67 12.16 6 12.5c1.33.34 2.83.5 4.5.5s3.17-.16 4.5-.5c1.33-.34 2.83-.5 4.5-.5s-1.17.16-2.5.5zM20 18H4v-1c2.34.63 5.02 1 8 1s5.66-.37 8-1v1z"/>
      <path d="M4 21h16v-1c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v1z"/>
      <path d="M11.5 4.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z" />
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);