import { Map } from '@/modules';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Map.MapView />
    </div>
  );
}
