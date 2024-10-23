'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center w-96">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome to the App</h1>

        <p className="text-gray-600 mb-6">
          Please register or login to continue.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push('/auth/register')}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>

          <button
            onClick={() => router.push('/auth/login')}
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
