import Log from '../../../models/Log';
import connectDB from '../../../config/database';
import { verifyToken } from '../../../middleware/auth';
import mongoose from 'mongoose';


export async function GET(req) {
    await connectDB();
    
    const user = verifyToken(req); // Verify the token to get user info
    const { searchParams } = new URL(req.url);
    const showDeleted = searchParams.get('showDeleted') === 'true'; // Check if we want to show deleted logs
    const page = parseInt(searchParams.get('page')) || 1; // Current page, default to 1
    const limit = parseInt(searchParams.get('limit')) || 10; // Limit logs per page, default to 10
    const searchQuery = searchParams.get('search') || ''; // Search term

    try {
        const query = showDeleted ? {} : { isDeleted: false }; // Build query based on showDeleted

        // If there's a search query, add to the filtering
        if (searchQuery) {
            const searchConditions = [];

            // Check if searchQuery is a valid ObjectId
            if (mongoose.Types.ObjectId.isValid(searchQuery)) {
                // If it's a valid ObjectId, search by userId
                searchConditions.push({
                    userId: mongoose.Types.ObjectId(searchQuery), // Match userId as ObjectId
                });
            } else {
                // If it's not a valid ObjectId, search by actionType and additional data
                searchConditions.push({
                    actionType: { $regex: new RegExp(searchQuery, 'i') }, // Match actionType with regex
                });

                searchConditions.push({
                    'additionalData.email': { $regex: new RegExp(searchQuery, 'i') }, // Match email in additionalData
                });
            }

            // Combine search conditions with $or operator
            query.$or = searchConditions; 
        }

        // Fetch logs with pagination
        const logs = await Log.find(query)
            .skip((page - 1) * limit) // Skip logs for pagination
            .limit(limit) // Limit number of logs fetched
            .sort({ timestamp: -1 }); // Sort logs by timestamp

        const totalLogs = await Log.countDocuments(query); // Count total logs based on query
        const totalPages = Math.ceil(totalLogs / limit); // Calculate total pages

        return new Response(JSON.stringify({ logs, totalPages }), { status: 200 });
    } catch (error) {
        console.error('Error fetching logs:', error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Failed to fetch logs', details: error.message }), { status: 500 });
    }
}




export async function exportLogs(req) {
    await connectDB();
    
    const user = verifyToken(req); // Verify the token to get user info
    const { searchParams } = new URL(req.url);
    const showDeleted = searchParams.get('showDeleted') === 'true'; // Check if we want to show deleted logs
    const searchQuery = searchParams.get('search') || ''; // Search term

    try {
        const query = showDeleted ? {} : { isDeleted: false };

        if (searchQuery) {
            query.$or = [
                { userId: { $regex: searchQuery, $options: 'i' } },
                { actionType: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const logs = await Log.find(query).sort({ timestamp: -1 }); // Fetch all matching logs

        return new Response(JSON.stringify(logs), { status: 200 });
    } catch (error) {
        console.error('Error exporting logs:', error);
        return new Response(JSON.stringify({ error: 'Failed to export logs' }), { status: 500 });
    }
}