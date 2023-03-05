// PROJECT: Reddit Favoriter
// AUTHOR:  Filipe Brito
// DATE:    2023-03-04
// DESCRIPTION:  This is a simple app that allows you to search for a subreddit and add posts to a favorites list.

import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

export default function App() {
  const [currentPosts, setCurrentPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [inputValue, setInputValue] = useState("all");

  useEffect(() => {
    getPosts();
  }, [currentPosts.length]);

  useEffect(() => {
    getPostsById();
  }, [favorites.length]);

  function handleInputChange(newValue) {
    if (newValue.trim() === "") return;
    setInputValue(newValue.trim());
    console.log(inputValue);
  }

  function getPosts() {
    if (inputValue === "") return;
    fetch("https://www.reddit.com/r/" + inputValue + "/hot.json?limit=10")
      .then((response) => response.json())
      .then((data) =>
        setCurrentPosts(data.data.children.map((child) => child.data))
      );
  }

  function getPostsById() {
    if (favorites.length <= 0) return;
    fetch("https://www.reddit.com/by_id/" + favorites.join(",") + ".json")
      .then((response) => response.json())
      .then((data) =>
        setFavoritePosts(data.data.children.map((child) => child.data))
      );
  }

  function addFavorite(post) {
    const index = favorites.findIndex((favorite) => favorite === post);
    if (index === -1) {
      setFavorites([...favorites, post]);
    }
    //getPostsById();
  }

  function removeFavorite(fav) {
    const index = favorites.findIndex((favorite) => favorite === fav);
    if (index !== -1) {
      setFavorites([
        ...favorites.slice(0, index),
        ...favorites.slice(index + 1),
      ]);
    }
    //getPostsById();
  }

  return (
    <div>
      <Header />
      <SearchBar onInputChange={handleInputChange} fetchPosts={getPosts} />
      <Posts threads={currentPosts} onClick={addFavorite} />
      <Favorites posts={favoritePosts} onClick={removeFavorite} />
    </div>
  );
}

function Header() {
  return (
    <div className="App">
      <header className="App-header">
        <span>
          <h1>Reddit Favoriter</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </span>
      </header>
    </div>
  );
}

function SearchBar(props) {
  function handleInputChange(event) {
    props.onInputChange(event.target.value);
  }
  function handleButtonPress(event) {
    event.preventDefault();
    props.fetchPosts();
  }

  return (
    <div className="App">
      <form>
        {/* <label htmlFor="input">Subreddit: </label> */}
        <input
          className="rounded"
          type="text"
          placeholder="  Subreddit"
          id="input"
          onChange={handleInputChange}
        />
        <button className="App-subreddit rounded" onClick={handleButtonPress}>
          ▶
        </button>
        <br />
        <br />
      </form>
    </div>
  );
}

function Posts(props) {
  function handleButtonPress(post) {
    props.onClick(post);
  }

  return (
    <>
      <div className="App">
        <h2>Posts</h2>
        <div className="App-list">
          <ul>
            {props.threads.map((post) => (
              <li key={post.id}>
                <span>{post.title}</span>
                <button
                  className="Fave"
                  onClick={() => handleButtonPress(post.name)}
                >
                  ★
                </button>
                {/* ☆ */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Favorites(props) {
  function handleButtonPress(post) {
    props.onClick(post);
  }

  return (
    <div className="App">
      <h2>Favorites</h2>
      <div className="App-list">
        <ul>
          {props.posts.map((post) => (
            <li key={post.id}>
              <span>{post.title}</span>
              <button
                className="Unfave"
                onClick={() => handleButtonPress(post.name)}
              >
                ☆
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
