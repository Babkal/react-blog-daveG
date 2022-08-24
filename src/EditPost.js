import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';


const EditPost = ({
    handleEdit, setEditTitle, setEditBody, posts, editTitle, editBody
}) => {

    const {id} = useParams();
    const post = posts.find(post => (post.id).toString() === id );
   
   useEffect(() => {
    if (post) {
        setEditTitle(post.title);
        setEditBody(post.body);
    }
   }, [post, setEditTitle, setEditBody])
   
    return (
         
        <main className="NewPost">
        {post &&
        <>    
        <h2>Edit Post</h2>
            <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="postTitle">Title:</label>
                <input
                    id="postTitle"
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                />
                <label htmlFor="postBody">Post:</label>
                <textarea
                    id="postBody"
                    required
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                />
                <button type="submit" onClick={()=>handleEdit(post.id)}>Submit</button>
            </form>
        
          </> 
}
           {!post &&
            <>
                <h2>Post Not Found</h2>
                <p>Well, that's disappointing.</p>
                <p>
                    <Link to='/'>Visit Our Homepage</Link>
                </p>
            </>
        }    </main>
    )
}

export default EditPost
