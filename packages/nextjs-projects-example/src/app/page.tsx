"use client";
import styles from "./page.module.css";
import { HeaderBar } from "./components/header-bar/header-bar";
import MainPage from "./components/main-page/main-page";

export default function Home() {
  return (
    <div className={styles.page}>
      <HeaderBar />
      <MainPage />
    </div>
  );
}
