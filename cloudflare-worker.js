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
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
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
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; overflow: hidden;">
                
                <!-- Header — black with logo -->
                <div style="background: #000000; padding: 32px 30px; text-align: center;">
                  <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl-clean.png" alt="Hospitality Hackathon" style="height: 48px; margin-bottom: 12px; filter: invert(1);" />
                  <p style="color: #999999; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Hospitality Hackathon 2026</p>
                </div>

                <!-- Red accent banner -->
                <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 24px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0 0 4px 0; font-size: 22px; font-weight: 700;">You're In, ${data.fullName}! 🎉</h1>
                  <p style="color: #fecaca; margin: 0; font-size: 14px;">Your registration has been confirmed</p>
                </div>

                <!-- White content area -->
                <div style="background: #ffffff; padding: 30px;">
                  
                  <!-- Ticket details -->
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Ticket Number</span><br/>
                        <span style="color: #000; font-size: 18px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 1px;">${ticketNumber}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Role</span><br/>
                        <span style="color: #000; font-size: 15px; font-weight: 600;">${data.roleType}</span>
                      </td>
                    </tr>
                    ${data.teamName ? `
                    <tr>
                      <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team</span><br/>
                        <span style="color: #000; font-size: 15px; font-weight: 600;">${data.teamName}</span>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626;">
                        <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Type</span><br/>
                        <span style="color: #000; font-size: 15px; font-weight: 600;">${data.registrationType === 'team' ? 'Team' : 'Individual'}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- QR Code -->
                  <div style="text-align: center; margin-bottom: 24px;">
                    <div style="background: #000; border-radius: 12px; padding: 20px; display: inline-block;">
                      <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin: 0 0 12px 0;">Check-in QR Code</p>
                      <div style="background: #fff; padding: 10px; border-radius: 8px; display: inline-block;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=160x160&color=000000" alt="QR Code" style="width: 160px; height: 160px; display: block;"/>
                      </div>
                    </div>
                  </div>

                  <!-- Next steps -->
                  <div style="border-left: 3px solid #DC2626; padding-left: 16px; margin-bottom: 8px;">
                    <h3 style="color: #000; font-size: 14px; font-weight: 700; margin: 0 0 6px 0;">What's Next?</h3>
                    <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.8;">
                      ✅ Save your QR code for check-in<br/>
                      ✅ Join our community channels<br/>
                      ✅ Get ready to innovate!
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background: #000; padding: 20px 30px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0 0 4px 0; font-weight: 600;">Hospitality Hackathon 2026 · Addis Ababa</p>
                  <a href="https://hospitalityhackathon.et" style="color: #DC2626; font-size: 12px; text-decoration: none; font-weight: 600;">hospitalityhackathon.et</a>
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
                  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; overflow: hidden;">
                      
                      <!-- Header — black with logo -->
                      <div style="background: #000000; padding: 32px 30px; text-align: center;">
                        <img src="https://hospitality-hackathon-2026.vercel.app/assets/images/alxl-clean.png" alt="Hospitality Hackathon" style="height: 48px; margin-bottom: 12px; filter: invert(1);" />
                        <p style="color: #999999; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Hospitality Hackathon 2026</p>
                      </div>

                      <!-- Red accent banner -->
                      <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 24px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0 0 4px 0; font-size: 22px; font-weight: 700;">Welcome Aboard, ${member.fullName}! 🤝</h1>
                        <p style="color: #fecaca; margin: 0; font-size: 14px;">You've been registered as a team member</p>
                      </div>

                      <!-- White content area -->
                      <div style="background: #ffffff; padding: 30px;">
                        
                        <!-- Ticket details -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626; border-bottom: 1px solid #f0f0f0;">
                              <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Team</span><br/>
                              <span style="color: #000; font-size: 15px; font-weight: 600;">${data.teamName}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626; border-bottom: 1px solid #f0f0f0;">
                              <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Ticket Number</span><br/>
                              <span style="color: #000; font-size: 18px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 1px;">${memberTicket}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 16px; background: #fafafa; border-left: 3px solid #DC2626;">
                              <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Role</span><br/>
                              <span style="color: #000; font-size: 15px; font-weight: 600;">${member.roleType}</span>
                            </td>
                          </tr>
                        </table>

                        <!-- QR Code -->
                        <div style="text-align: center; margin-bottom: 24px;">
                          <div style="background: #000; border-radius: 12px; padding: 20px; display: inline-block;">
                            <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin: 0 0 12px 0;">Check-in QR Code</p>
                            <div style="background: #fff; padding: 10px; border-radius: 8px; display: inline-block;">
                              <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(memberQrData)}&size=160x160&color=000000" alt="QR Code" style="width: 160px; height: 160px; display: block;"/>
                            </div>
                          </div>
                        </div>

                        <!-- Next steps -->
                        <div style="border-left: 3px solid #DC2626; padding-left: 16px; margin-bottom: 8px;">
                          <h3 style="color: #000; font-size: 14px; font-weight: 700; margin: 0 0 6px 0;">What's Next?</h3>
                          <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.8;">
                            ✅ Save your QR code for check-in<br/>
                            ✅ Coordinate with your team lead<br/>
                            ✅ Get ready to innovate together!
                          </p>
                        </div>
                      </div>

                      <!-- Footer -->
                      <div style="background: #000; padding: 20px 30px; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0 0 4px 0; font-weight: 600;">Hospitality Hackathon 2026 · Addis Ababa</p>
                        <a href="https://hospitalityhackathon.et" style="color: #DC2626; font-size: 12px; text-decoration: none; font-weight: 600;">hospitalityhackathon.et</a>
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
                  roleType, ticketNumber
                ) VALUES (?, ?, ?, ?, ?, ?)
              `).bind(
                userId,
                member.fullName,
                member.email,
                member.phoneNumber || '',
                member.roleType,
                memberTicket
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
