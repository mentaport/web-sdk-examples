
import styles from "./page.module.css";
import { HeaderBar } from "@/components/header-bar/header-bar";
import { TabsSection } from "@/components/tabs-section/tabs-section";

export default function Home() {

  return (
    <div className={styles.page}>
      <HeaderBar />
      <main className={styles.main}>
        <TabsSection />
      </main>
      <footer className={styles.footer}>
        <p>© 2024 Mentaport Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
