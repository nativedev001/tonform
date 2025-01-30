'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FaTicketAlt, FaProjectDiagram, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    router.push('/login');
  };

  return (
    <div className="relative">
      <button
        className="md:hidden p-4 text-white bg-gray-800"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>
      <div className={`fixed inset-y-0 left-0 w-72 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center">TonForms</h1>
            <button className="md:hidden p-2 text-white bg-gray-800" onClick={toggleSidebar}>
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link href="/formlottery" className="flex items-center py-2 px-4 bg-violet-500 rounded-md hover:bg-violet-600 transition">
              <FaTicketAlt className="mr-2" />
              Lottery Project Form
            </Link>
            <Link href="/formproject" className="flex items-center py-2 px-4 bg-violet-500 rounded-md hover:bg-violet-600 transition">
              <FaProjectDiagram className="mr-2" />
              Upcoming Project Form
            </Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center py-2 px-4 bg-red-500 rounded-md hover:bg-red-600 transition">
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;