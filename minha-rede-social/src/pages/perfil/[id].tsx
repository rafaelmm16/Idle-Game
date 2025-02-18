import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { firestore } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../../components/Header';

export default function Perfil() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                const userDoc = await getDoc(doc(firestore, 'users', id));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }
            };
            fetchUser();
        }
    }, [id]);

    if (!user) return <div>Carregando...</div>;

    return (
        <div>
            <Header />
            <h1>{user.displayName}</h1>
            <p>{user.bio}</p>
        </div>
    );
}