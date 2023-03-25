const { nanoid } = require('nanoid')
const books = require('./books')

const createBookHandler = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload

  let finished = false
  if (pageCount === readPage) finished = true

  const id = nanoid()
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  } else if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  books.push(newBooks)

  const isSuccess = books.filter(book => book.id === id)

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }
}

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query

  if (name) {
    const booksByName = books.filter(book => book.name.toLowerCase().includes(name.replace(/"/g, '').toLowerCase()))

    return h.response({
      status: 'success',
      data: {
        books: booksByName.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }).code(200)
  }

  if (reading) {
    const booksByRead = books.filter(book => book.reading === (reading === '1'))
    if (booksByRead) {
      return h.response({
        status: 'success',
        data: {
          books: booksByRead.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }).code(200)
    }
  }

  if (finished) {
    const booksByFinished = books.filter(book => book.finished === (finished === '1'))
    if (booksByFinished) {
      return h.response({
        status: 'success',
        data: {
          books: booksByFinished.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }).code(200)
    }
  }

  return h.response({
    status: 'success',
    data: {
      books: books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }).code(200)
}

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params

  const book = books.filter(book => book.id === bookId)[0]

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload

  const updatedAt = new Date().toISOString()

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  } else if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const index = books.findIndex(book => book.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
}

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params

  const index = books.findIndex(book => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
}

module.exports = {
  createBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}