import React, { useState, useEffect } from 'react';
import './App.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import Register from './Register';

const SUBREDDITS = [
    'artificial',
    'MachineLearning',
    'singularity',
    'computervision'
];

function NewsFeed({ onLogout }) {
    const [posts, setPosts] = useState([]);

    const fetchAllPosts = async () => {
        const allPosts = [];

        for (const subreddit of SUBREDDITS) {
            try {
                const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=5&t=day`);
                const data = await response.json();

                const subredditPosts = data.data.children.map(post => ({
                    title: post.data.title,
                    url: `https://reddit.com${post.data.permalink}`,
                    score: post.data.score,
                    subreddit,
                    thumbnail: post.data.thumbnail && post.data.thumbnail.startsWith('http') ? post.data.thumbnail : '',
                    description: post.data.selftext.substring(0, 200),
                }));

                allPosts.push(...subredditPosts);
            } catch (error) {
                console.error(`Failed to fetch posts from r/${subreddit}:`, error);
            }
        }

        allPosts.sort((a, b) => b.score - a.score);
        setPosts(allPosts);
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    return (
        <div className="app-container">
            <div className="header-bar">
                <h1 className="main-title">🤖 Daily AI News Trends</h1>
                <button className="logout-button" onClick={onLogout}>Logout</button>
            </div>
            <p className="subtitle">Curated from top AI-related subreddits</p>

            <ul className="posts-list">
                {posts.map((post, index) => (
                    <li key={index} className="post-card">
                        <h3 className="post-title">
                            {post.title} <span className="score">⬆ {post.score}</span>
                        </h3>
                        <p className="source-tag">From r/{post.subreddit}</p>
                        {post.thumbnail && <img src={post.thumbnail} alt="thumbnail" className="thumbnail" />}
                        {post.description && <p className="description">{post.description}...</p>}
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="post-link">
                            View Post 🔗
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('login');

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsub();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        setPage('login');
    };

    if (!user) {
        return (
            <div className="auth-wrapper">
                {page === 'register'
                    ? <div className="auth-form">
                        <h2>Create an Account</h2>
                        <Register onRegisterSuccess={() => setPage('login')} />
                        <p>Already have an account? <span onClick={() => setPage('login')} className="auth-link">Login</span></p>
                    </div>
                    : <div className="auth-form">
                        <h2>Welcome Back</h2>
                        <Login onLoginSuccess={() => setPage('news')} goToRegister={() => setPage('register')} />
                    </div>
                }
            </div>
        );
    }

    return <NewsFeed onLogout={handleLogout} />;
}

export default App;
