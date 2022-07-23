import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const SinglePost = (props) => {

	const [post, setPost] = useState(props.post)
	const [comments, setComments] = useState(props.post.comments)
	const [user_storage, setUserStorage] = useState(JSON.parse(localStorage.getItem('user_data')))
	const [isFetching, setFetching] = useState(false)
	
	const formRef = useRef();
	const optionsRef = useRef();
	const commentsRef = useRef();
	const contentRef = useRef();

	//Adds event listener for the hideOptions function
	useEffect(() => {
		const drop = document.getElementById("root");
		drop.addEventListener('click', hideOptions)	
		
		return () => {
			drop.removeEventListener('click', hideOptions)
		} 
	}, [])

	//Reloads the content when there is a change in the post
	useEffect(() => {
		setPost(props.post)
	}, [props.post])

	//Sumbits a comment when Enter is pressed
	const enterComment = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			document.getElementById("commentPost").click();
		}
	}

	//Sumbits a comment
	const commentPost = async (e) => {

		//if (e.key === 'Enter') {
			e.preventDefault();
			console.log(e.target.content.value)
			setFetching(true)
			const content = e.target.content.value;
			const payload = { post: props.post._id, content: content, author: user_storage.id }
			const response = await fetch('https://agile-springs-89726.herokuapp.com/home/comment-post', { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify(payload)
			});

			const postData = await response.json();
			//post.comments.push(postData.comment)
			/*const newPost = post
			console.log(newPost)
			setPost(newPost)*/
			setFetching(false)
			const responseComment = postData.comment
			responseComment.author = postData.author
			comments.push(responseComment)
			e.target.content.value = ''
			//const newComments = comments
			//setComments(newComments)
			setPost(prevState => ({
				...prevState,
				comments: comments
		 	}));
		//}
	}

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

	//Changes the height of the textarea depending on the content
	const autoHeight = (elem) => {
		if (elem) {
			elem.target.style.height = "1px";
			elem.target.style.height = (elem.target.scrollHeight)+"px";
		}
	}

	const countLikes = (post) => {
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

	const countComments = (post) => {
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

	//Renders the comments if there is any
	const returnComments = (post) => {
		if (post.comments.length > 0) {
			return (
				<div className='comments' ref={commentsRef}>
					{post.comments.map(comment => 
						<div key={comment._id} className='single-comment'>
							<h4>{comment.author.name}</h4>
							<p>{comment.content}</p>
						</div>	
					)}
				</div>
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
	const enableEdit = (id) => {
		if (user_storage.id === id) {
			return (
				<div className='round-div'>
					<button type="button" className="edit-button" onClick={showOptions}>&#9998;</button>
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

	const showEditForm = () => {
		console.log(props.post.content)
		props.selectForm('Edit')
		props.formRef.current.classList.add("show-c")
		optionsRef.current.classList.remove("show-c")
		document.body.classList.add("not-scrollable");
		props.setFormData(
			{
				title: 'Edit',
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
		props.selectForm('Delete')
		props.formRef.current.classList.add("show-c")
		optionsRef.current.classList.remove("show-c")
		document.body.classList.add("not-scrollable");
		props.setFormData(
			{
				title: 'Delete',
				action: 'delete-post',
				payload: {
					id: props.post._id,
				}
			}
		)
	}

	//Shows the edit options
	const showOptions = () => {
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

	//Hides the edit options when the user clicks elsewhere
	const hideOptions = (e) => {
		if (!e.target.matches('.edit-button')) {
			//const myDropdown = document.getElementsByClassName("post-options")[0];
			const items = Array.from(document.getElementsByClassName("post-options"))
			for (let i = 0; i < items.length; i++) {
				if (items[i].classList.contains("show-c")) {
					items[i].classList.remove("show-c")
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
						<img src={post.author.pic} alt="profile-pic" />
						<Link to={`user/${post.author._id}`}>	
							<h4>{post.author.name}</h4>
						</Link>
					</div>
					{enableEdit(post.author._id)}
				</div>
				<div className='post-content' ref={contentRef}>				
					{post.content}
				</div>
				{renderImage(post.image)}
				{countLikes(post)}
				{countComments(post)}
				<div className='like' onClick={likePost}>
					<h4>Like</h4>
				</div>
				<div className='comment' onClick={showCommentForm}>
					<h4>Comment</h4>
				</div>
				<div className='comment-form' ref={formRef}>
					<form onSubmit={commentPost}>
						<div className='pic-div'>
							<img src={post.author.pic} className='profile-pic' alt="profile-pic" />
							<textarea name='content' rows="1" className="auto_height" placeholder='Write a comment...' onInput={autoHeight} onKeyDown={enterComment} required></textarea>
						</div>
						<div className='full-height'>
							<button type='submit' id='commentPost' className='blue-button' disabled={isFetching}>Submit</button>
						</div>
					</form>
				</div>
				{returnComments(post)}
			</div>
		)
	}

	
}

export default SinglePost