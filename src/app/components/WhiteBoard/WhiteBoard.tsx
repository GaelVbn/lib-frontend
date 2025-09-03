"use client";
import React, { useState, useEffect } from "react";
import styles from "./WhiteBoard.module.css";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { backendUrl } from "../../../../backendUrl";

// TS INTERFACE
type Book = {
  title: string;
  author_first_name: string;
  author_last_name: string;
  genre: string;
  format: string;
};

const WhiteBoard = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const listOfBooks = books.map((book, index) => (
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
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <IoIosSearch className={styles.searchIcon} size={18} />
          <input type="text" placeholder="Search" />
        </div>
        <button>Add book</button>
      </div>
      <div className={styles.data}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">TITLE</th>
              <th scope="col">AUTHOR FIRSTNAME</th>
              <th scope="col">AUTHOR LASTNAME</th>
              <th scope="col">GENRE</th>
              <th scope="col">Format</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{listOfBooks}</tbody>
        </table>
      </div>

      <nav className={styles.pages} aria-label="table-de-navigation">
        <span>
          Showing <strong>1-10</strong> of <strong>1000</strong>
        </span>
        <ul>
          <li>
            <button disabled>«</button>
          </li>
          <li>
            <button className={styles.active}>1</button>
          </li>
          <li>
            <button>2</button>
          </li>
          <li>
            <button>3</button>
          </li>
          <li>
            <button>…</button>
          </li>
          <li>
            <button>100</button>
          </li>
          <li>
            <button>»</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default WhiteBoard;
