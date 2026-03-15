import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { generateTicketNumber, generateQRCode } from './utils/ticketing';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Database schema
const schema = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  alxAffiliation TEXT NOT NULL,
  registrationType TEXT NOT NULL,
  teamName TEXT,
  strengths TEXT NOT NULL,
  roleType TEXT NOT NULL,
  registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  qrCode TEXT UNIQUE,
  ticketNumber TEXT UNIQUE,
  checkInStatus INTEGER DEFAULT 0,
  checkInTime DATETIME
);

CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  roleType TEXT NOT NULL,
  ticketNumber TEXT UNIQUE,
  qrCode TEXT UNIQUE,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_ticket ON users(ticketNumber);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_ticket ON team_members(ticketNumber);
`;

// Initialize database
app.get('/api/init', async (c) => {
  try {
    await c.env.DB.prepare(schema).run();
    return c.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return c.json({ error: 'Failed to initialize database' }, 500);
  }
});

// Registration endpoint
app.post('/api/register', async (c) => {
  try {
    const body = await c.req.json();
    const {
      fullName,
      phoneNumber,
      email,
      alxAffiliation,
      registrationType,
      teamName,
      strengths,
      roleType,
      teamMembers
    } = body;

    // Check for existing user
    const existingUser = await c.env.DB
      .prepare('SELECT email FROM users WHERE email = ?')
      .bind(email)
      .first();

    if (existingUser) {
      return c.json({ message: 'Email already registered' }, 400);
    }

    // Generate ticket number and QR code
    const ticketNumber = generateTicketNumber();
    const qrCode = await generateQRCode(JSON.stringify({
      ticketNumber,
      name: fullName,
      email,
      registrationType,
      teamName: registrationType === 'team' ? teamName : undefined
    }));

    // Start a database transaction
    const { success, error } = await c.env.DB.batch([
      // Insert main user
      c.env.DB.prepare(`
        INSERT INTO users (
          fullName, phoneNumber, email, alxAffiliation, registrationType,
          teamName, strengths, roleType, ticketNumber, qrCode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        fullName, phoneNumber, email, alxAffiliation, registrationType,
        teamName, strengths, roleType, ticketNumber, qrCode
      ),

      // Insert team members if team registration
      ...(registrationType === 'team' && teamMembers?.length > 0
        ? teamMembers.map(member => {
            if (!member.email || !member.fullName) return null;
            const memberTicketNumber = generateTicketNumber();
            const memberQrCode = generateQRCode(JSON.stringify({
              ticketNumber: memberTicketNumber,
              name: member.fullName,
              email: member.email,
              teamName,
              isTeamMember: true
            }));

            return c.env.DB.prepare(`
              INSERT INTO team_members (
                userId, fullName, email, phoneNumber,
                roleType, ticketNumber, qrCode
              ) VALUES (
                last_insert_rowid(), ?, ?, ?, ?, ?, ?
              )
            `).bind(
              member.fullName, member.email, member.phoneNumber,
              member.roleType, memberTicketNumber, memberQrCode
            );
          }).filter(query => query !== null)
        : []
      )
    ]);

    if (!success) {
      throw new Error(error || 'Failed to save registration');
    }

    // Send confirmation emails (implement this part in your email service)
    // You might want to use a separate worker or external service for sending emails

    return c.json({
      message: 'Registration successful',
      ticketNumber
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      message: 'Registration failed. Please try again.',
      error: error.message
    }, 500);
  }
});

// Get registration details
app.get('/api/registration/:ticketNumber', async (c) => {
  try {
    const { ticketNumber } = c.req.param();
    
    const user = await c.env.DB
      .prepare(`
        SELECT u.*, GROUP_CONCAT(
          json_object(
            'fullName', tm.fullName,
            'email', tm.email,
            'phoneNumber', tm.phoneNumber,
            'roleType', tm.roleType,
            'ticketNumber', tm.ticketNumber
          )
        ) as teamMembersJson
        FROM users u
        LEFT JOIN team_members tm ON tm.userId = u.id
        WHERE u.ticketNumber = ?
        GROUP BY u.id
      `)
      .bind(ticketNumber)
      .first();

    if (!user) {
      return c.json({ message: 'Registration not found' }, 404);
    }

    // Parse team members if present
    if (user.teamMembersJson) {
      user.teamMembers = JSON.parse(`[${user.teamMembersJson}]`);
      delete user.teamMembersJson;
    } else {
      user.teamMembers = [];
    }

    return c.json(user);

  } catch (error) {
    console.error('Error fetching registration:', error);
    return c.json({ message: 'Failed to fetch registration details' }, 500);
  }
});

// Check-in endpoint
app.post('/api/checkin/:ticketNumber', async (c) => {
  try {
    const { ticketNumber } = c.req.param();
    
    const result = await c.env.DB
      .prepare(`
        UPDATE users 
        SET checkInStatus = 1, checkInTime = CURRENT_TIMESTAMP 
        WHERE ticketNumber = ? AND checkInStatus = 0
      `)
      .bind(ticketNumber)
      .run();

    if (result.changes === 0) {
      return c.json({ message: 'Invalid ticket or already checked in' }, 400);
    }

    return c.json({ message: 'Check-in successful' });

  } catch (error) {
    console.error('Check-in error:', error);
    return c.json({ message: 'Check-in failed' }, 500);
  }
});

export default app;
