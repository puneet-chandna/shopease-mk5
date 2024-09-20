import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface CachedConnection {
  client: MongoClient | null;
  db: any | null;
}

let cached: CachedConnection = { client: null, db: null }

export async function connectToDatabase() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db }
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db('shop-ease')

    cached = { client, db }
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
}