"use client";
import React, { useRef, useEffect } from "react";
import styles from "./Preview.module.css";

type Book = {
  title: string;
  author_first_name: string;
  author_last_name: string;
  genre: string;
  format: string;
  publication_year?: number;
  isbn?: string;
  coffee_shop_name?: string;
  coffee_shop_address?: string;
};

type PreviewModalProps = {
  book: Book;
  handlePreviewBook: () => void;
};

const PreviewModal: React.FC<PreviewModalProps> = ({
  book,
  handlePreviewBook,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Ferme la modal si clic à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handlePreviewBook();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handlePreviewBook]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <span className={styles.close} onClick={handlePreviewBook}>
          &times;
        </span>
        <h2>📖 Preview Book</h2>
        <div className={styles.content}>
          <p>
            <strong>Title:</strong> {book.title}
          </p>
          <p>
            <strong>Author:</strong> {book.author_first_name}{" "}
            {book.author_last_name}
          </p>
          <p>
            <strong>Genre:</strong> {book.genre}
          </p>
          <p>
            <strong>Format:</strong> {book.format}
          </p>
          {book.publication_year && (
            <p>
              <strong>Year:</strong> {book.publication_year}
            </p>
          )}
          {book.isbn && (
            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>
          )}
          {book.coffee_shop_name && (
            <p>
              <strong>Coffee Shop:</strong> {book.coffee_shop_name},{" "}
              {book.coffee_shop_address}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
