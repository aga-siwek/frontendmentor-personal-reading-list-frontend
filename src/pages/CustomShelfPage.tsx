import { useParams } from 'react-router-dom'
import { useShelf } from '@/queries/shelvesQueries'
import { useMyBooks } from '@/queries/booksQueries'
import BookGrid from '@/components/books/BookGrid'

const CustomShelfPage = () => {
  const { id } = useParams()
  const shelfId = Number(id)

  const { data: shelf, isLoading: shelfLoading } = useShelf(shelfId)
  const { data: allBooks = [], isLoading: booksLoading } = useMyBooks()

  if (shelfLoading || booksLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-warm-muted text-sm">Loading...</p>
      </div>
    )
  }

  if (!shelf) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-warm-muted text-sm">Shelf not found.</p>
      </div>
    )
  }

  const books = allBooks.filter(b => shelf.books.includes(b.isbn))

  return (
    <div className="px-8 py-6">
      <BookGrid key={shelfId} books={books} title={shelf.name} />
    </div>
  )
}

export default CustomShelfPage
