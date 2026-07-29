import { http, HttpResponse, delay } from 'msw'
import { env } from '@config/env.js'

const users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@formbuilder.dev',
    password: 'Demo1234',
    fullName: 'Demo User',
    role: 'user',
  },
]

function makeToken(userId) {
  return `mock-jwt.${btoa(JSON.stringify({ sub: userId, iat: Date.now() }))}.signature`
}

const API = env.API_URL

export const handlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(500)
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      token: makeToken(user.id),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    })
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    await delay(700)
    const body = await request.json()

    const username = (body.username || '').trim()
    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    if (!username || !email || !password) {
      return HttpResponse.json(
        { message: 'Username, email, and password are required.' },
        { status: 400 }
      )
    }

    if (users.find((u) => u.email === email)) {
      return HttpResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    if (users.find((u) => u.username === username)) {
      return HttpResponse.json(
        { message: 'Username is already taken.' },
        { status: 409 }
      )
    }

    const newUser = {
      id: String(users.length + 1),
      username,
      email,
      password,
      fullName: username,
      role: 'user',
    }
    users.push(newUser)

    return HttpResponse.json(
      {
        token: makeToken(newUser.id),
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  }),

  http.get(`${API}/auth/me`, async ({ request }) => {
    await delay(200)
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const user = users[0]
    return HttpResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    })
  }),

  http.post(`${API}/auth/logout`, async () => {
    await delay(100)
    return HttpResponse.json({ ok: true })
  }),
]
