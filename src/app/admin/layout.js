import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const admin = ({children}) => {
  return (
    <div>
        <AdminProtectedRoute>
        <Header/>
        {children}
        </AdminProtectedRoute>

    </div>
  )
}

export default admin