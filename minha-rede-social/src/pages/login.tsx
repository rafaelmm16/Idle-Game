import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import styles from '../styles/Login.module.css';

export default function Login() {
    const router = useRouter();
    const [guestLogin, setGuestLogin] = useState(false);

    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleGuestLogin = () => {
        setGuestLogin(true);
        localStorage.setItem('guestLogin', 'true');
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Login</h1>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const email = e.target.email.value;
                    const password = e.target.password.value;
                    handleLogin(email, password);
                }}>
                    <input type="email" name="email" placeholder="Email" required className={styles.input} />
                    <input type="password" name="password" placeholder="Senha" required className={styles.input} />
                    <button type="submit" className={styles.button}>Entrar</button>
                </form>
                <button onClick={handleGuestLogin} className={styles.guestButton}>Entrar como Convidado</button>
            </div>
        </div>
    );
}