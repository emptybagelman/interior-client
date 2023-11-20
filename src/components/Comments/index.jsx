import React,{ useState, useEffect, useRef } from 'react'
import "./style.scss"
import axiosInstance from '../../helpers'
import { useAuth } from '../../contexts'

const Comments = ({ room_id }) => {

    const { user,usersUsername } = useAuth()
    const [ commentData, setCommentData ] = useState(null)
    const [ newComment, setNewComment ] = useState(null)

    async function fetchComments() {
        console.log(room_id);
        try {
            const resp = await axiosInstance.get(`/comments/room/${room_id}`)

            const data = await resp.data.data
            console.log(data);
            setCommentData(data)

        } catch (error) {
            console.log(error, "not working, shit request.");
        }
    }

    function handleInput(e){
        setNewComment(e.target.value)
    }

    async function handleCommentSubmit(e){
        e.preventDefault()

        const data = {
            "comment":newComment,
            "initial_comment":true,
            "username":usersUsername,
            "user_id":user,
            "room_id":room_id,
            "parent_id":null,
            "root_id":null,
        }

        console.log(data);

        try {
            const newComment = await axiosInstance.post("/comments", data, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(resp => {
                console.log("successful post", resp.data.data);
            })


        } catch (error) {
            console.log("submit failed",error);
        }

    }

    useEffect(() => {
        fetchComments()
    },[])

  return (
    <div className='comment-section'>
        {/* {room_id} */}
        <h1>Comments</h1>

        {
            user
            ?
            <div className="add-comment">
                <form onSubmit={handleCommentSubmit}>
                    <label htmlFor="content">Add a comment:</label>
                    <input type="text" onChange={handleInput}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
            :
            ""
        }


        {/* remember to wrap this in a map function for comments */}

        { commentData && commentData.map((comment,index) => (
            <div className="comment">
                <div className="post">
                    <div className="info">
                        <h2>{comment.username}</h2>
                        <h3>{
                            new Date(comment.date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })
                            }
                        </h3>
                    </div>
                    
                    <div className="message">
                        <p>{comment.comment}</p>
                        <div className="edit-functions">
                            <p id='reply'>Reply</p>
                            { user == comment.user_id? <p id='Edit'>Edit</p> : "" }
                            { user == comment.user_id? <p id='delete'>Delete</p> : "" }
                        </div>
                    </div>
                </div>
            </div>
        )) }

    </div>
  )
}

export default Comments