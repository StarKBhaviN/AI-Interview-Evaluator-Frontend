import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'questions.json')

const initialQuestions = [
  { id: '1', text: 'Tell us about your background and experience.', category: 'Behavioral', difficulty: 'Easy', tags: ['intro', 'experience'], keywords: ['experience', 'background', 'skills'] },
  { id: '2', text: 'How would you approach debugging a complex application?', category: 'Technical', difficulty: 'Medium', tags: ['debugging', 'problem-solving'], keywords: ['breakpoint', 'logs', 'reproduce', 'isolate'] },
]

// Ensure directory and file exist
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialQuestions, null, 2))
}

export async function GET() {
  const data = fs.readFileSync(DB_PATH, 'utf8')
  return NextResponse.json(JSON.parse(data))
}

export async function POST(req: Request) {
  const newQ = await req.json()
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  
  const questionWithId = { ...newQ, id: Date.now().toString() }
  data.push(questionWithId)
  
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  return NextResponse.json(questionWithId)
}
