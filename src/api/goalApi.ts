import type { ReadingGoal } from '@/types'
import { mockGoals } from '@/data/mockData'

export const getGoals = async (): Promise<ReadingGoal[]> => {
  // TODO: return axiosClient.get('/goals/').then(r => r.data)
  return mockGoals
}

export const getGoal = async (year: number): Promise<ReadingGoal> => {
  // TODO: return axiosClient.get(`/goals/${year}/`).then(r => r.data)
  const goal = mockGoals.find(g => g.year === year)
  if (!goal) throw new Error(`No goal found for year ${year}`)
  return goal
}

export const setGoal = async (year: number, goal: number): Promise<ReadingGoal> => {
  // TODO: return axiosClient.patch(`/goals/${year}/`, { goal }).then(r => r.data)
  const existing = mockGoals.find(g => g.year === year)
  if (existing) {
    existing.goal = goal
    return { ...existing }
  }
  const newGoal: ReadingGoal = { id: mockGoals.length + 1, user_id: 1, year, goal, books_finished: 0 }
  mockGoals.push(newGoal)
  return newGoal
}
