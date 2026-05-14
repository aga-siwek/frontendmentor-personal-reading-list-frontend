import type { Shelf } from '@/types'
import { mockShelves } from '@/data/mockData'

export const getMyShelves = async (): Promise<Shelf[]> => {
  return mockShelves
}

export const getShelf = async (id: number): Promise<Shelf> => {
  const shelf = mockShelves.find(s => s.id === id)
  if (!shelf) throw new Error(`Shelf ${id} not found`)
  return shelf
}

export const createShelf = async (name: string): Promise<Shelf> => {
  return {
    id: Date.now(),
    user_id: 1,
    name,
    position: mockShelves.length,
    is_default: false,
    books: [],
  }
}

export const updateShelf = async (id: number, data: Partial<Pick<Shelf, 'name' | 'position'>>): Promise<Shelf> => {
  const shelf = mockShelves.find(s => s.id === id)
  if (!shelf) throw new Error(`Shelf ${id} not found`)
  return { ...shelf, ...data }
}

export const deleteShelf = async (_id: number): Promise<{ message: string }> => {
  return { message: 'Shelf deleted' }
}

export const addBookToShelf = async (shelfId: number, isbn: string): Promise<{ shelf_id: number; isbn: string }> => {
  return { shelf_id: shelfId, isbn }
}

export const removeBookFromShelf = async (shelfId: number, isbn: string): Promise<{ message: string }> => {
  return { message: `Book ${isbn} removed from shelf ${shelfId}` }
}
