import type { User, LoginResponse } from '@/types'
import axiosClient from '@/lib/axiosClient'

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return axiosClient.post('/users/login/', { user_email: email, user_password: password }).then(r => r.data)
}

export const register = async (email: string, password: string): Promise<User> => {
  return axiosClient.post('/users/register/', { user_email: email, user_password: password }).then(r => r.data)
}

export const getCurrentUser = async (): Promise<User> => {
  return axiosClient.get('/users/me/').then(r => r.data)
}

export const updateUser = async (name: string): Promise<User> => {
  return axiosClient.patch('/users/me/', { user_name: name }).then(r => r.data)
}

export const deleteAccount = async (): Promise<void> => {
  return axiosClient.delete('/users/me/').then(r => r.data)
}
