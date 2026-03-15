import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const CheckIn = () => {
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    try {
      const ticketData = JSON.parse(decodedText);
      
      // Fetch registration details
      const detailsResponse = await fetch(
        `https://api.hospitalityhackathon.et/api/registration/${ticketData.ticketNumber}`
      );
      
      if (!detailsResponse.ok) {
        throw new Error('Invalid ticket');
      }

      const details = await detailsResponse.json();
      setRegistrationDetails(details);

      // Perform check-in
      const checkInResponse = await fetch(
        `https://api.hospitalityhackathon.et/api/checkin/${ticketData.ticketNumber}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!checkInResponse.ok) {
        const error = await checkInResponse.json();
        throw new Error(error.message || 'Check-in failed');
      }

      setStatus({
        type: 'success',
        message: 'Check-in successful!'
      });

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to process QR code'
      });
    }
  };

  const onScanError = (err) => {
    console.error(err);
    setStatus({
      type: 'error',
      message: 'Error accessing camera'
    });
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)'
      }}
    >
      <div className="max-w-md mx-auto rounded-lg overflow-hidden">
        {/* Glass card effect container */}
        <div
          className="px-4 py-5 sm:p-6 border border-neutral-700 rounded-lg backdrop-blur-xl"
          style={{
            background: 'rgba(23, 23, 23, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <h2 className="text-2xl font-bold text-neutral-100 text-center mb-8">
            Hackathon Check-in
          </h2>

          <div className="mb-6">
            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
          </div>

          {status.message && (
            <div
              className={`mb-4 p-4 rounded-md border ${
                status.type === 'error'
                  ? 'bg-red-900/30 text-red-300 border-red-700/50'
                  : 'bg-red-900/30 text-red-300 border-red-700/50'
              }`}
            >
              {status.message}
            </div>
          )}

          {registrationDetails && (
            <div
              className="mt-6 border-t border-neutral-600 pt-6"
            >
              <h3 className="text-lg font-medium text-neutral-100 mb-4">
                Registration Details
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-neutral-400">Name</dt>
                  <dd className="mt-1 text-sm text-neutral-100">
                    {registrationDetails.fullName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-400">Email</dt>
                  <dd className="mt-1 text-sm text-neutral-100">
                    {registrationDetails.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-400">Ticket Number</dt>
                  <dd className="mt-1 text-sm text-neutral-100">
                    {registrationDetails.ticketNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-400">Role</dt>
                  <dd className="mt-1 text-sm text-neutral-100">
                    {registrationDetails.roleType}
                  </dd>
                </div>
                {registrationDetails.teamName && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-neutral-400">Team</dt>
                    <dd className="mt-1 text-sm text-neutral-100">
                      {registrationDetails.teamName}
                    </dd>
                  </div>
                )}
              </dl>

              {registrationDetails.teamMembers?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-neutral-100 mb-3">
                    Team Members
                  </h4>
                  <ul className="divide-y divide-neutral-600">
                    {registrationDetails.teamMembers.map((member, index) => (
                      <li key={index} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-100">
                              {member.fullName}
                            </p>
                            <p className="text-sm text-neutral-400">{member.email}</p>
                          </div>
                          <p className="text-sm text-neutral-400">{member.roleType}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
