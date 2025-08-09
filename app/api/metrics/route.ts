import { NextResponse } from 'next/server';
import { METRICS_ENABLED, register } from '../../../lib/metrics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    if (!METRICS_ENABLED) {
        return new NextResponse('Not Found', { status: 404 });
    }

    const body = await register.metrics();
    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': register.contentType,
            'Cache-Control': 'no-store',
        },
    });
}


