import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ShelfPage from '@/pages/ShelfPage'
import BookDetailPage from '@/pages/BookDetailPage'
import SettingsPage from '@/pages/SettingsPage'
import Layout from '@/components/layout/Layout'
import CustomShelfPage from '@/pages/CustomShelfPage'

const PrivateRoute = () => {
  const token = localStorage.getItem('token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/shelf/currently-reading" replace />} />
            <Route path="/shelf/:status" element={<ShelfPage />} />
            <Route path="/books/:isbn" element={<BookDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/shelves/:id" element={<CustomShelfPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
