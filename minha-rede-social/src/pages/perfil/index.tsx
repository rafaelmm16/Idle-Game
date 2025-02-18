import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../../components/Header';
import styles from '../../styles/Profile.module.css';

export default function Perfil() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  if (!user) return <div>Carregando...</div>;

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.profileTitle}>{user.displayName}</h1>
      <p className={styles.profileBio}>{user.bio}</p>
    </div>
  );
}
