import { Home } from "@/modules";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Home.HomeView />
    </div>
  );
}
