import { useEffect, useState } from 'react';
import { firestore } from '../../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export default function PostList() {
    interface Post {
        id: string;
        content: string;
        author: string;
        createdAt: Date;
    }

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => {
                const data = doc.data() as Omit<Post, 'id'>;
                return { id: doc.id, ...data };
            });
            setPosts(posts);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <p>{post.content}</p>
                    <small>Postado por: {post.author}</small>
                </div>
            ))}
        </div>
    );
}