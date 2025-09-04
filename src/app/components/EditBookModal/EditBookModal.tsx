"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./EditBookModal.module.css";
import { backendUrl } from "../../../../backendUrl";

type Book = {
  book_id: number;
  title: string;
  genre: string;
  author_first_name: string;
  author_last_name: string;
  coffee_shop_name: string;
  coffee_shop_address: string;
  publication_year?: number;
  isbn?: string;
  format: string;
};

type EditBookProps = {
  book: Book;
  handleClose: () => void;
  handleRefresh: () => void;
};

const EditBookModal: React.FC<EditBookProps> = ({
  book,
  handleClose,
  handleRefresh,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Book>({ ...book });

  // Ferme la modal si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "publication_year" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/books/${book.book_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Book updated successfully!");
        handleRefresh(); // Rafraîchir la liste
        handleClose(); // Fermer modal
      } else {
        alert("Failed to update book");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating book");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <span className={styles.close} onClick={handleClose}>
          &times;
        </span>
        <h2>Edit Book</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="author_first_name">Author First Name:</label>
          <input
            type="text"
            id="author_first_name"
            name="author_first_name"
            value={formData.author_first_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="author_last_name">Author Last Name:</label>
          <input
            type="text"
            id="author_last_name"
            name="author_last_name"
            value={formData.author_last_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />

          <label htmlFor="format">Format:</label>
          <input
            type="text"
            id="format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            required
          />

          <label htmlFor="coffee_shop_name">Coffee Shop Name:</label>
          <input
            type="text"
            id="coffee_shop_name"
            name="coffee_shop_name"
            value={formData.coffee_shop_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="coffee_shop_address">Coffee Shop Address:</label>
          <input
            type="text"
            id="coffee_shop_address"
            name="coffee_shop_address"
            value={formData.coffee_shop_address}
            onChange={handleChange}
            required
          />

          <label htmlFor="publication_year">Publication Year:</label>
          <input
            type="number"
            id="publication_year"
            name="publication_year"
            value={formData.publication_year || ""}
            onChange={handleChange}
          />

          <label htmlFor="isbn">ISBN:</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn || ""}
            onChange={handleChange}
          />

          <button type="submit">Update Book</button>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
