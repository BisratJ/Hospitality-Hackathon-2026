export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
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
              <title>ALX Hackathon Registration</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f4f7fa;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to ALX Hackathon!</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">Dear ${data.fullName},</p>
                  
                  <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">Thank you for registering for the ALX Hackathon. Your registration has been confirmed!</p>
                  
                  <!-- Ticket Info Box -->
                  <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #1e40af; font-size: 20px; margin: 0 0 20px 0;">Registration Details</h2>
                    <div style="margin-bottom: 15px;">
                      <strong style="color: #1e40af;">Ticket Number:</strong>
                      <span style="color: #374151; margin-left: 10px;">${ticketNumber}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                      <strong style="color: #1e40af;">Role:</strong>
                      <span style="color: #374151; margin-left: 10px;">${data.roleType}</span>
                    </div>
                    ${data.teamName ? `
                    <div style="margin-bottom: 15px;">
                      <strong style="color: #1e40af;">Team:</strong>
                      <span style="color: #374151; margin-left: 10px;">${data.teamName}</span>
                    </div>
                    ` : ''}
                  </div>

                  <!-- QR Code Section -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1e40af; font-size: 20px; margin-bottom: 20px;">Your Check-in QR Code</h2>
                    <div style="background-color: white; display: inline-block; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200" alt="Check-in QR Code" style="width: 200px; height: 200px;"/>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">Please keep this QR code handy for check-in at the event</p>
                  </div>

                  <!-- Footer -->
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
                    <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Best regards,</p>
                    <p style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0;">ALX Hackathon Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        // Send email using Mailchannels
        const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: data.email, name: data.fullName }],
              },
            ],
            from: {
              email: 'noreply@alxhackathon.com',
              name: 'ALX Hackathon',
            },
            subject: 'ALX Hackathon Registration Confirmation',
            content: [
              {
                type: 'text/html',
                value: emailHtml,
              },
            ],
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text());
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

              // Create email HTML for team member
              const memberEmailHtml = `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ALX Hackathon Registration</title>
                  </head>
                  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f4f7fa;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      <!-- Header -->
                      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to ALX Hackathon!</h1>
                      </div>

                      <!-- Content -->
                      <div style="padding: 40px 30px;">
                        <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">Dear ${member.fullName},</p>
                        
                        <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">You have been registered as a team member for the ALX Hackathon. Your registration has been confirmed!</p>
                        
                        <!-- Ticket Info Box -->
                        <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                          <h2 style="color: #1e40af; font-size: 20px; margin: 0 0 20px 0;">Registration Details</h2>
                          <div style="margin-bottom: 15px;">
                            <strong style="color: #1e40af;">Team:</strong>
                            <span style="color: #374151; margin-left: 10px;">${data.teamName}</span>
                          </div>
                          <div style="margin-bottom: 15px;">
                            <strong style="color: #1e40af;">Ticket Number:</strong>
                            <span style="color: #374151; margin-left: 10px;">${memberTicket}</span>
                          </div>
                          <div style="margin-bottom: 15px;">
                            <strong style="color: #1e40af;">Role:</strong>
                            <span style="color: #374151; margin-left: 10px;">${member.roleType}</span>
                          </div>
                        </div>

                        <!-- QR Code Section -->
                        <div style="text-align: center; margin-bottom: 30px;">
                          <h2 style="color: #1e40af; font-size: 20px; margin-bottom: 20px;">Your Check-in QR Code</h2>
                          <div style="background-color: white; display: inline-block; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(memberQrData)}&size=200x200" alt="Check-in QR Code" style="width: 200px; height: 200px;"/>
                          </div>
                          <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">Please keep this QR code handy for check-in at the event</p>
                        </div>

                        <!-- Footer -->
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
                          <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Best regards,</p>
                          <p style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0;">ALX Hackathon Team</p>
                        </div>
                      </div>
                    </div>
                  </body>
                </html>
              `;

              // Send email to team member using Mailchannels
              const memberEmailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  personalizations: [
                    {
                      to: [{ email: member.email, name: member.fullName }],
                    },
                  ],
                  from: {
                    email: 'noreply@alxhackathon.com',
                    name: 'ALX Hackathon',
                  },
                  subject: 'ALX Hackathon Team Registration Confirmation',
                  content: [
                    {
                      type: 'text/html',
                      value: memberEmailHtml,
                    },
                  ],
                }),
              });

              if (!memberEmailResponse.ok) {
                console.error('Failed to send team member email:', await memberEmailResponse.text());
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
            ticketNumber 
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
