import type { Shelf } from '@/types'
import axiosClient from '@/lib/axiosClient'

export const getMyShelves = async (): Promise<Shelf[]> => {
  return axiosClient.get('/shelves/me/').then(r => r.data)
}

export const getShelf = async (id: number): Promise<Shelf> => {
  return axiosClient.get(`/shelves/${id}/`).then(r => r.data)
}

export const createShelf = async (name: string): Promise<Shelf> => {
  return axiosClient.post('/shelves/me/', { name }).then(r => r.data)
}

export const updateShelf = async (id: number, data: Partial<Pick<Shelf, 'name' | 'position'>>): Promise<Shelf> => {
  return axiosClient.patch(`/shelves/${id}/`, data).then(r => r.data)
}

export const deleteShelf = async (id: number): Promise<{ message: string }> => {
  return axiosClient.delete(`/shelves/${id}/`).then(r => r.data)
}

export const addBookToShelf = async (shelfId: number, isbn: string): Promise<{ shelf_id: number; isbn: string }> => {
  return axiosClient.post(`/shelves/${shelfId}/books/${isbn}/`).then(r => r.data)
}

export const removeBookFromShelf = async (shelfId: number, isbn: string): Promise<{ message: string }> => {
  return axiosClient.delete(`/shelves/${shelfId}/books/${isbn}/`).then(r => r.data)
}
