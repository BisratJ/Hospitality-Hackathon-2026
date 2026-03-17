export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = [
      'https://hospitality-hackathon-2026.vercel.app',
      'https://hospitalityhackathon.et',
      'https://www.hospitalityhackathon.et',
    ];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path === '/') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (path === '/api/register' && request.method === 'POST') {
        const data = await request.json();
        const ticketNumber = 'ALX-' + Date.now().toString(36).toUpperCase();

        // Check for existing email in both users and team_members tables
        const existingUser = await env.DB.prepare(
          'SELECT email FROM users WHERE email = ?'
        ).bind(data.email).first();

        const existingTeamMember = await env.DB.prepare(
          'SELECT email FROM team_members WHERE email = ?'
        ).bind(data.email).first();

        if (existingUser || existingTeamMember) {
          return new Response(
            JSON.stringify({ 
              error: 'This email is already registered either as a participant or team member',
              details: existingTeamMember ? 'You are already registered as a team member' : 'You are already registered as a participant'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // For team registration, check if any team member email already exists
        if (data.registrationType === 'team' && Array.isArray(data.teamMembers)) {
          for (const member of data.teamMembers) {
            const memberExistsInUsers = await env.DB.prepare(
              'SELECT email FROM users WHERE email = ?'
            ).bind(member.email).first();

            const memberExistsInTeams = await env.DB.prepare(
              'SELECT email FROM team_members WHERE email = ?'
            ).bind(member.email).first();

            if (memberExistsInUsers || memberExistsInTeams) {
              return new Response(
                JSON.stringify({ 
                  error: 'Team member registration failed',
                  details: `Team member with email ${member.email} is already registered`
                }),
                {
                  status: 400,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          }
        }

        // Generate QR code data
        const qrData = JSON.stringify({
          ticketNumber,
          email: data.email,
          name: data.fullName
        });

        // Create email HTML with QR code
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Hospitality Hackathon Registration</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; background-color: #f0f0f0;">
              <div style="max-width: 520px; margin: 20px auto; overflow: hidden; border-radius: 16px; box-shadow: 0 2px 20px rgba(0,0,0,0.08);">

                <!-- Header — logos + confirmation in one block -->
                <div style="background: #0a0a0a; padding: 24px 28px 20px; text-align: center;">
                  <div style="margin-bottom: 14px;">
                    <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl-clean.png" alt="ALX" style="height: 30px; vertical-align: middle; filter: invert(1);" />
                    <span style="color: #444; font-size: 18px; vertical-align: middle; margin: 0 10px;">×</span>
                    <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/kuri-clean.png" alt="Hospitality Hackathon" style="height: 30px; vertical-align: middle; filter: invert(1);" />
                  </div>
                  <p style="color: #666; margin: 0 0 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Hospitality Hackathon 2026</p>
                  <h1 style="color: #fff; margin: 0 0 4px; font-size: 20px; font-weight: 700;">You're in, ${data.fullName}! 🎉</h1>
                  <p style="color: #888; margin: 0; font-size: 13px;">Your registration has been confirmed</p>
                </div>

                <!-- QR Code — hero element -->
                <div style="background: #ffffff; padding: 32px 28px; text-align: center;">
                  <div style="background: #fff; border: 2px solid #e5e5e5; border-radius: 16px; padding: 24px; display: inline-block;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=280x280&color=000000&margin=0" alt="QR Code" style="width: 280px; height: 280px; display: block;"/>
                  </div>
                  <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 14px 0 0;">Scan at check-in</p>
                </div>

                <!-- Ticket Details — clean card -->
                <div style="background: #fafafa; padding: 0 28px 28px;">
                  <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e8e8e8;">
                    <tr>
                      <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; width: 50%;">
                        <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Ticket</span><br/>
                        <span style="color: #111; font-size: 14px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">${ticketNumber}</span>
                      </td>
                      <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; border-left: 1px solid #f0f0f0; width: 50%;">
                        <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Role</span><br/>
                        <span style="color: #111; font-size: 14px; font-weight: 600;">${data.roleType}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; background: #fff;${data.teamName ? ' border-bottom: 1px solid #f0f0f0;' : ''} width: 50%;">
                        <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Type</span><br/>
                        <span style="color: #111; font-size: 14px; font-weight: 600;">${data.registrationType === 'team' ? 'Team' : 'Individual'}</span>
                      </td>
                      <td style="padding: 12px 16px; background: #fff;${data.teamName ? ' border-bottom: 1px solid #f0f0f0;' : ''} border-left: 1px solid #f0f0f0; width: 50%;">
                        <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Name</span><br/>
                        <span style="color: #111; font-size: 14px; font-weight: 600;">${data.fullName}</span>
                      </td>
                    </tr>${data.teamName ? `
                    <tr>
                      <td colspan="2" style="padding: 12px 16px; background: #fff;">
                        <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team</span><br/>
                        <span style="color: #111; font-size: 14px; font-weight: 600;">${data.teamName}</span>
                      </td>
                    </tr>` : ''}
                  </table>
                </div>

                <!-- What's next — minimal -->
                <div style="background: #fff; padding: 20px 28px; border-top: 1px solid #f0f0f0;">
                  <p style="color: #111; font-size: 13px; font-weight: 600; margin: 0 0 6px;">What's Next?</p>
                  <p style="color: #777; font-size: 12px; margin: 0; line-height: 1.8;">
                    Save your QR code · Join our community · Get ready to innovate
                  </p>
                </div>

                <!-- Footer -->
                <div style="background: #0a0a0a; padding: 16px 28px; text-align: center;">
                  <p style="color: #666; font-size: 11px; margin: 0;">Hospitality Hackathon 2026 · Addis Ababa</p>
                  <a href="https://hospitalityhackathon.et" style="color: #DC2626; font-size: 11px; text-decoration: none; font-weight: 600;">hospitalityhackathon.et</a>
                </div>

              </div>
            </body>
          </html>
        `;

        let emailErrors = [];

        // Send email using Resend
        if (env.RESEND_API_KEY) {
          try {
            const emailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'ALX Hackathon <noreply@hospitalityhackathon.et>',
                to: [data.email],
                subject: 'ALX Hackathon Registration Confirmation',
                html: emailHtml,
              }),
            });

            if (!emailResponse.ok) {
              const errorText = await emailResponse.text();
              console.error('Failed to send email:', errorText);
              emailErrors.push({ email: data.email, error: errorText });
            }
          } catch (emailErr) {
            console.error('Email send error:', emailErr);
            emailErrors.push({ email: data.email, error: emailErr.message });
          }
        }

        // Insert user into database
        await env.DB.prepare(`
          INSERT INTO users (
            fullName, email, phoneNumber, alxAffiliation,
            registrationType, teamName, strengths, roleType,
            ticketNumber
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.fullName,
          data.email,
          data.phoneNumber,
          data.alxAffiliation,
          data.registrationType,
          data.teamName || null,
          data.strengths,
          data.roleType,
          ticketNumber
        ).run();

        // Get the inserted user's ID
        const { id: userId } = await env.DB.prepare(
          'SELECT id FROM users WHERE ticketNumber = ?'
        ).bind(ticketNumber).first();

        // Handle team members
        if (data.registrationType === 'team' && Array.isArray(data.teamMembers)) {
          for (const member of data.teamMembers) {
            if (member.email && member.fullName) {
              const memberTicket = 'ALX-' + Date.now().toString(36).toUpperCase();
              
              // Generate QR code data for team member
              const memberQrData = JSON.stringify({
                ticketNumber: memberTicket,
                email: member.email,
                name: member.fullName
              });

              const memberEmailHtml = `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Hospitality Hackathon Registration</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; background-color: #f0f0f0;">
                    <div style="max-width: 520px; margin: 20px auto; overflow: hidden; border-radius: 16px; box-shadow: 0 2px 20px rgba(0,0,0,0.08);">

                      <!-- Header — logos + confirmation in one block -->
                      <div style="background: #0a0a0a; padding: 24px 28px 20px; text-align: center;">
                        <div style="margin-bottom: 14px;">
                          <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl-clean.png" alt="ALX" style="height: 30px; vertical-align: middle; filter: invert(1);" />
                          <span style="color: #444; font-size: 18px; vertical-align: middle; margin: 0 10px;">×</span>
                          <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/kuri-clean.png" alt="Hospitality Hackathon" style="height: 30px; vertical-align: middle; filter: invert(1);" />
                        </div>
                        <p style="color: #666; margin: 0 0 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Hospitality Hackathon 2026</p>
                        <h1 style="color: #fff; margin: 0 0 4px; font-size: 20px; font-weight: 700;">Welcome aboard, ${member.fullName}! 🤝</h1>
                        <p style="color: #888; margin: 0; font-size: 13px;">You've been registered as a team member</p>
                      </div>

                      <!-- QR Code — hero element -->
                      <div style="background: #ffffff; padding: 32px 28px; text-align: center;">
                        <div style="background: #fff; border: 2px solid #e5e5e5; border-radius: 16px; padding: 24px; display: inline-block;">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(memberQrData)}&size=280x280&color=000000&margin=0" alt="QR Code" style="width: 280px; height: 280px; display: block;"/>
                        </div>
                        <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 14px 0 0;">Scan at check-in</p>
                      </div>

                      <!-- Ticket Details — clean card -->
                      <div style="background: #fafafa; padding: 0 28px 28px;">
                        <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e8e8e8;">
                          <tr>
                            <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; width: 50%;">
                              <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Ticket</span><br/>
                              <span style="color: #111; font-size: 14px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">${memberTicket}</span>
                            </td>
                            <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; border-left: 1px solid #f0f0f0; width: 50%;">
                              <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Role</span><br/>
                              <span style="color: #111; font-size: 14px; font-weight: 600;">${member.roleType}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; width: 50%;">
                              <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team</span><br/>
                              <span style="color: #111; font-size: 14px; font-weight: 600;">${data.teamName}</span>
                            </td>
                            <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f0f0f0; border-left: 1px solid #f0f0f0; width: 50%;">
                              <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Name</span><br/>
                              <span style="color: #111; font-size: 14px; font-weight: 600;">${member.fullName}</span>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- What's next — minimal -->
                      <div style="background: #fff; padding: 20px 28px; border-top: 1px solid #f0f0f0;">
                        <p style="color: #111; font-size: 13px; font-weight: 600; margin: 0 0 6px;">What's Next?</p>
                        <p style="color: #777; font-size: 12px; margin: 0; line-height: 1.8;">
                          Save your QR code · Coordinate with your team · Get ready to innovate
                        </p>
                      </div>

                      <!-- Footer -->
                      <div style="background: #0a0a0a; padding: 16px 28px; text-align: center;">
                        <p style="color: #666; font-size: 11px; margin: 0;">Hospitality Hackathon 2026 · Addis Ababa</p>
                        <a href="https://hospitalityhackathon.et" style="color: #DC2626; font-size: 11px; text-decoration: none; font-weight: 600;">hospitalityhackathon.et</a>
                      </div>

                    </div>
                  </body>
                </html>
              `;

              // Send email to team member using Resend
              if (env.RESEND_API_KEY) {
                try {
                  const memberEmailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: 'ALX Hackathon <noreply@hospitalityhackathon.et>',
                      to: [member.email],
                      subject: 'ALX Hackathon Team Registration Confirmation',
                      html: memberEmailHtml,
                    }),
                  });

                  if (!memberEmailResponse.ok) {
                    const memberErrorText = await memberEmailResponse.text();
                    console.error('Failed to send team member email:', memberErrorText);
                    emailErrors.push({ email: member.email, error: memberErrorText });
                  }
                } catch (emailErr) {
                  console.error('Team member email error:', emailErr);
                  emailErrors.push({ email: member.email, error: emailErr.message });
                }
              }

              // Insert team member into database
              await env.DB.prepare(`
                INSERT INTO team_members (
                  userId, fullName, email, phoneNumber,
                  roleType, ticketNumber, alxAffiliation
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `).bind(
                userId,
                member.fullName,
                member.email,
                member.phoneNumber || '',
                member.roleType,
                memberTicket,
                member.alxAffiliation || ''
              ).run();
            }
          }
        }

        return new Response(
          JSON.stringify({ 
            message: 'Registration successful',
            ticketNumber,
            emailErrors: emailErrors.length > 0 ? emailErrors : undefined
          }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (path === '/api/contact' && request.method === 'POST') {
        try {
          const data = await request.json();
          console.log('Contact form data:', data);

          // Validate required fields
          if (!data.name || !data.email || !data.subject || !data.message) {
            return new Response(
              JSON.stringify({ error: 'All fields are required' }),
              {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }

          // Store contact message in database
          try {
            await env.DB.prepare(`
              INSERT INTO contact_messages (
                name, email, subject, message, created_at
              ) VALUES (?, ?, ?, ?, datetime('now'))
            `).bind(
              data.name,
              data.email,
              data.subject,
              data.message
            ).run();

            return new Response(
              JSON.stringify({ message: 'Message sent successfully' }),
              {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          } catch (dbError) {
            console.error('Database error:', dbError);
            return new Response(
              JSON.stringify({ error: 'Failed to save message' }),
              {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
        } catch (error) {
          console.error('Contact form error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to process request' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }

      if (path.startsWith('/api/registration/')) {
        const ticketNumber = path.split('/').pop();
        const user = await env.DB.prepare(`
          SELECT u.*, GROUP_CONCAT(
            json_object(
              'fullName', tm.fullName,
              'email', tm.email,
              'phoneNumber', tm.phoneNumber,
              'roleType', tm.roleType,
              'ticketNumber', tm.ticketNumber
            )
          ) as teamMembers
          FROM users u
          LEFT JOIN team_members tm ON u.id = tm.userId
          WHERE u.ticketNumber = ?
          GROUP BY u.id
        `).bind(ticketNumber).first();

        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Registration not found' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Parse team members if present
        if (user.teamMembers) {
          try {
            user.teamMembers = JSON.parse(`[${user.teamMembers}]`);
          } catch (e) {
            user.teamMembers = [];
          }
        } else {
          user.teamMembers = [];
        }

        return new Response(
          JSON.stringify(user),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (path.startsWith('/api/checkin/')) {
        const ticketNumber = path.split('/').pop();
        
        // Check if already checked in
        const user = await env.DB.prepare(`
          SELECT checkInStatus, checkInTime FROM users WHERE ticketNumber = ?
          UNION ALL
          SELECT checkInStatus, checkInTime FROM team_members WHERE ticketNumber = ?
        `).bind(ticketNumber, ticketNumber).first();

        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Invalid ticket' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        if (user.checkInStatus) {
          return new Response(
            JSON.stringify({ 
              error: 'Already checked in',
              checkInTime: user.checkInTime
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Perform check-in
        const now = new Date().toISOString();
        await env.DB.prepare(`
          UPDATE users 
          SET checkInStatus = 1, checkInTime = ? 
          WHERE ticketNumber = ?
        `).bind(now, ticketNumber).run();

        await env.DB.prepare(`
          UPDATE team_members 
          SET checkInStatus = 1, checkInTime = ? 
          WHERE ticketNumber = ?
        `).bind(now, ticketNumber).run();

        return new Response(
          JSON.stringify({ 
            message: 'Check-in successful',
            checkInTime: now
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // ─── Admin: Undo check-in ───────────────────────────────────
      if (request.method === 'PUT' && path.startsWith('/api/admin/undo-checkin/')) {
        const authHeader = request.headers.get('Authorization') || '';
        if (!authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const token = authHeader.slice(7);
        const expected = btoa(`${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD}`);
        if (token !== expected) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const ticketNumber = path.split('/').pop();
        await env.DB.prepare(`UPDATE users SET checkInStatus = 0, checkInTime = NULL WHERE ticketNumber = ?`).bind(ticketNumber).run();
        await env.DB.prepare(`UPDATE team_members SET checkInStatus = 0, checkInTime = NULL WHERE ticketNumber = ?`).bind(ticketNumber).run();

        return new Response(
          JSON.stringify({ message: 'Check-in reversed', ticketNumber }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ═══════════════════════════════════════════════════════════
      // ADMIN API ENDPOINTS
      // ═══════════════════════════════════════════════════════════

      // Helper: validate admin auth
      const validateAdmin = () => {
        const authHeader = request.headers.get('Authorization') || '';
        if (!authHeader.startsWith('Bearer ')) return false;
        try {
          const token = authHeader.slice(7);
          const decoded = atob(token);
          const [username, password] = decoded.split(':');
          return (
            username === (env.ADMIN_USERNAME || 'admin') &&
            password === (env.ADMIN_PASSWORD || 'hackathon2026')
          );
        } catch {
          return false;
        }
      };

      // POST /api/admin/login
      if (path === '/api/admin/login' && request.method === 'POST') {
        const data = await request.json();
        const username = data.username || '';
        const password = data.password || '';
        const validUser = env.ADMIN_USERNAME || 'admin';
        const validPass = env.ADMIN_PASSWORD || 'hackathon2026';

        if (username === validUser && password === validPass) {
          return new Response(
            JSON.stringify({ success: true, token: btoa(`${username}:${password}`) }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // All other admin endpoints require auth
      if (path.startsWith('/api/admin/')) {
        if (!validateAdmin()) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // GET /api/admin/stats
        if (path === '/api/admin/stats' && request.method === 'GET') {
          const totalTeams = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM users WHERE registrationType = 'team'"
          ).first();
          const totalIndividuals = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM users WHERE registrationType = 'individual'"
          ).first();
          const totalUsers = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM users"
          ).first();
          const totalTeamMembers = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM team_members"
          ).first();
          const checkedInUsers = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM users WHERE checkInStatus = 1"
          ).first();
          const checkedInMembers = await env.DB.prepare(
            "SELECT COUNT(*) as count FROM team_members WHERE checkInStatus = 1"
          ).first();

          return new Response(
            JSON.stringify({
              totalTeams: totalTeams?.count || 0,
              totalIndividuals: totalIndividuals?.count || 0,
              totalRegistrations: totalUsers?.count || 0,
              totalTeamMembers: totalTeamMembers?.count || 0,
              totalParticipants: (totalUsers?.count || 0) + (totalTeamMembers?.count || 0),
              checkedInUsers: checkedInUsers?.count || 0,
              checkedInMembers: checkedInMembers?.count || 0,
              totalCheckedIn: (checkedInUsers?.count || 0) + (checkedInMembers?.count || 0),
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // GET /api/admin/registrations  (flat list — every participant is a row)
        if (path === '/api/admin/registrations' && request.method === 'GET') {
          const users = await env.DB.prepare(
            "SELECT * FROM users ORDER BY id DESC"
          ).all();
          const teamMembers = await env.DB.prepare(
            "SELECT * FROM team_members ORDER BY userId, id"
          ).all();

          // Build lookup: userId → user row (for teamName etc.)
          const userById = {};
          for (const u of (users?.results || [])) {
            userById[u.id] = u;
          }

          // Flat list: leads first, then members
          const flat = [];
          for (const u of (users?.results || [])) {
            flat.push({ ...u, participantType: 'lead' });
          }
          for (const m of (teamMembers?.results || [])) {
            const parent = userById[m.userId] || {};
            flat.push({
              ...m,
              participantType: 'member',
              teamName: parent.teamName || '',
              registrationType: 'team',
            });
          }

          return new Response(
            JSON.stringify(flat),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // GET /api/admin/checkins
        if (path === '/api/admin/checkins' && request.method === 'GET') {
          const checkedUsers = await env.DB.prepare(
            "SELECT * FROM users WHERE checkInStatus = 1 ORDER BY checkInTime DESC"
          ).all();
          const checkedMembers = await env.DB.prepare(
            "SELECT * FROM team_members WHERE checkInStatus = 1 ORDER BY checkInTime DESC"
          ).all();

          return new Response(
            JSON.stringify({
              users: checkedUsers?.results || [],
              teamMembers: checkedMembers?.results || [],
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // GET /api/admin/export/registrations — CSV
        if (path === '/api/admin/export/registrations' && request.method === 'GET') {
          const users = await env.DB.prepare("SELECT * FROM users ORDER BY id").all();
          const teamMembers = await env.DB.prepare("SELECT * FROM team_members ORDER BY userId, id").all();

          let csv = 'Type,ID,FullName,Email,Phone,ALXAffiliation,RegistrationType,TeamName,Role,Strengths,TicketNumber,CheckedIn,CheckInTime\n';
          for (const u of (users?.results || [])) {
            csv += `"Lead","${u.id}","${(u.fullName||'').replace(/"/g,'""')}","${u.email}","${u.phoneNumber}","${u.alxAffiliation}","${u.registrationType}","${(u.teamName||'').replace(/"/g,'""')}","${u.roleType}","${(u.strengths||'').replace(/"/g,'""')}","${u.ticketNumber}","${u.checkInStatus ? 'Yes' : 'No'}","${u.checkInTime || ''}"\n`;
          }
          for (const m of (teamMembers?.results || [])) {
            csv += `"Member","${m.id}","${(m.fullName||'').replace(/"/g,'""')}","${m.email}","${m.phoneNumber||''}","${m.alxAffiliation||''}","team","","${m.roleType}","","${m.ticketNumber}","${m.checkInStatus ? 'Yes' : 'No'}","${m.checkInTime || ''}"\n`;
          }

          return new Response(csv, {
            headers: {
              ...corsHeaders,
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="registrations.csv"',
            },
          });
        }

        // GET /api/admin/export/checkins — CSV (checked-in only)
        if (path === '/api/admin/export/checkins' && request.method === 'GET') {
          const users = await env.DB.prepare("SELECT * FROM users WHERE checkInStatus = 1 ORDER BY checkInTime").all();
          const members = await env.DB.prepare("SELECT * FROM team_members WHERE checkInStatus = 1 ORDER BY checkInTime").all();

          let csv = 'Type,ID,FullName,Email,Phone,TeamName,Role,TicketNumber,CheckInTime\n';
          for (const u of (users?.results || [])) {
            csv += `"Lead","${u.id}","${(u.fullName||'').replace(/"/g,'""')}","${u.email}","${u.phoneNumber}","${(u.teamName||'').replace(/"/g,'""')}","${u.roleType}","${u.ticketNumber}","${u.checkInTime}"\n`;
          }
          for (const m of (members?.results || [])) {
            csv += `"Member","${m.id}","${(m.fullName||'').replace(/"/g,'""')}","${m.email}","${m.phoneNumber||''}","","${m.roleType}","${m.ticketNumber}","${m.checkInTime}"\n`;
          }

          return new Response(csv, {
            headers: {
              ...corsHeaders,
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="checkins.csv"',
            },
          });
        }
      }

      return new Response(
        JSON.stringify({ error: 'Not Found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }
};
