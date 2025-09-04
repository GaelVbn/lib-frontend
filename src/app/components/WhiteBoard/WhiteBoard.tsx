"use client";
import React, { useState, useEffect } from "react";
import styles from "./WhiteBoard.module.css";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { backendUrl } from "../../../../backendUrl";
import AddBook from "../AddBook/AddBook";
import EditBtn from "../EditBtn/EditBtn";
import Preview from "../Preview/Preview";
import EditBookModal from "../EditBookModal/EditBookModal";

// TS INTERFACE
type Book = {
  book_id: number;
  title: string;
  author_first_name: string;
  author_last_name: string;
  genre: string;
  format: string;
  publication_year: number;
  isbn: any;
  coffee_shop_name: string;
  coffee_shop_address: string;
};

const BOOKS_PER_PAGE = 10;

const WhiteBoard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modalAddBook, setModalAddBook] = useState<boolean>(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleEditBook = (book: Book) => setEditBook(book);
  const closeEditModal = () => setEditBook(null);
  const handleModalAddBook = () => setModalAddBook(!modalAddBook);
  const handleModalEditBtn = (index: number) =>
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  const handleRefresh = () => setRefresh((prev) => !prev);

  // Fetch des livres
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${backendUrl}/books`);
        const data: Book[] = await response.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, [refresh]);

  // Reset page à 1 lorsque la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtrer les livres selon la recherche
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.genre &&
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.format &&
        book.format.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + BOOKS_PER_PAGE
  );

  const listOfBooks = currentBooks.map((book, index) => (
    <tr key={book.book_id}>
      <td>{book.title}</td>
      <td>{book.author_first_name}</td>
      <td>{book.author_last_name}</td>
      <td>{book.genre}</td>
      <td>{book.format}</td>
      <td style={{ position: "relative" }}>
        <button
          className={styles.btnEdit}
          onClick={() => handleModalEditBtn(index)}
        >
          <BsThreeDots size={15} />
        </button>
        {openDropdownIndex === index && (
          <EditBtn
            handleModalEditBtn={() => handleModalEditBtn(index)}
            bookId={book.book_id}
            handleRefresh={handleRefresh}
            onPreview={() => setPreviewBook(book)}
            handleEditBook={() => handleEditBook(book)}
          />
        )}
      </td>
    </tr>
  ));

  // Gestion navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(
          <li key={i}>
            <button
              className={i === currentPage ? styles.active : ""}
              onClick={() => goToPage(i)}
            >
              {i}
            </button>
          </li>
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pages.push(
          <li key={`dots-${i}`}>
            <span>…</span>
          </li>
        );
      }
    }
    return pages;
  };

  return (
    <div className={styles.box}>
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <IoIosSearch className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={handleModalAddBook}>Add book</button>
      </div>

      <div className={styles.data}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">TITLE</th>
              <th scope="col">AUTHOR FIRSTNAME</th>
              <th scope="col">AUTHOR LASTNAME</th>
              <th scope="col">GENRE</th>
              <th scope="col">FORMAT</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{listOfBooks}</tbody>
        </table>
      </div>

      <nav className={styles.pages} aria-label="table-de-navigation">
        <span>
          Showing <strong>{startIndex + 1}</strong>-
          <strong>
            {Math.min(startIndex + BOOKS_PER_PAGE, filteredBooks.length)}
          </strong>
          of <strong>{filteredBooks.length}</strong>
        </span>
        <ul>
          <li>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
          </li>
          {renderPageNumbers()}
          <li>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </li>
        </ul>
      </nav>

      {modalAddBook && (
        <AddBook
          handleModalAddBook={handleModalAddBook}
          handleRefresh={handleRefresh}
        />
      )}

      {previewBook && (
        <Preview
          book={previewBook}
          handlePreviewBook={() => setPreviewBook(null)}
        />
      )}

      {editBook && (
        <EditBookModal
          book={editBook}
          handleClose={closeEditModal}
          handleRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default WhiteBoard;
