import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'candidates.json')

// Ensure directory and file exist
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2))
}

export async function GET() {
  const data = fs.readFileSync(DB_PATH, 'utf8')
  return NextResponse.json(JSON.parse(data))
}

export async function POST(req: Request) {
  const newCandidate = await req.json()
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  
  const candidateWithId = {
    ...newCandidate,
    id: Date.now().toString(),
    status: 'Pending',
    score: null,
    date: new Date().toISOString()
  }
  
  data.push(candidateWithId)
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  
  return NextResponse.json(candidateWithId)
}
