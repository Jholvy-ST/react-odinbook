import { useEffect } from 'react';
import { useState, useRef } from 'react';

const CommentForm = (props) => {
	const [isFetching, setFetching] = useState(false)
	//const [content, setContent] = useState('')

	const submitRef = useRef();

	/*const contentHandler = (e) => {
		setContent(e.target.value)
	}*/
	
	//Sumbits a comment
	const commentPost = async (e) => {
		e.preventDefault();
		console.log(e.target.content.value)
		setFetching(true)
		//const content = e.target.content.value;
		const payload = { post: props.post._id, content: e.target.content.value, author: props.user_storage.id }
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
		setFetching(false)
		const responseComment = postData.comment
		responseComment.author = postData.author
		e.target.content.value = ''
		const newCommentsList = props.comments
		newCommentsList.push(responseComment)
		props.setComments(newCommentsList)
		props.setPost(prevState => ({
			...prevState,
			comments: props.comments
		}));
	}

	//Sumbits a comment when Enter is pressed
	const enterComment = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			submitRef.current.click();
		}
	}

	//Changes the height of the textarea depending on the content
	const adjustHeight = (e) => {
		if (e) {
			e.target.style.height = "1px";
			e.target.style.height = (e.target.scrollHeight)+"px";

			if (e.target.value.replace(/\s/g, '').length) {
				submitRef.current.classList.add("show-c")
			} else {
				submitRef.current.classList.remove("show-c")
			}
		}
	}

	return (
		<div className='comment-form' ref={props.formRef}>
			<form onSubmit={commentPost}>
				<div className='pic-div'>
					<img src={props.post.author.pic} className='profile-pic' alt="profile-pic" />
					<textarea name='content' rows="1" className="auto_height" placeholder='Write a comment...' onInput={adjustHeight} onKeyDown={enterComment}></textarea>
				</div>
				<div className='full-height'>
					<button type='submit' id='submitPost' className='blue-button post-button' disabled={isFetching} ref={submitRef}>Submit</button>
				</div>
			</form>
		</div>
	)
}

export default CommentForm