'use client'
import React from 'react';
import FormProjectMain from '../components/FormProject';
import Sidebar from '../components/Sidebar';

const FormProject = () => {
  return (
    <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex flex-col items-center justify-center flex-grow py-2">
      <FormProjectMain />
    </div>
  </div>
  )
}

export default FormProject