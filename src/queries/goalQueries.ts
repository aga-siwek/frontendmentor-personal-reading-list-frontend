import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGoal, getGoals, setGoal } from '@/api/goalApi'

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  })
}

export const useGoal = (year: number) => {
  return useQuery({
    queryKey: ['goal', year],
    queryFn: () => getGoal(year),
    retry: false,
  })
}

export const useSetGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ year, goal }: { year: number; goal: number }) => setGoal(year, goal),
    onSuccess: (data) => {
      queryClient.setQueryData(['goal', data.year], data)
    },
  })
}
