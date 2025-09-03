"use client";
import React, { useState, useEffect } from "react";
import styles from "./WhiteBoard.module.css";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { backendUrl } from "../../../../backendUrl";
import AddBook from "../AddBook/AddBook";

// TS INTERFACE
type Book = {
  title: string;
  author_first_name: string;
  author_last_name: string;
  genre: string;
  format: string;
};

const BOOKS_PER_PAGE = 10;

const WhiteBoard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modalAddBook, setModalAddBook] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleModalAddBook = () => setModalAddBook(!modalAddBook);
  const handleRefresh: () => void = () => setRefresh((prev) => !prev);

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

  // Pagination calculée
  const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const currentBooks = books.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const listOfBooks = currentBooks.map((book, index) => (
    <tr key={index}>
      <td>{book.title}</td>
      <td>{book.author_first_name}</td>
      <td>{book.author_last_name}</td>
      <td>{book.genre}</td>
      <td>{book.format}</td>
      <td>
        <button className={styles.btnEdit}>
          <BsThreeDots size={15} />
        </button>
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
          <input type="text" placeholder="Search" />
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
          <strong>{Math.min(startIndex + BOOKS_PER_PAGE, books.length)}</strong>{" "}
          of <strong>{books.length}</strong>
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
    </div>
  );
};

export default WhiteBoard;
