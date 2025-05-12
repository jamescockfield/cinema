import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function errorHandler(error: Error) {
  console.error('API Route Error:', error);

  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
} 