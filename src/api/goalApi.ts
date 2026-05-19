import type { ReadingGoal } from '@/types'
import { mockGoal } from '@/data/mockData'

export const getGoals = async (): Promise<ReadingGoal[]> => {
  return [mockGoal]
}

export const getGoal = async (year: number): Promise<ReadingGoal> => {
  // TODO: return axiosClient.get(`/goals/${year}/`).then(r => r.data)
  if (year === mockGoal.year) return mockGoal
  throw new Error(`No goal found for year ${year}`)
}

export const setGoal = async (year: number, goal: number): Promise<ReadingGoal> => {
  // TODO: return axiosClient.patch(`/goals/${year}/`, { goal }).then(r => r.data)
  mockGoal.goal = goal
  return { ...mockGoal }
}
