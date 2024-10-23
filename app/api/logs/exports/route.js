import Log from '../../../../models/Log';
import connectDB from '../../../../config/database';
import { verifyToken } from '../../../../middleware/auth';
import { Parser } from 'json2csv';

export async function GET(req) {
    await connectDB();
    
    const user = verifyToken(req); // Verify the token to get user info
    const { searchParams } = new URL(req.url);
    const showDeleted = searchParams.get('showDeleted') === 'true'; // Check if we want to show deleted logs
    const exportType = searchParams.get('export'); // Get export type (csv or json)

    try {
        // Retrieve logs based on whether we want to show deleted logs or not
        const logs = await Log.find({ isDeleted: showDeleted }); // Fetch logs based on isDeleted

        if (exportType === 'csv') {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(logs);
            return new Response(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename=logs.csv',
                },
            });
        } else if (exportType === 'json') {
            return new Response(JSON.stringify(logs), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Disposition': 'attachment; filename=logs.json',
                },
            });
        }

        return new Response(JSON.stringify(logs), { status: 200 }); // Default response
    } catch (error) {
        console.error('Error fetching logs:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch logs' }), { status: 500 });
    }
}