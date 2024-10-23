import Log from '../../../../models/Log';
import connectDB from '../../../../config/database';
import { verifyToken } from '../../../../middleware/auth';

export async function DELETE(req) {
    await connectDB();

    // Verify the token to get user info
    const user = verifyToken(req); 

    // Get the log ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: 'Log ID is required' }), { status: 400 });
    }

    try {
        // Find the log by ID and mark it as deleted
        const log = await Log.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!log) {
            return new Response(JSON.stringify({ error: 'Log not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: 'Log deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting log:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete log' }), { status: 500 });
    }
}