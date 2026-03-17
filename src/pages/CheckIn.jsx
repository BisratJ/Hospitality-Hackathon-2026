import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const API_URL = import.meta.env.VITE_API_URL || 'https://alx-hackathon-api.bisrojc60.workers.dev';
const ACCESS_CODE = 'HACKATHON2026';

const CheckIn = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [shake, setShake] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false); // prevent duplicate scans

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem('checkin_authorized') === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {
        // already stopped
      }
      scannerRef.current = null;
      setCameraStarted(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (scannerRef.current || cameraStarted) return;
    setCameraError('');
    setIsLoading(true);

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      const containerWidth = document.getElementById('qr-reader')?.offsetWidth || 300;
      const boxSize = Math.min(containerWidth - 40, 280);

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: boxSize, height: boxSize },
          aspectRatio: 1.0,
          disableFlip: false,
          formatsToSupport: [0], // QR_CODE only for faster scanning
        },
        onScanSuccess,
        () => {} // suppress continuous scan errors
      );
      setCameraStarted(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Please allow camera access and try again.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : 'Failed to start camera. Please try again.'
      );
      scannerRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, [cameraStarted]);

  // Auto-start camera when authorized
  useEffect(() => {
    if (!isAuthorized) return;

    const timer = setTimeout(() => {
      startCamera();
    }, 300);

    return () => {
      clearTimeout(timer);
      stopCamera();
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
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      let ticketData;
      try {
        ticketData = JSON.parse(decodedText);
      } catch {
        // If the QR is just a plain ticket number string
        ticketData = { ticketNumber: decodedText.trim() };
      }

      if (!ticketData.ticketNumber) throw new Error('Invalid QR code format');

      const detailsResponse = await fetch(
        `${API_URL}/api/registration/${ticketData.ticketNumber}`
      );

      if (!detailsResponse.ok) throw new Error('Ticket not found in system');

      const details = await detailsResponse.json();
      setRegistrationDetails(details);

      const checkInResponse = await fetch(
        `${API_URL}/api/checkin/${ticketData.ticketNumber}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );

      if (!checkInResponse.ok) {
        const error = await checkInResponse.json();
        if (error.error === 'Already checked in') {
          setStatus({
            type: 'warning',
            message: `Already checked in at ${error.checkInTime ? new Date(error.checkInTime).toLocaleTimeString() : 'earlier'}`
          });
        } else {
          throw new Error(error.message || error.error || 'Check-in failed');
        }
      } else {
        setStatus({ type: 'success', message: '✓ Check-in successful!' });
      }

      // Stop camera after successful scan to save resources
      await stopCamera();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to process QR code'
      });
    } finally {
      isProcessingRef.current = false;
    }
  };

  const resetScan = async () => {
    setRegistrationDetails(null);
    setStatus({ type: '', message: '' });
    setCameraError('');
    isProcessingRef.current = false;
    // Restart camera after a short delay
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  const handleLogout = () => {
    stopCamera();
    sessionStorage.removeItem('checkin_authorized');
    setIsAuthorized(false);
    setCameraStarted(false);
    setCameraError('');
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
                  className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-center text-lg tracking-widest font-mono"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {codeError && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-sm text-center">
                  {codeError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 min-h-[48px]"
                style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)' }}
              >
                Unlock Check-In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── QR Scanner (after authorization) ───
  return (
    <div
      className="min-h-screen pb-12 px-4 sm:px-6 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)' }}
    >
      <div className="max-w-lg mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase" style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Check-In Active
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Exit
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Scan QR Code</h2>
          <p className="text-sm text-neutral-400">Point the camera at a participant's QR code</p>
        </div>

        <div
          className="border border-neutral-700 rounded-2xl backdrop-blur-xl overflow-hidden"
          style={{
            background: 'rgba(23, 23, 23, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Camera / Scanner area */}
          {!registrationDetails && (
            <div className="p-4 sm:p-5">
              {/* QR Reader container — always rendered so the DOM el exists */}
              <div
                id="qr-reader"
                className="w-full rounded-xl overflow-hidden"
                style={{ minHeight: cameraStarted ? 'auto' : '0', background: 'transparent' }}
              />

              {/* Loading state */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <p className="text-sm text-neutral-400">Starting camera…</p>
                </div>
              )}

              {/* Camera error with retry button */}
              {cameraError && !isLoading && (
                <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <svg className="h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-300 text-sm font-medium mb-1">Camera Unavailable</p>
                    <p className="text-neutral-500 text-xs leading-relaxed">{cameraError}</p>
                  </div>
                  <button
                    onClick={() => { setCameraError(''); startCamera(); }}
                    className="px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all min-h-[44px]"
                    style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Manual start button when not loading and no error */}
              {!cameraStarted && !isLoading && !cameraError && (
                <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.08)', border: '2px dashed rgba(220,38,38,0.3)' }}>
                    <svg className="h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <p className="text-neutral-400 text-sm">Camera hasn't started yet</p>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all min-h-[48px]"
                    style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}
                  >
                    Start Camera
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Status message */}
          {status.message && (
            <div className="px-4 sm:px-5 pb-0 pt-0">
              <div
                className={`px-4 py-3.5 rounded-xl border text-sm font-medium mt-4 ${
                  status.type === 'success'
                    ? 'bg-green-900/30 text-green-300 border-green-700/50'
                    : status.type === 'warning'
                    ? 'bg-amber-900/30 text-amber-300 border-amber-700/50'
                    : 'bg-red-900/30 text-red-300 border-red-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {status.type === 'success' && (
                    <svg className="h-5 w-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  )}
                  {status.type === 'warning' && (
                    <svg className="h-5 w-5 text-amber-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  )}
                  {status.type === 'error' && (
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  )}
                  {status.message}
                </div>
              </div>
            </div>
          )}

          {/* Registration Details */}
          {registrationDetails && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: status.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)' }}>
                  {status.type === 'success' ? (
                    <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white">Registration Details</h3>
              </div>

              <div className="space-y-2 mb-5">
                {[
                  { label: 'Name', value: registrationDetails.fullName },
                  { label: 'Email', value: registrationDetails.email },
                  { label: 'Ticket', value: registrationDetails.ticketNumber, mono: true },
                  { label: 'Role', value: registrationDetails.roleType },
                  registrationDetails.teamName && { label: 'Team', value: registrationDetails.teamName },
                ].filter(Boolean).map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 py-2 border-b border-neutral-700/50 last:border-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-0.5 flex-shrink-0">{item.label}</span>
                    <span className={`text-sm text-neutral-100 text-right ${item.mono ? 'font-mono' : ''}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              {registrationDetails.teamMembers?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Team Members ({registrationDetails.teamMembers.length})</p>
                  <div className="space-y-2">
                    {registrationDetails.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-700/40 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-neutral-100">{member.fullName}</p>
                          <p className="text-xs text-neutral-500">{member.email}</p>
                        </div>
                        <p className="text-xs text-neutral-500 flex-shrink-0">{member.roleType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={resetScan}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all min-h-[48px]"
                style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}
              >
                Scan Next Participant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
