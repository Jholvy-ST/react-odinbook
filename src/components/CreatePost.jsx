import { useEffect, useState, useRef } from "react";

const CreatePost = (props) => {
	const [user_storage, setUserStorage] = useState(JSON.parse(localStorage.getItem('user_data')))

	const formRef = useRef();

	//Shows the form to create a post
	const showForm = () => {
		props.selectForm('Edit')
		props.formRef.current.classList.add("show-c")
		//Necessary data to create the post
		props.setFormData({
			title: 'Create',
			action: 'create-post',
			payload: {
				author: user_storage.id,
				content: ''
			}
		})
	}

	return (
		<div>
			<form className="post-form">
				<div className="pic-div">
					<img src={user_storage.pic} alt="profile-pic" className="profile-pic" />
					<textarea name="content" rows="1" className="auto_height" placeholder="What are you thinking?" onClick={showForm} readOnly></textarea>
				</div>
				<div>
					<button className="blue-button post-button" ref={formRef}>Post</button>
				</div>
			</form>
		</div>
		
	)
}

export default CreatePost