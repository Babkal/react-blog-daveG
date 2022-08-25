import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import { Route, Switch, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "./api/posts";
import EditPost from "./EditPost";
import useWindowSize from "./hooks/usWindowSize";
import useAxiosFetch from "./hooks/useAxiosFetch";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const history = useHistory();
  const { width } = useWindowSize();

  const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3001/posts');

  useEffect(()=>{
    setPosts(data)
  }, [data])
  // we don't need the below code since we'll be using a custom hook.
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get("/posts");
  //       setPosts(response.data);
  //     } catch (error) {
  //       if (error.message) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else {
  //         console.log(error.message);
  //       }
  //     }
  //   };
  //   fetchPosts();
  // }, []);
  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post("/posts", newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      history.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const datetime = format(new Date(), "MMMM dd, yyyy pp");
      const updatedPost = { id, title: editTitle, datetime, body: editBody };

      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post))
      );
      setEditTitle("");
      setEditBody("");
      history.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      history.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <Header title="React JS Blog" width={width}/>
      <Nav search={search} setSearch={setSearch} />
      <Switch>
        <Route exact path="/">
          <Home posts={searchResults}
          fetchError={fetchError}
          isLoading={isLoading}
          />
        </Route>
        <Route exact path="/post">
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />
        </Route>
        <Route exact path="/post/:id">
          <PostPage posts={posts} handleDelete={handleDelete} />
        </Route>
        <Route exact path="/post/edit/:id">
          <EditPost
            posts={posts}
            setEditTitle={setEditTitle}
            setEditBody={setEditBody}
            editBody={editBody}
            editTitle={editTitle}
            handleEdit={handleEdit}
          ></EditPost>
        </Route>
        <Route path="/about" component={About} />
        <Route path="*" component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
