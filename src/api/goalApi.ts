import type { ReadingGoal } from '@/types'
import { mockGoal } from '@/data/mockData'

export const getGoals = async (): Promise<ReadingGoal[]> => {
  return [mockGoal]
}

export const getGoal = async (year: number): Promise<ReadingGoal> => {
  if (year === mockGoal.year) return mockGoal
  throw new Error(`No goal found for year ${year}`)
}
