import { NextResponse } from 'next/server'

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL

export async function GET() {
  try {
    const response = await fetch(`${BOT_API_URL}/models/public`)
    if (!response.ok) {
      throw new Error('Failed to fetch models from bot API')
    }
    const models = await response.json()
    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}