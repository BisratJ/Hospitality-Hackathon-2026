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
            <body style="margin: 0; padding: 0; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; background-color: #f5f5f5;">
              <div style="max-width: 520px; margin: 0 auto; overflow: hidden;">

                <!-- Header — dark with ALX logo centered -->
                <div style="background: #0a0a0a; padding: 28px 28px 24px; text-align: center;">
                  <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl.jpg" alt="ALX" style="height: 44px; margin-bottom: 16px;" />
                  <p style="color: #666; margin: 0 0 18px; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Hospitality Hackathon 2026</p>
                  <h1 style="color: #fff; margin: 0 0 6px; font-size: 22px; font-weight: 700;">You're in, ${data.fullName}! 🎉</h1>
                  <p style="color: #888; margin: 0; font-size: 14px;">Your registration has been confirmed</p>
                </div>

                <!-- QR Code — large & prominent -->
                <div style="background: #ffffff; padding: 36px 28px; text-align: center;">
                  <div style="border: 2px solid #e5e5e5; border-radius: 16px; padding: 20px; display: inline-block;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=360x360&color=000000&margin=0" alt="QR Code" style="width: 360px; height: 360px; display: block;"/>
                  </div>
                  <p style="color: #aaa; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 14px 0 0;">Scan at check-in</p>
                </div>

                <!-- Glassmorphism Ticket Card -->
                <div style="padding: 0 28px 24px; background: #fff;">
                  <div style="background: linear-gradient(135deg, rgba(240,240,255,0.8) 0%, rgba(250,245,255,0.6) 100%); border: 1px solid rgba(200,200,220,0.4); border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                    <div style="padding: 14px 20px; border-bottom: 1px solid rgba(200,200,220,0.3);">
                      <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Ticket Number</span><br/>
                      <span style="color: #111; font-size: 16px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 1px;">${ticketNumber}</span>
                    </div>
                    <div style="padding: 14px 20px; border-bottom: 1px solid rgba(200,200,220,0.3);">
                      <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Role</span><br/>
                      <span style="color: #111; font-size: 14px; font-weight: 600;">${data.roleType}</span>
                    </div>${data.teamName ? `
                    <div style="padding: 14px 20px; border-bottom: 1px solid rgba(200,200,220,0.3);">
                      <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team</span><br/>
                      <span style="color: #111; font-size: 14px; font-weight: 600;">${data.teamName}</span>
                    </div>` : ''}
                    <div style="padding: 14px 20px;">
                      <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Type</span><br/>
                      <span style="color: #111; font-size: 14px; font-weight: 600;">${data.registrationType === 'team' ? 'Team' : 'Individual'}</span>
                    </div>
                  </div>
                </div>

                <!-- What's next -->
                <div style="background: #fff; padding: 16px 28px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    Save your QR code · Join our community · Get ready to innovate
                  </p>
                </div>

                <!-- Minimal footer -->
                <div style="background: #0a0a0a; padding: 14px 28px; text-align: center;">
                  <p style="color: #555; font-size: 10px; margin: 0;">Hospitality Hackathon 2026 · Addis Ababa · <a href="https://hospitalityhackathon.et" style="color: #777; text-decoration: none;">hospitalityhackathon.et</a></p>
                </div>

              </div>
            </body>
          </html>
        `;

        let emailErrors = [];

        // Helper: send email with automatic fallback sender
        const sendEmailWithFallback = async (to, subject, html) => {
          const senders = [
            'ALX Hackathon <noreply@hospitalityhackathon.et>',
            'ALX Hackathon <onboarding@resend.dev>',
          ];
          for (const from of senders) {
            try {
              const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ from, to: [to], subject, html }),
              });
              if (res.ok) return { ok: true };
              const errText = await res.text();
              console.error(`Email send failed with sender ${from}:`, errText);
              // If it's a domain/verification error, try the next sender
              if (res.status === 403 || errText.includes('domain') || errText.includes('verify')) {
                continue;
              }
              return { ok: false, error: errText };
            } catch (err) {
              console.error(`Email send exception with sender ${from}:`, err);
              continue;
            }
          }
          return { ok: false, error: 'All sender addresses failed' };
        };

        // Send email using Resend
        if (env.RESEND_API_KEY) {
          const result = await sendEmailWithFallback(
            data.email,
            'ALX Hackathon Registration Confirmation',
            emailHtml
          );
          if (!result.ok) {
            emailErrors.push({ email: data.email, error: result.error });
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
                  <body style="margin: 0; padding: 0; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; background-color: #f5f5f5;">
                    <div style="max-width: 520px; margin: 0 auto; overflow: hidden;">

                      <!-- Header — dark with ALX logo centered -->
                      <div style="background: #0a0a0a; padding: 28px 28px 24px; text-align: center;">
                        <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl.jpg" alt="ALX" style="height: 44px; margin-bottom: 16px;" />
                        <p style="color: #666; margin: 0 0 18px; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Hospitality Hackathon 2026</p>
                        <h1 style="color: #fff; margin: 0 0 6px; font-size: 22px; font-weight: 700;">Welcome aboard, ${member.fullName}! 🤝</h1>
                        <p style="color: #888; margin: 0; font-size: 14px;">You've been registered as a team member</p>
                      </div>

                      <!-- QR Code — large & prominent -->
                      <div style="background: #ffffff; padding: 36px 28px; text-align: center;">
                        <div style="border: 2px solid #e5e5e5; border-radius: 16px; padding: 20px; display: inline-block;">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(memberQrData)}&size=360x360&color=000000&margin=0" alt="QR Code" style="width: 360px; height: 360px; display: block;"/>
                        </div>
                        <p style="color: #aaa; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 14px 0 0;">Scan at check-in</p>
                      </div>

                      <!-- Glassmorphism Ticket Card -->
                      <div style="padding: 0 28px 24px; background: #fff;">
                        <div style="background: linear-gradient(135deg, rgba(240,240,255,0.8) 0%, rgba(250,245,255,0.6) 100%); border: 1px solid rgba(200,200,220,0.4); border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                          <div style="padding: 14px 20px; border-bottom: 1px solid rgba(200,200,220,0.3);">
                            <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Ticket Number</span><br/>
                            <span style="color: #111; font-size: 16px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 1px;">${memberTicket}</span>
                          </div>
                          <div style="padding: 14px 20px; border-bottom: 1px solid rgba(200,200,220,0.3);">
                            <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Role</span><br/>
                            <span style="color: #111; font-size: 14px; font-weight: 600;">${member.roleType}</span>
                          </div>
                          <div style="padding: 14px 20px;">
                            <span style="color: #999; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team</span><br/>
                            <span style="color: #111; font-size: 14px; font-weight: 600;">${data.teamName}</span>
                          </div>
                        </div>
                      </div>

                      <!-- What's next -->
                      <div style="background: #fff; padding: 16px 28px; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                          Save your QR code · Coordinate with your team · Get ready to innovate
                        </p>
                      </div>

                      <!-- Minimal footer -->
                      <div style="background: #0a0a0a; padding: 14px 28px; text-align: center;">
                        <p style="color: #555; font-size: 10px; margin: 0;">Hospitality Hackathon 2026 · Addis Ababa · <a href="https://hospitalityhackathon.et" style="color: #777; text-decoration: none;">hospitalityhackathon.et</a></p>
                      </div>

                    </div>
                  </body>
                </html>
              `;

              // Send email to team member using Resend
              if (env.RESEND_API_KEY) {
                const memberResult = await sendEmailWithFallback(
                  member.email,
                  'ALX Hackathon Team Registration Confirmation',
                  memberEmailHtml
                );
                if (!memberResult.ok) {
                  emailErrors.push({ email: member.email, error: memberResult.error });
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

        // First try looking up in users table (team leads / individuals)
        let user = await env.DB.prepare(`
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

        if (user) {
          // Parse team members if present
          if (user.teamMembers) {
            try { user.teamMembers = JSON.parse(`[${user.teamMembers}]`); }
            catch { user.teamMembers = []; }
          } else {
            user.teamMembers = [];
          }
          return new Response(JSON.stringify(user), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Fallback: look up in team_members table
        const member = await env.DB.prepare(`
          SELECT tm.*, u.teamName, u.registrationType
          FROM team_members tm
          LEFT JOIN users u ON tm.userId = u.id
          WHERE tm.ticketNumber = ?
        `).bind(ticketNumber).first();

        if (member) {
          return new Response(JSON.stringify({
            ...member,
            participantType: 'member',
            teamMembers: [],
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(
          JSON.stringify({ error: 'Registration not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

        // GET /api/admin/contacts
        if (path === '/api/admin/contacts' && request.method === 'GET') {
          const contacts = await env.DB.prepare(
            "SELECT * FROM contact_messages ORDER BY created_at DESC"
          ).all();
          return new Response(
            JSON.stringify(contacts?.results || []),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // POST /api/admin/resend-emails — Bulk resend confirmation emails for a date range
        if (path === '/api/admin/resend-emails' && request.method === 'POST') {
          const body = await request.json();
          const startDate = body.startDate || '2026-03-27 20:18:44';
          const endDate = body.endDate || '2026-04-02 11:29:32';
          const limit = body.limit || 10;
          const offset = body.offset || 0;

          if (!env.RESEND_API_KEY) {
            return new Response(
              JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Helper: send email with automatic fallback sender (same as registration)
          const sendEmail = async (to, subject, html) => {
            const senders = [
              'ALX Hackathon <noreply@hospitalityhackathon.et>',
              'ALX Hackathon <onboarding@resend.dev>',
            ];
            const errors = [];
            for (const from of senders) {
              try {
                const res = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ from, to: [to], subject, html }),
                });
                if (res.ok) return { ok: true };
                const errText = await res.text();
                errors.push({ from, status: res.status, error: errText });
                if (res.status === 403 || errText.includes('domain') || errText.includes('verify')) continue;
                return { ok: false, error: errText };
              } catch (err) {
                errors.push({ from, error: err.message || String(err) });
                continue;
              }
            }
            return { ok: false, error: JSON.stringify(errors) };
          };

          // Count total affected for pagination info
          const countResult = await env.DB.prepare(
            "SELECT COUNT(*) as total FROM users WHERE createdAt > ? AND createdAt < ?"
          ).bind(startDate, endDate).first();
          const totalAffected = countResult?.total || 0;

          // Fetch affected users with LIMIT/OFFSET for batching
          const users = await env.DB.prepare(
            "SELECT u.*, GROUP_CONCAT(json_object('id', tm.id, 'fullName', tm.fullName, 'email', tm.email, 'phoneNumber', tm.phoneNumber, 'roleType', tm.roleType, 'ticketNumber', tm.ticketNumber)) as teamMembersJson FROM users u LEFT JOIN team_members tm ON u.id = tm.userId WHERE u.createdAt > ? AND u.createdAt < ? GROUP BY u.id ORDER BY u.id LIMIT ? OFFSET ?"
          ).bind(startDate, endDate, limit, offset).all();

          const affectedUsers = users?.results || [];
          const results = { total: 0, sent: 0, failed: 0, details: [] };

          for (const user of affectedUsers) {
            results.total++;

            // Build QR data for lead/individual
            const qrData = JSON.stringify({
              ticketNumber: user.ticketNumber,
              email: user.email,
              name: user.fullName
            });

            const emailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Hospitality Hackathon Registration</title></head><body style="margin:0;padding:0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.5;background-color:#f5f5f5;"><div style="max-width:520px;margin:0 auto;overflow:hidden;"><div style="background:#0a0a0a;padding:28px 28px 24px;text-align:center;"><img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl.jpg" alt="ALX" style="height:44px;margin-bottom:16px;" /><p style="color:#666;margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:3px;font-weight:600;">Hospitality Hackathon 2026</p><h1 style="color:#fff;margin:0 0 6px;font-size:22px;font-weight:700;">You're in, ${user.fullName}! 🎉</h1><p style="color:#888;margin:0;font-size:14px;">Your registration has been confirmed</p></div><div style="background:#ffffff;padding:36px 28px;text-align:center;"><div style="border:2px solid #e5e5e5;border-radius:16px;padding:20px;display:inline-block;"><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=360x360&color=000000&margin=0" alt="QR Code" style="width:360px;height:360px;display:block;"/></div><p style="color:#aaa;font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:14px 0 0;">Scan at check-in</p></div><div style="padding:0 28px 24px;background:#fff;"><div style="background:linear-gradient(135deg,rgba(240,240,255,0.8) 0%,rgba(250,245,255,0.6) 100%);border:1px solid rgba(200,200,220,0.4);border-radius:16px;padding:0;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);"><div style="padding:14px 20px;border-bottom:1px solid rgba(200,200,220,0.3);"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Ticket Number</span><br/><span style="color:#111;font-size:16px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:1px;">${user.ticketNumber}</span></div><div style="padding:14px 20px;border-bottom:1px solid rgba(200,200,220,0.3);"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Role</span><br/><span style="color:#111;font-size:14px;font-weight:600;">${user.roleType}</span></div>${user.teamName ? `<div style="padding:14px 20px;border-bottom:1px solid rgba(200,200,220,0.3);"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Team</span><br/><span style="color:#111;font-size:14px;font-weight:600;">${user.teamName}</span></div>` : ''}<div style="padding:14px 20px;"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Type</span><br/><span style="color:#111;font-size:14px;font-weight:600;">${user.registrationType === 'team' ? 'Team' : 'Individual'}</span></div></div></div><div style="background:#fff;padding:16px 28px;text-align:center;"><p style="color:#999;font-size:12px;margin:0;">Save your QR code · Join our community · Get ready to innovate</p></div><div style="background:#0a0a0a;padding:14px 28px;text-align:center;"><p style="color:#555;font-size:10px;margin:0;">Hospitality Hackathon 2026 · Addis Ababa · <a href="https://hospitalityhackathon.et" style="color:#777;text-decoration:none;">hospitalityhackathon.et</a></p></div></div></body></html>`;

            const result = await sendEmail(user.email, 'ALX Hackathon Registration Confirmation', emailHtml);
            if (result.ok) {
              results.sent++;
              results.details.push({ email: user.email, name: user.fullName, status: 'sent', type: 'lead' });
            } else {
              results.failed++;
              results.details.push({ email: user.email, name: user.fullName, status: 'failed', error: result.error, type: 'lead' });
            }

            // Send emails to team members of this user
            if (user.teamMembersJson) {
              let members = [];
              try { members = JSON.parse(`[${user.teamMembersJson}]`); } catch { members = []; }

              for (const member of members) {
                if (!member.email || !member.fullName) continue;
                results.total++;

                const memberQrData = JSON.stringify({
                  ticketNumber: member.ticketNumber,
                  email: member.email,
                  name: member.fullName
                });

                const memberEmailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Hospitality Hackathon Registration</title></head><body style="margin:0;padding:0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.5;background-color:#f5f5f5;"><div style="max-width:520px;margin:0 auto;overflow:hidden;"><div style="background:#0a0a0a;padding:28px 28px 24px;text-align:center;"><img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl.jpg" alt="ALX" style="height:44px;margin-bottom:16px;" /><p style="color:#666;margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:3px;font-weight:600;">Hospitality Hackathon 2026</p><h1 style="color:#fff;margin:0 0 6px;font-size:22px;font-weight:700;">Welcome aboard, ${member.fullName}! 🤝</h1><p style="color:#888;margin:0;font-size:14px;">You've been registered as a team member</p></div><div style="background:#ffffff;padding:36px 28px;text-align:center;"><div style="border:2px solid #e5e5e5;border-radius:16px;padding:20px;display:inline-block;"><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(memberQrData)}&size=360x360&color=000000&margin=0" alt="QR Code" style="width:360px;height:360px;display:block;"/></div><p style="color:#aaa;font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:14px 0 0;">Scan at check-in</p></div><div style="padding:0 28px 24px;background:#fff;"><div style="background:linear-gradient(135deg,rgba(240,240,255,0.8) 0%,rgba(250,245,255,0.6) 100%);border:1px solid rgba(200,200,220,0.4);border-radius:16px;padding:0;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);"><div style="padding:14px 20px;border-bottom:1px solid rgba(200,200,220,0.3);"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Ticket Number</span><br/><span style="color:#111;font-size:16px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:1px;">${member.ticketNumber}</span></div><div style="padding:14px 20px;border-bottom:1px solid rgba(200,200,220,0.3);"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Role</span><br/><span style="color:#111;font-size:14px;font-weight:600;">${member.roleType}</span></div><div style="padding:14px 20px;"><span style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Team</span><br/><span style="color:#111;font-size:14px;font-weight:600;">${user.teamName}</span></div></div></div><div style="background:#fff;padding:16px 28px;text-align:center;"><p style="color:#999;font-size:12px;margin:0;">Save your QR code · Coordinate with your team · Get ready to innovate</p></div><div style="background:#0a0a0a;padding:14px 28px;text-align:center;"><p style="color:#555;font-size:10px;margin:0;">Hospitality Hackathon 2026 · Addis Ababa · <a href="https://hospitalityhackathon.et" style="color:#777;text-decoration:none;">hospitalityhackathon.et</a></p></div></div></body></html>`;

                const memberResult = await sendEmail(member.email, 'ALX Hackathon Team Registration Confirmation', memberEmailHtml);
                if (memberResult.ok) {
                  results.sent++;
                  results.details.push({ email: member.email, name: member.fullName, status: 'sent', type: 'member' });
                } else {
                  results.failed++;
                  results.details.push({ email: member.email, name: member.fullName, status: 'failed', error: memberResult.error, type: 'member' });
                }
              }
            }
          }

          return new Response(
            JSON.stringify({
              message: `Batch complete: ${results.sent}/${results.total} emails sent successfully`,
              dateRange: { startDate, endDate },
              pagination: { limit, offset, totalAffectedLeads: totalAffected, leadsInBatch: affectedUsers.length, hasMore: (offset + limit) < totalAffected, nextOffset: offset + limit },
              ...results
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
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
