'use client'
import Sidebar from "./components/Sidebar";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('session');
    if (!session) {
      router.push('/login');
    }

    // Remove session on window close
    const handleWindowClose = () => {
      localStorage.removeItem('session');
    };
    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [router]);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col items-center justify-center flex-grow py-2">
        <div className="bg-white p-4 rounded-lg shadow-lg h-[250px] w-[400px] py-2">
          <p className="text-center text-2xl">Hello Forms</p>
         
        </div>
      </div>
    </div>
  );
}