import type { ReadingGoal } from '@/types'
import axiosClient from '@/lib/axiosClient'

export const getGoals = async (): Promise<ReadingGoal[]> => {
  return axiosClient.get('/goals/me/').then(r => r.data)
}

export const getGoal = async (year: number): Promise<ReadingGoal> => {
  return axiosClient.get(`/goals/me/${year}/`).then(r => r.data)
}

export const setGoal = async (year: number, goal: number): Promise<ReadingGoal> => {
  try {
    return await axiosClient.patch(`/goals/me/${year}/`, { goal }).then(r => r.data)
  } catch (e: any) {
    if (e.response?.status === 404) {
      return axiosClient.post('/goals/me/', { year, goal }).then(r => r.data)
    }
    throw e
  }
}
