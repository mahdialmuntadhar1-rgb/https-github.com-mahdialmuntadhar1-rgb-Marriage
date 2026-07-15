import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Env = {
  DB: D1Database
  PHOTOS: R2Bucket
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS configuration
app.use('/*', cors({
  origin: ['https://0dfa9f20.zawaj-app-v4.pages.dev', 'http://localhost:5173', 'http://localhost:3000'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: true,
}))

// Utility: Generate ID
const generateId = () => crypto.randomUUID()

// Utility: SHA-256 hash with salt
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Utility: Generate random salt
const generateSalt = () => crypto.randomUUID()

// Utility: Generate JWT (simplified - in production use proper JWT library)
const generateToken = (userId: string, secret: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }))
  const signature = btoa(`${header}.${payload}.${secret}`)
  return `${header}.${payload}.${signature}`
}

// Utility: Verify JWT (simplified)
const verifyToken = (token: string, secret: string): { userId: string } | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return { userId: payload.userId }
  } catch {
    return null
  }
}

// Auth Middleware
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const token = authHeader.substring(7)
  const decoded = verifyToken(token, c.env.JWT_SECRET)
  
  if (!decoded) {
    return c.json({ error: 'Invalid token' }, 401)
  }
  
  // Check if session exists and is not expired
  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE user_id = ? AND expires_at > datetime("now")'
  ).bind(decoded.userId).first()
  
  if (!session) {
    return c.json({ error: 'Session expired' }, 401)
  }
  
  c.set('userId', decoded.userId)
  await next()
}

// ==================== AUTH ENDPOINTS ====================

// Register
app.post('/api/auth/register', async (c) => {
  const { name, email, password, gender, age, country, governorate } = await c.req.json()
  
  if (!name || !email || !password || !gender || !age) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  
  // Check if user exists
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) {
    return c.json({ error: 'Email already registered' }, 400)
  }
  
  // Hash password
  const salt = generateSalt()
  const passwordHash = await hashPassword(password, salt)
  
  // Create user
  const userId = generateId()
  await c.env.DB.prepare(`
    INSERT INTO users (id, name, email, password_hash, salt, gender, age, country, governorate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(userId, name, email, passwordHash, salt, gender, age, country || 'Iraq', governorate || 'Baghdad').run()
  
  // Generate token
  const token = generateToken(userId, c.env.JWT_SECRET)
  
  // Create session
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const sessionId = generateId()
  await c.env.DB.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, userId, token, expiresAt).run()
  
  return c.json({ 
    token, 
    user: { id: userId, name, email, gender, age } 
  })
})

// Login
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  
  if (!email || !password) {
    return c.json({ error: 'Missing email or password' }, 400)
  }
  
  // Get user
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }
  
  // Verify password
  const passwordHash = await hashPassword(password, user.salt)
  if (passwordHash !== user.password_hash) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }
  
  // Generate token
  const token = generateToken(user.id, c.env.JWT_SECRET)
  
  // Create session
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const sessionId = generateId()
  await c.env.DB.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, user.id, token, expiresAt).run()
  
  return c.json({ 
    token, 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      gender: user.gender, 
      age: user.age 
    } 
  })
})

// Logout
app.post('/api/auth/logout', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  // Delete all sessions for this user
  await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run()
  
  return c.json({ success: true })
})

// Get current user
app.get('/api/auth/me', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  // Remove sensitive fields
  const { password_hash, salt, ...safeUser } = user as any
  
  return c.json(safeUser)
})

// ==================== MEMBERS ENDPOINTS ====================

// Get members (paginated)
app.get('/api/members', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const gender = c.req.query('gender')
  const governorate = c.req.query('governorate')
  const offset = (page - 1) * limit
  
  let query = 'SELECT * FROM users WHERE 1=1'
  const params: any[] = []
  
  if (gender) {
    query += ' AND gender = ?'
    params.push(gender)
  }
  
  if (governorate) {
    query += ' AND governorate = ?'
    params.push(governorate)
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)
  
  const stmt = c.env.DB.prepare(query)
  for (let i = 0; i < params.length; i++) {
    stmt.bind(params[i])
  }
  
  const result = await stmt.all()
  
  // Remove sensitive fields
  const members = result.results.map((user: any) => {
    const { password_hash, salt, ...safeUser } = user
    return safeUser
  })
  
  return c.json({ members, page, limit, total: members.length })
})

// Get single member
app.get('/api/members/:id', async (c) => {
  const id = c.req.param('id')
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
  if (!user) {
    return c.json({ error: 'Member not found' }, 404)
  }
  
  // Remove sensitive fields
  const { password_hash, salt, ...safeUser } = user as any
  
  return c.json(safeUser)
})

// ==================== LIKES ENDPOINTS ====================

// Toggle like (and check for mutual like → create match)
app.post('/api/likes', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const { likedUserId } = await c.req.json()
  
  if (!likedUserId) {
    return c.json({ error: 'Missing likedUserId' }, 400)
  }
  
  if (userId === likedUserId) {
    return c.json({ error: 'Cannot like yourself' }, 400)
  }
  
  // Check if like already exists
  const existing = await c.env.DB.prepare(
    'SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?'
  ).bind(userId, likedUserId).first()
  
  if (existing) {
    // Unlike
    await c.env.DB.prepare(
      'DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?'
    ).bind(userId, likedUserId).run()
    
    return c.json({ success: true, liked: false })
  }
  
  // Like
  const likeId = generateId()
  await c.env.DB.prepare(
    'INSERT INTO likes (id, user_id, liked_user_id) VALUES (?, ?, ?)'
  ).bind(likeId, userId, likedUserId).run()
  
  // Check for mutual like
  const mutualLike = await c.env.DB.prepare(
    'SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?'
  ).bind(likedUserId, userId).first()
  
  let matchCreated = false
  if (mutualLike) {
    // Create match
    const matchId = generateId()
    await c.env.DB.prepare(
      'INSERT INTO matches (id, user1_id, user2_id, status) VALUES (?, ?, ?, ?)'
    ).bind(matchId, userId, likedUserId, 'accepted').run()
    matchCreated = true
  }
  
  return c.json({ success: true, liked: true, matchCreated })
})

// Get my likes
app.get('/api/likes/my', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const result = await c.env.DB.prepare(`
    SELECT u.* FROM likes l
    JOIN users u ON l.liked_user_id = u.id
    WHERE l.user_id = ?
    ORDER BY l.created_at DESC
  `).bind(userId).all()
  
  const likes = result.results.map((user: any) => {
    const { password_hash, salt, ...safeUser } = user
    return safeUser
  })
  
  return c.json({ likes })
})

// Get who liked me
app.get('/api/likes/received', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const result = await c.env.DB.prepare(`
    SELECT u.* FROM likes l
    JOIN users u ON l.user_id = u.id
    WHERE l.liked_user_id = ?
    ORDER BY l.created_at DESC
  `).bind(userId).all()
  
  const likes = result.results.map((user: any) => {
    const { password_hash, salt, ...safeUser } = user
    return safeUser
  })
  
  return c.json({ likes })
})

// ==================== MATCHES ENDPOINTS ====================

// Get my matches
app.get('/api/matches', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const result = await c.env.DB.prepare(`
    SELECT u.* FROM matches m
    JOIN users u ON (m.user1_id = u.id OR m.user2_id = u.id)
    WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ? AND m.status = 'accepted'
    ORDER BY m.created_at DESC
  `).bind(userId, userId, userId).all()
  
  const matches = result.results.map((user: any) => {
    const { password_hash, salt, ...safeUser } = user
    return safeUser
  })
  
  return c.json({ matches })
})

// ==================== MESSAGES ENDPOINTS ====================

// Get messages for a match (paginated)
app.get('/api/messages/:matchId', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const matchId = c.req.param('matchId')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit
  
  // Verify user is part of this match
  const match = await c.env.DB.prepare(
    'SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)'
  ).bind(matchId, userId, userId).first()
  
  if (!match) {
    return c.json({ error: 'Match not found or unauthorized' }, 404)
  }
  
  const result = await c.env.DB.prepare(`
    SELECT * FROM messages 
    WHERE match_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `).bind(matchId, limit, offset).all()
  
  return c.json({ messages: result.results, page, limit })
})

// Send message
app.post('/api/messages', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const { matchId, text } = await c.req.json()
  
  if (!matchId || !text) {
    return c.json({ error: 'Missing matchId or text' }, 400)
  }
  
  // Verify user is part of this match
  const match = await c.env.DB.prepare(
    'SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)'
  ).bind(matchId, userId, userId).first()
  
  if (!match) {
    return c.json({ error: 'Match not found or unauthorized' }, 404)
  }
  
  // Create message
  const messageId = generateId()
  await c.env.DB.prepare(`
    INSERT INTO messages (id, match_id, sender_id, text) VALUES (?, ?, ?, ?)
  `).bind(messageId, matchId, userId, text).run()
  
  return c.json({ success: true, messageId })
})

// ==================== UPLOAD ENDPOINT ====================

// Upload avatar
app.post('/api/upload/avatar', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const formData = await c.req.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400)
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return c.json({ error: 'File must be an image' }, 400)
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: 'File too large (max 5MB)' }, 400)
  }
  
  // Upload to R2
  const fileName = `avatars/${userId}/${Date.now()}-${file.name}`
  await c.env.PHOTOS.put(fileName, file)
  
  // Get public URL
  const url = `https://pub-${c.env.PHOTOS.httpMetadata?.accountId || 'your-account-id'}.r2.dev/${fileName}`
  
  // Update user avatar_url
  await c.env.DB.prepare(
    'UPDATE users SET avatar_url = ? WHERE id = ?'
  ).bind(url, userId).run()
  
  return c.json({ success: true, url })
})

export default app
