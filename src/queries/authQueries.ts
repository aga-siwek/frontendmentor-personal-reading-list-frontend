import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, login, register, updateUser, deleteAccount } from '@/api/authApi'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => updateUser(name),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data)
    },
  })
}

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  })
}
