import { NextResponse } from 'next/server';
import { analyzeMessage, MAX_MESSAGE_LENGTH } from '../../../lib/analyze';

export async function POST(request) {
  try {
    const { message, claimLocation } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 413 });
    }

    return NextResponse.json(await analyzeMessage({ message, claimLocation }));
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
