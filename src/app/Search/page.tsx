import React from "react";
import WhiteBoard from "../components/WhiteBoard/WhiteBoard";
import styles from "./page.module.css";

const page = () => {
  return (
    <div className={styles.main}>
      <WhiteBoard />
    </div>
  );
};

export default page;
