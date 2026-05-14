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
  return mockUser
}
