import { useState } from 'react';
import { firestore, auth } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CreatePost() {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!auth.currentUser) {
            console.error('Usuário não autenticado');
            return;
        }

        const post = {
            content,
            createdAt: new Date(),
            author: auth.currentUser.uid,
        };

        await addDoc(collection(firestore, 'posts'), post);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="O que você está pensando?"
                required
            />
            <button type="submit">Postar</button>
        </form>
    );
}