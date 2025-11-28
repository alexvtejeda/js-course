import { NextRequest, NextResponse } from 'next/server';
import { setThemePreference, getThemePreference } from '@/lib/auth/session';

export async function GET() {
  try {
    const theme = await getThemePreference();
    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error getting theme:', error);
    return NextResponse.json({ theme: 'dark' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json();

    if (theme !== 'light' && theme !== 'dark') {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    await setThemePreference(theme);
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('Error setting theme:', error);
    return NextResponse.json(
      { error: 'Failed to set theme' },
      { status: 500 }
    );
  }
}
