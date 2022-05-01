import React,{useState,useEffect} from 'react'
import { Link } from "react-router-dom";
import './styles.css';

import { connect } from 'react-redux';

import {handleLike,addComment, getLikesAndComments,postType,userDataType } from "../../utilities/utils";
interface Props {
  postInfo: postType;
  userData:userDataType
  handlePostModal: (post:postType) => void;
  postModalInfo:any;
}


const Post: React.FC<Props> = ({ postInfo, userData,handlePostModal,postModalInfo }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [post, setPost] = useState<any>();
  const [commentText,setCommentText] = useState<string>('');

  const like = () => {
    if(userData) {
      (async function(){
        const res = await handleLike(post,isLiked,userData.username,setIsLiked)
        setPost(res)
      }())
    }
  }

	const handleComment = async (e:any,postId:string,commentText:string,userData:any) => {
    if(userData){
      e.preventDefault()
      await addComment(postId,commentText,userData).then((res) => {
        let comments = [...post.comments,res]
        const newPost = {...post,comments}
        setPost(newPost)
      })
      setCommentText('')
    }
	}

  useEffect(() => {
    if(userData){
      getLikesAndComments(postInfo).then((res) => {
        const condition = res.likes.includes(userData.username)
        condition ? setIsLiked(true) : setIsLiked(false)
        setPost(res)
      })
    }
  }, [userData,postModalInfo]);

  return (
    <React.Fragment>
      {post ? (
        <div className="post" key={post.id}>
          <div className="post-header">
            <img src={post.userPhoto} alt="" />
            <Link className="link" to={`/profile/${post.username}`} ><p>{post.username}</p></Link>
          </div>
          <img className="post-img" src={post.photo} alt="" />
          <div className="post-footer">
            <div className="buttons">
              {isLiked ? (
                <i onClick={like} className="fas fa-heart"></i>
              ) : (
                <i onClick={like} className="far fa-heart"></i>
              )}
              <i className="far fa-comment"></i>
            </div>
            <p>
              <strong>{post.likes.length} likes</strong>
            </p>
            <p>
              <strong>{post.username}</strong> {post.caption.length < 45 ? post.caption : `${post.caption.substr(0,42)}...`}
            </p>
            {post.comments.length ? (
              <div>
                {post.comments.length >=2 && (<p style={{cursor:"pointer"}} onClick={() => handlePostModal(post)} >View all {post.comments.length} comments</p>)
								}
                <p>
                  <strong>
                    {post.comments[0].username}
                  </strong> {" "}
                  {post.comments[0].text.length < 35 ? post.comments[0].text : `${post.comments[0].text.substr(0,32)}...`}
                </p>
              </div>
            ) : (
              <div></div>
            )}
            <div className="add-comment">
              <form onSubmit={(e) => handleComment(e,post.id,commentText,userData)} >
                <textarea
                  name="comment"
                  placeholder="Add a comment..."
									value={commentText}
									onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <button type="submit" >Post</button>
              </form>
            </div>
          </div>
        </div>
      ):(<> </>)}
    </React.Fragment>
  );
};

const mapStateToProps = (state:any) => ({
  postModalInfo:state.postModalInfo,
  userData:state.userData
})

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(mapStateToProps,mapDispatchToProps)(Post);
