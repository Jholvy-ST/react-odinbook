import { useEffect, useState, useRef } from "react";

const CreatePost = (props) => {
	const [userData, setUserData] =  useState(undefined)
	const user_storage = JSON.parse(localStorage.getItem('user_data'))

	const formRef = useRef();

	//Loads the data of the user once
	useEffect(() => {
		fetchUser()	
	}, [])

	//Gets the data of the current user from the server
	const fetchUser = async () => {
		const user = JSON.parse(localStorage.getItem('user_data'));
		const payload = { id: user.id }
		const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/users/${user.id}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${user.token}`
			},
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		console.log(data)
		setUserData(data.user)
	}

	//Shows the form to create a post
	const showForm = () => {
		props.selectForm('Edit')
		props.formRef.current.classList.add("show-c")
		//Necessary data to create the post
		props.setFormData({
			title: 'Create post',
			type: 'post',
			action: 'create-post',
			payload: {
				author: user_storage.id,
				content: ''
			}
		})
	}

	if (userData) {
		return (
			<div>
				<form className="post-form">
					<div className="pic-div">
						<img src={userData.pic} alt="profile-pic" className="profile-pic" />
						<textarea name="content" rows="1" className="auto_height" placeholder="What are you thinking?" onClick={showForm} readOnly></textarea>
					</div>
					<div>
						<button className="blue-button post-button" ref={formRef}>Post</button>
					</div>
				</form>
			</div>
			
		)
	}
	
	
}

export default CreatePost