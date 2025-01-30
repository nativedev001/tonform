import React from 'react'
import Form from '../components/Form';
import Sidebar from '../components/Sidebar';

const FormLottery = () => {
  return (
    <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex flex-col items-center justify-center flex-grow py-2">
      <Form />
    </div>
  </div>
  )
}

export default FormLottery