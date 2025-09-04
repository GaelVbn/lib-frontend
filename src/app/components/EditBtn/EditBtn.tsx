"use client";
import React, { useRef, useEffect } from "react";
import styles from "./EditBtn.module.css";
import { backendUrl } from "../../../../backendUrl";

type EditBtnProps = {
  handleModalEditBtn: () => void;
  bookId: number; // typage correct
  handleRefresh: () => void;
  onPreview: () => void;
  handleEditBook: () => void;
};

const EditBtn: React.FC<EditBtnProps> = ({
  handleModalEditBtn,
  bookId,
  handleRefresh,
  onPreview,
  handleEditBook,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleModalEditBtn(); // ferme la modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleModalEditBtn]);

  const handleDelete = async (bookId: number) => {
    try {
      const response = await fetch(`${backendUrl}/books/${bookId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Book deleted successfully");
        handleRefresh();
        handleModalEditBtn();
        // Tu pourrais appeler un refresh de ta liste ici
      } else {
        console.error("Failed to delete the book");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.dropdown} ref={modalRef}>
      <button className={styles.optionBtn} onClick={onPreview}>
        Preview
      </button>
      <button className={styles.optionBtn} onClick={handleEditBook}>
        Edit
      </button>
      <button
        className={styles.deleteBtn}
        onClick={() => handleDelete(bookId)} // bien passé en callback
      >
        Delete
      </button>
    </div>
  );
};

export default EditBtn;
