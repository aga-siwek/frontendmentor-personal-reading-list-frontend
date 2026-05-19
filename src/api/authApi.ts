import type { User, LoginResponse } from '@/types'
import { mockUser } from '@/data/mockData'

export const login = async (
  _email: string,
  _password: string
): Promise<LoginResponse> => {
  return {
    access_token: 'mock-token-123',
    message: 'Login Success',
    user_email: mockUser.user_email,
    user_name: mockUser.user_name,
  }
}

export const register = async (
  _email: string,
  _password: string
): Promise<User> => {
  return {
    user_id: mockUser.user_id,
    user_email: mockUser.user_email,
    user_name: null,
    is_admin: false,
  }
}

export const getCurrentUser = async (): Promise<User> => {
  // TODO: return axiosClient.get('/users/me/').then(r => r.data)
  return mockUser
}

export const updateUser = async (name: string): Promise<User> => {
  // TODO: return axiosClient.patch('/users/me/', { user_name: name }).then(r => r.data)
  mockUser.user_name = name
  return { ...mockUser }
}

export const deleteAccount = async (): Promise<void> => {
  // TODO: return axiosClient.delete('/users/me/')
}
