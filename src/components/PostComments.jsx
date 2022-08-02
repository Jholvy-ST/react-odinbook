import { useState, useRef } from 'react';

const PostComments = (props) => {
	const commentOptionsRef = useRef([]);
	
	const enableCommentEdit = (comment, index) => {
		if (props.user_storage.id === comment.author._id) {
			return (
				<div className='round-div'>
					<button type="button" className="edit-button" id={comment._id + 'id=' +index} onClick={showEditOptionsC}>&#9998;</button>
					<div className='comment-options' ref={el => commentOptionsRef.current[index] = el}>
						<div onClick={() => showCommentEditForm(comment)}>
							<p>Edit</p>
						</div>
						<div onClick={() => showCommentEditForm(comment)}>
							<p>Delete</p>
						</div>
					</div>
				</div>
			)
		}
	}
	
	//Shows the comment edit options
	const showEditOptionsC = (e) => {
		const items = Array.from(document.getElementsByClassName("comment-options"))

		const symbol = e.target.id.indexOf('=')
		const index = e.target.id.slice(symbol+1)
		
		if (commentOptionsRef.current[index].classList.contains("show-c")) {
			commentOptionsRef.current[index].classList.remove("show-c")
		} else {
			for (let i = 0; i < items.length; i++) {
				if (items[i].classList.contains("show-c")) {
					items[i].classList.remove("show-c")
				}
			}
			commentOptionsRef.current[index].classList.add("show-c")
		}
	}

	const showCommentEditForm = (comment) => {
		props.showForm('Edit')
		props.setFormData(
			{
				title: 'Edit',
				action: 'edit-comment',
				payload: {
					id: comment._id,
					content: comment.content
				}
			}
		)
	}
	
	if (props.post.comments.length > 0) {
		return (
			<div className='comments' ref={props.commentsRef}>
				{props.post.comments.map((comment, i) => 
					<div className='single-comment' key={comment._id}>
						<div>
							<img src={comment.author.pic} alt="profile-pic" className='profile-pic'/>
						</div>
						<div className='comment-text'>
							<h4>{comment.author.name}</h4>
							<p>{comment.content}</p>
						</div>	
						{enableCommentEdit(comment, i)}
					</div>
				)}
			</div>
		)
	}
}

export default PostComments