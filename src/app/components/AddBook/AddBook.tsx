import React, { useState } from "react";
import styles from "./AddBook.module.css";

type AddBookProps = {
  handleModalAddBook: () => void;
  handleRefresh: () => void;
};

const AddBook: React.FC<AddBookProps> = ({
  handleModalAddBook,
  handleRefresh,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    author_first_name: "",
    author_last_name: "",
    coffee_shop_name: "",
    coffee_shop_address: "",
    publication_year: "",
    isbn: "",
    format: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/books`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Book added successfully!");
        handleRefresh();
        handleModalAddBook();
      } else {
        alert("Failed to add book");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleModalAddBook}>
          &times;
        </span>
        <h2>Add a new book</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={handleChange}
          />

          <label htmlFor="author_first_name">Author First Name:</label>
          <input
            type="text"
            id="author_first_name"
            name="author_first_name"
            required
            onChange={handleChange}
          />

          <label htmlFor="author_last_name">Author Last Name:</label>
          <input
            type="text"
            id="author_last_name"
            name="author_last_name"
            required
            onChange={handleChange}
          />

          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            required
            onChange={handleChange}
          />

          <label htmlFor="format">Format:</label>
          <input
            type="text"
            id="format"
            name="format"
            required
            onChange={handleChange}
          />

          <label htmlFor="coffee_shop_name">Coffee Shop Name:</label>
          <input
            type="text"
            id="coffee_shop_name"
            name="coffee_shop_name"
            required
            onChange={handleChange}
          />

          <label htmlFor="coffee_shop_address">Coffee Shop Address:</label>
          <input
            type="text"
            id="coffee_shop_address"
            name="coffee_shop_address"
            required
            onChange={handleChange}
          />

          <label htmlFor="publication_year">Publication Year:</label>
          <input
            type="number"
            id="publication_year"
            name="publication_year"
            onChange={handleChange}
          />

          <label htmlFor="isbn">ISBN:</label>
          <input type="text" id="isbn" name="isbn" onChange={handleChange} />

          <button type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
