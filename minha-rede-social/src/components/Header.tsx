import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';
import styles from '../styles/Home.module.css';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('guestLogin');
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" legacyBehavior>
              <a className={styles.navLink}>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/perfil" legacyBehavior>
              <a className={styles.navLink}>Perfil</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <button onClick={handleLogout} className={styles.navButton}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
