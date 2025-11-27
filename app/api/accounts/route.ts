import { NextResponse } from 'next/server';
import { getStoredAccounts } from '@/lib/auth/session';

export async function GET() {
  try {
    const accounts = await getStoredAccounts();
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
