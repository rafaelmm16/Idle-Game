import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <Header />
            <h1>Minha Rede Social</h1>
            <CreatePost />
            <PostList />
        </div>
    );
}