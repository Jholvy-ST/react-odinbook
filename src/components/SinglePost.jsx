import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import PostComments from './PostComments';

const SinglePost = (props) => {

	const [post, setPost] = useState(props.post)
	const [comments, setComments] = useState(props.post.comments) 
	const user_storage = JSON.parse(localStorage.getItem('user_data'))
	
	const formRef = useRef();
	const optionsRef = useRef();
	//const commentOptionsRef = useRef([]);
	const commentsRef = useRef();
	const contentRef = useRef();

	//Adds event listener for the hideOptions function
	useEffect(() => {
		const main = document.getElementById("root");
		main.addEventListener('click', hideEditOptions)	
		
		return () => {
			main.removeEventListener('click', hideEditOptions)
		} 
	}, [])

	//Reloads the content when there is a change in the post
	useEffect(() => {
		setPost(props.post)
	}, [props.post])

	//Adds a like from the current user to the post
	const likePost = async () => {
		const user = JSON.parse(localStorage.getItem('user_data'));
		const payload = { post_id: props.post._id, user_id: user.id }
			const response = await fetch('https://agile-springs-89726.herokuapp.com/home/like-post', { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify(payload)
			});

			const likesData = await response.json()

			//likes.push(user.id)
			setPost(prevState => ({
				...prevState,
				likes: likesData.likes
		 	}));
	}

	const showCommentForm = () => {
		formRef.current.classList.toggle("show")
	}

	const showComments = () => {
		commentsRef.current.classList.toggle("show-c")
	}	

	const renderLikesCount = (post) => {
		if (post.likes.length > 0) {
			if (post.likes.length > 1) {
				return (
					<div className='c-likes'>
						<p>{post.likes.length} likes</p>
					</div>
				)
			}
			return (
				<div className='c-likes'>
					<p>{post.likes.length} like</p>
				</div>
			)
		} else if (post.comments.length > 0) {
			return (
				<div className='c-likes'></div>
			)
		}
	}

	const renderCommentsCount = (post) => {
		if (post.comments.length > 0) {
			if (post.comments.length > 1) {
				return (
					<div className='c-comments' onClick={showComments}>
						<p>{post.comments.length} comments</p>
					</div>
				)
			}
			return (
				<div className='c-comments'onClick={showComments}>
					<p>{post.comments.length} comment</p>
				</div>
			)
		} else if (post.likes.length > 0) {
			return (
				<div className='c-comments'></div>
			)
		}
	}

	//Renders the image if there is any
	const renderImage = (image) => {
		if (image) {
			if (contentRef.current) {
				contentRef.current.style.borderBottom = 'none';
			}
			return (
				<div className='post-image'>
					<img src={image} alt='post-image' />
				</div>
			)
		}
	}

	//Enables the edition of the post if the current user is the author
	const enablePostEdit = (id) => {
		if (user_storage.id === id) {
			return (
				<div className='round-div'>
					<button type="button" className="edit-button" onClick={showEditOptions}>&#9998;</button>
					<div className='post-options' id='options' ref={optionsRef}>
						<div onClick={showEditForm}>
							<p>Edit</p>
						</div>
						<div onClick={showDeleteForm}>
							<p>Delete</p>
						</div>
					</div>
				</div>
			)
		}
	}

	const showForm = (form) => {
		props.selectForm(form)
		props.formRef.current.classList.add("show-c")
		optionsRef.current.classList.remove("show-c")
		document.body.classList.add("not-scrollable")
	}

	const showEditForm = () => {
		showForm('Edit')
		props.setFormData(
			{
				title: 'Edit post',
				type: 'post',
				action: 'edit-post',
				payload: {
					id: props.post._id,
					content: props.post.content,
					image: props.post.image
				}
			}
		)
	}

	const showDeleteForm = () => {
		showForm('Delete')
		props.setFormData(
			{
				message: 'delete this post',
				action: 'delete-post',
				payload: {
					id: props.post._id,
				}
			}
		)
	}

	//Shows the post edit options
	const showEditOptions = () => {
		const items = Array.from(document.getElementsByClassName("post-options"))
		
		if (optionsRef.current.classList.contains("show-c")) {
			optionsRef.current.classList.remove("show-c")
		} else {
			for (let i = 0; i < items.length; i++) {
				if (items[i].classList.contains("show-c")) {
					items[i].classList.remove("show-c")
				}
			}
			optionsRef.current.classList.add("show-c")
		}
	}

	//Hides the post edit options when the user clicks elsewhere
	const hideEditOptions = (e) => {
		if (!e.target.matches('.edit-button')) {
			//const myDropdown = document.getElementsByClassName("post-options")[0];
			const postOptions = Array.from(document.getElementsByClassName("post-options"))
			for (let i = 0; i < postOptions.length; i++) {
				if (postOptions[i].classList.contains("show-c")) {
					postOptions[i].classList.remove("show-c")
				}
			}

			const commentOptions = Array.from(document.getElementsByClassName("comment-options"))
			for (let i = 0; i < commentOptions.length; i++) {
				if (commentOptions[i].classList.contains("show-c")) {
					commentOptions[i].classList.remove("show-c")
				}
			}
		}
	}

	//Renders the content if there is a post
	if (post) {
		return (
			<div key={post._id + post.author.id} className='post'>
				<div className='post-header'>
					<div className='post-author'>
						<img src={post.author.pic} alt="profile-pic"/>
						<Link to={`user/${post.author._id}`}>	
							<h4>{post.author.name}</h4>
						</Link>
					</div>
					{enablePostEdit(post.author._id)}
				</div>
				<div className='post-content' ref={contentRef}>				
					{post.content}
				</div>
				{renderImage(post.image)}
				{renderLikesCount(post)}
				{renderCommentsCount(post)}
				<div className='like' onClick={likePost}>
					<h4>Like</h4>
				</div>
				<div className='comment' onClick={showCommentForm}>
					<h4>Comment</h4>
				</div>
				<CommentForm comments={comments} setComments={setComments} formRef={formRef} post={post} setPost={setPost} token={props.token} user_storage={user_storage}/>
				<PostComments post={post} user_storage={user_storage} commentsRef={commentsRef} showForm={showForm} setFormData={props.setFormData}/>
			</div>
		)
	}

	
}

export default SinglePost