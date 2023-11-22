import React,{ useState, useEffect } from 'react'
import Heart from "react-animated-heart";
import { useAuth } from '../../contexts';
import axiosInstance from '../../helpers';

const LikeButton = ({ imageId  }) => {

    const [ isClick, setClick] = useState(false)
    const { user } = useAuth()

    async function loadLike(){
        if (user){
            try {
                const getLike = await axiosInstance.get(`/likes/user/${user}`)
                const data = await getLike.data.data
                for(let like of data){
                    if (like.room_id == imageId){
                        setClick(true)
                    }
                }
            } catch (error) {
                console.log("not logged in",error);
            }
        }
    }

    async function updateLike(){
        if(user){
            if(isClick){
                try {
                    const deleteLike = await axiosInstance.delete(`/likes/${user}/${imageId}`).then(resp => {setClick(false)})
                } catch (error) {
                    console.log("cannot delete!", error);
                }
            }else{
                try {
                    const postLike = await axiosInstance.post("/likes", { user_id: user, room_id: imageId }).then(resp => {setClick(true)})

                } catch (error) {
                    console.log("cannot post like!", error);
                }
            }
        }
    }

    useEffect(() => {
        loadLike()
    },[])

  return (
    <div className="heart-container" onClick={(e) => { e.stopPropagation(); }}>
        <Heart isClick={isClick} onClick={updateLike} />
    </div>
  )
}

export default LikeButton