import React,{ useState, useEffect, useRef } from 'react'
import "./style.scss"
import axiosInstance from '../../helpers'
import { useAuth } from '../../contexts'

const Comments = ({ room_id }) => {

    const { user, usersUsername, width } = useAuth()
    const [ commentData, setCommentData ] = useState(null)
    const [ newComment, setNewComment ] = useState(null)
    const [replyToComment, setReplyToComment] = useState("")

    const [textArea,setTextArea] = useState("")

    const [addToggle, setAddToggle] = useState(false)

    const [refresh, setRefresh] = useState(0)

    const commentRefs = useRef([])



    async function fetchComments() {
        try {
            const resp = await axiosInstance.get(`/comments/room/${room_id}`)

            const data = await resp.data.data
            setCommentData(data)

        } catch (error) {
            console.log(error, "not working, shit request.");
        }
    }

    function handleInput(e){
        setNewComment(e.target.value)
    }

    function clearInput(){
        setNewComment("")
    }

    async function handleReply(comment){
        setAddToggle(!addToggle)
        
        const replyTo = `@~${comment.username}`
        setReplyToComment(comment.comment)
        setTextArea(replyTo+"...")
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

        try {
            const newComment = await axiosInstance.post("/comments", data, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(resp => {
                console.log("successful post", resp.data.data);
                clearInput()
                setAddToggle(!addToggle)
                setRefresh(prev => prev + 1)
            })


        } catch (error) {
            console.log("submit failed",error);
        }

    }

    async function handleDelete(user_id,index){
        console.log(index);

        const deleteComment = await axiosInstance.delete(`/comments/users/${user_id}/${index}`).then(resp => {
            console.log(index, "deleted succesfully");
            setRefresh(prev => prev + 1)
        })
    }

    useEffect(() => {
        fetchComments()
    },[refresh])


  return (
    <div className='comment-section'>
        {/* {room_id} */}
        
        {
            user && !addToggle? <button id='add-comment-btn' onClick={() => setAddToggle(!addToggle)}>{ !addToggle ? width > 500 ? "Add Comment" : "Comment" : "Cancel" }</button> : ""
        }

        {
            user && addToggle
            ?
            <div className="add-comment">
                <form onSubmit={handleCommentSubmit}>
                    <label htmlFor="content">{usersUsername} <p>{replyToComment}</p> </label>
                    <textarea onChange={handleInput} cols={width > 600 ? 40 : width > 350 ? 30 : 25} placeholder='Add a comment...'>{ textArea }</textarea>
                    
                    <div className="button-div">
                        <button type='reset' onClick={() => {setAddToggle(!addToggle);clearInput()}}>Cancel</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            :
            ""
        }

        <h1>Comments</h1>

        { commentData && commentData.map((comment,index) => (
            <div className="comment" key={index} ref={commentRefs[index]}>
                <div className="post">
                    <div className="info">
                        <h2>{comment.username}</h2>
                        <h3>{
                            new Date(comment.date).toLocaleDateString('en-UK', { day: 'numeric', month: 'numeric', year: 'numeric' })
                            }
                        </h3>
                    </div>
                    
                    <div className="message">
                        <p>{comment.comment}</p>
                        <div className="edit-functions">
                            <p id='reply' onClick={() => handleReply(comment)}>Reply</p>
                            {/* { user == comment.user_id? <p id='Edit'>Edit</p> : "" } */}
                            { user == comment.user_id? <p id='delete' onClick={() => handleDelete(comment.user_id,comment.id)}>Delete</p> : "" }
                        </div>
                    </div>
                </div>
            </div>
        )) }

    </div>
  )
}

export default Comments