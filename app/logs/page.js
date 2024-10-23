'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [showDeleted, setShowDeleted] = useState(false); // State for showing deleted logs
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const router = useRouter();

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/logs?showDeleted=${showDeleted}&page=${currentPage}&limit=10&search=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const text = await res.text(); 
      if (!res.ok) {
        const errorResponse = JSON.parse(text); // Attempt to parse the error response
        throw new Error(errorResponse.error || 'Failed to fetch logs');
      }

      const { logs, totalPages } = JSON.parse(text); 
      setLogs(logs);
      setTotalPages(totalPages);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching logs:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please log in again.');
      return;
    }

    try {
      const res = await fetch(`/api/logs/delete?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Delete failed');
      }

      fetchLogs(); // Refresh logs after deletion
    } catch (err) {
      console.error('Error during deletion:', err);
      alert(err.message);
    }
  };

  const toggleShowDeleted = () => {
    setShowDeleted((prev) => !prev);
    setCurrentPage(1); // Reset to the first page when toggling
    fetchLogs(); // Fetch logs after toggling
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchLogs(); // Fetch logs when changing the page
  };

  const exportLogs = async (format) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found, please log in again.');
            return;
        }

        const res = await fetch(`/api/logs/exports?export=${format}&showDeleted=${showDeleted}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const { error } = await res.json();
            throw new Error(error || 'Export failed');
        }

        // Create a blob from the response
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create a link to download the blob
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (err) {
        console.error('Error exporting logs:', err);
        alert(err.message);
    }
};

  useEffect(() => {
    fetchLogs();
  }, [showDeleted, currentPage, searchTerm]); // Add showDeleted, currentPage, and searchTerm to the dependency array

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-200 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-gray-800 py-6 border-b">Logs</h2>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 text-center border border-red-300 rounded-md m-4">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left text-gray-700">ID</th>
                  <th className="border px-4 py-2 text-left text-gray-700">Timestamp</th>
                  <th className="border px-4 py-2 text-left text-gray-700">Log Data</th>
                  <th className="border px-4 py-2 text-left text-gray-700">User Email</th>
                  <th className="border px-4 py-2 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition duration-200">
                      <td className="border px-4 py-2 text-gray-600">{log._id}</td>
                      <td className="border px-4 py-2 text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="border px-4 py-2 text-gray-600">{log.actionType}</td>
                      <td className="border px-4 py-2 text-gray-600">{log.additionalData?.email || 'N/A'}</td>
                      <td className="border px-4 py-2 text-gray-600">
                        {!log.isDeleted && (
                          <button 
                            onClick={() => handleDelete(log._id)} 
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">No logs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-4 flex justify-between items-center">
        <button onClick={() => exportLogs('csv')} className="btn mt-2">Export to CSV</button>
        <button onClick={() => exportLogs('json')} className="btn mt-2">Export to JSON</button>
          <button 
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600' 
            onClick={toggleShowDeleted}
          >
            {showDeleted ? 'Hide Deleted Logs' : 'Show Deleted Logs'}
          </button>
        </div>

        <div className="flex justify-center py-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i} 
              onClick={() => handlePageChange(i + 1)} 
              className={`mx-1 px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
