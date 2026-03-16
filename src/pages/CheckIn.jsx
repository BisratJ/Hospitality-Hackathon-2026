import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const API_URL = import.meta.env.VITE_API_URL || 'https://alx-hackathon-api.bisrojc60.workers.dev';
const ACCESS_CODE = 'HACKATHON2026';

const CheckIn = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [shake, setShake] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const scannerRef = useRef(null);

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem('checkin_authorized') === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  // Initialize QR scanner once authorized
  useEffect(() => {
    if (!isAuthorized) return;

    const timer = setTimeout(() => {
      if (scannerRef.current) return;
      const scanner = new Html5QrcodeScanner('qr-reader', {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      });
      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isAuthorized]);

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem('checkin_authorized', 'true');
      setIsAuthorized(true);
      setCodeError('');
    } else {
      setCodeError('Invalid access code. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const onScanSuccess = async (decodedText) => {
    try {
      const ticketData = JSON.parse(decodedText);
      
      const detailsResponse = await fetch(
        `${API_URL}/api/registration/${ticketData.ticketNumber}`
      );
      
      if (!detailsResponse.ok) throw new Error('Invalid ticket');

      const details = await detailsResponse.json();
      setRegistrationDetails(details);

      const checkInResponse = await fetch(
        `${API_URL}/api/checkin/${ticketData.ticketNumber}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );

      if (!checkInResponse.ok) {
        const error = await checkInResponse.json();
        throw new Error(error.message || error.error || 'Check-in failed');
      }

      setStatus({ type: 'success', message: 'Check-in successful!' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to process QR code'
      });
    }
  };

  const onScanError = (err) => {
    // Suppress continuous scan errors — only show camera access issues
  };

  const resetScan = () => {
    setRegistrationDetails(null);
    setStatus({ type: '', message: '' });
  };

  // ─── Authorization Gate ───
  if (!isAuthorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)' }}
      >
        <div className="w-full max-w-md">
          <div
            className={`px-6 py-8 sm:p-10 border border-neutral-700 rounded-2xl backdrop-blur-xl ${shake ? 'animate-shake' : ''}`}
            style={{
              background: 'rgba(23, 23, 23, 0.7)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <svg className="h-7 w-7 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Check-In Access
            </h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Enter the organizer access code to start checking in participants.
            </p>

            <form onSubmit={handleAccessSubmit}>
              <div className="mb-4">
                <label htmlFor="access-code" className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Access Code
                </label>
                <input
                  id="access-code"
                  type="password"
                  value={accessCode}
                  onChange={(e) => { setAccessCode(e.target.value); setCodeError(''); }}
                  placeholder="Enter code..."
                  autoFocus
                  className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-center text-lg tracking-widest font-mono"
                />
              </div>

              {codeError && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-sm text-center">
                  {codeError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)' }}
              >
                Unlock Check-In
              </button>
            </form>
          </div>
        </div>

        {/* Shake animation CSS */}
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
            20%, 40%, 60%, 80% { transform: translateX(6px); }
          }
          .animate-shake { animation: shake 0.6s ease-in-out; }
        `}</style>
      </div>
    );
  }

  // ─── QR Scanner (after authorization) ───
  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-3" style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Check-In Active
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Scan QR Code</h2>
          <p className="text-sm text-neutral-400">Point the camera at a participant's QR code</p>
        </div>

        <div
          className="px-4 py-5 sm:p-6 border border-neutral-700 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(23, 23, 23, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="mb-6">
            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
          </div>

          {status.message && (
            <div
              className={`mb-4 p-4 rounded-xl border text-sm font-medium ${
                status.type === 'success'
                  ? 'bg-green-900/30 text-green-300 border-green-700/50'
                  : status.type === 'error'
                  ? 'bg-red-900/30 text-red-300 border-red-700/50'
                  : 'bg-neutral-800/50 text-neutral-300 border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {status.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                )}
                {status.message}
              </div>
            </div>
          )}

          {registrationDetails && (
            <div className="mt-6 border-t border-neutral-600 pt-6">
              <h3 className="text-lg font-medium text-neutral-100 mb-4">
                Registration Details
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Name</dt>
                  <dd className="mt-1 text-sm text-neutral-100">{registrationDetails.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Email</dt>
                  <dd className="mt-1 text-sm text-neutral-100">{registrationDetails.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Ticket</dt>
                  <dd className="mt-1 text-sm text-neutral-100 font-mono">{registrationDetails.ticketNumber}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Role</dt>
                  <dd className="mt-1 text-sm text-neutral-100">{registrationDetails.roleType}</dd>
                </div>
                {registrationDetails.teamName && (
                  <div className="col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Team</dt>
                    <dd className="mt-1 text-sm text-neutral-100">{registrationDetails.teamName}</dd>
                  </div>
                )}
              </dl>

              {registrationDetails.teamMembers?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Team Members</h4>
                  <ul className="divide-y divide-neutral-600">
                    {registrationDetails.teamMembers.map((member, index) => (
                      <li key={index} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-100">{member.fullName}</p>
                            <p className="text-xs text-neutral-400">{member.email}</p>
                          </div>
                          <p className="text-xs text-neutral-400">{member.roleType}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scan another */}
              <button
                onClick={resetScan}
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Scan Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
