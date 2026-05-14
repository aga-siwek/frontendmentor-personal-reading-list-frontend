import { useQuery } from '@tanstack/react-query'
import { getGoal } from '@/api/goalApi'

export const useGoal = (year: number) => {
  return useQuery({
    queryKey: ['goal', year],
    queryFn: () => getGoal(year),
    retry: false,
  })
}
