import { useState, useRef, useEffect } from "react";
import cloudinaryUpload from "../services/uploads";

const PostForm = (props) => {
	const [user_storage, setUserStorage] = useState(JSON.parse(localStorage.getItem('user_data')))
	const [isFetching, setFetching] = useState(false)//Controls the form button

	const submitRef = useRef();
	const textRef = useRef();
	const imgRef = useRef();
	const buttonRef = useRef();

	//Focuses the input of the form when this is opened
	useEffect(() => {
		if (textRef.current) {
			textRef.current.focus()
			textRef.current.value = props.formData.payload.content
			if (props.formData.payload.image) {
				imgRef.current.style.display = 'block'
				imgRef.current.src = props.formData.payload.image
				buttonRef.current.style.display = 'block'
			}
			console.log(props.formData.payload.content)
		}
	}, [props.formData])

	//Shows the image selected
	const selectImage = () => {
		const image = document.getElementById("input-image").files[0];
		const display = document.getElementById("display");
		display.style.display = 'none'
		display.src = ''
		if (image) {
			display.style.display = 'block'
			display.src = URL.createObjectURL(image)
			submitRef.current.classList.add("show-c")
			buttonRef.current.style.display = 'block'
		}
	}

	//Adds listener for the selectImage function
	useEffect(() => {
		const input = document.getElementById("input-image");
		input.addEventListener('change', selectImage)	
		
		return () => {
			input.removeEventListener('change', selectImage)
		} 
	}, [])

	//Sends the data to create or edit a post
	const submitForm = async (e) => {
		try {
			e.preventDefault();
			setFetching(true)
			const user = JSON.parse(localStorage.getItem('user_data'));
			const display = document.getElementById("display");
			const payload = props.formData.payload
			if (e.target.image.files[0]) {
				const uploadData = new FormData();
				uploadData.append('file', e.target.image.files[0], 'file');
				await cloudinaryUpload(uploadData).then((response) => payload.image = response.secure_url)
			}

			if (!display.getAttribute('src')) {
				console.log('Imaged erased')
				delete payload['image']
				console.log(payload)
			}
			payload.content = e.target.content.value
			
			const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/${props.formData.action}`, { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${user.token}`
				},
				body: JSON.stringify(payload)
			});
			
			//const post = await response.json()
			//e.target.content.value = ''
			if (display) {
				submitRef.current.classList.remove("show-c")
				display.src = ''
				display.style.display = 'none'
				buttonRef.current.style.display = 'none'
			}
			setFetching(false)
			props.formRef.current.classList.remove("show-c")
			document.body.classList.remove("not-scrollable");
			document.getElementsByClassName("post-form-hidden")[0].reset();
			props.getPosts()
		} catch (error) {
			console.log(error)
		}
	}

	const deletePost = async (e) => {
		try {
			e.preventDefault();
			const user = JSON.parse(localStorage.getItem('user_data'));
			const payload = { id: props.formData.payload.id }
			const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/delete-post`, { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${user.token}`
				},
				body: JSON.stringify(payload)
			});

			const post = await response.json()
			props.formRef.current.classList.remove("show-c")
			document.body.classList.remove("not-scrollable");
			document.getElementsByClassName("post-form-hidden")[0].reset();
			props.getPosts()
		} catch (error) {
			console.log(error)
		}
	}

	const changePicture = async (e) => {
		try {
			e.preventDefault();
			const user = JSON.parse(localStorage.getItem('user_data'));
			//const payload = { content: e.target.content.value, author: user.id }
			const payload = props.formData.payload
			if (e.target.image.files[0]) {
				const uploadData = new FormData();
				uploadData.append('file', e.target.image.files[0], 'file');
				await cloudinaryUpload(uploadData).then((response) => payload.pic = response.secure_url)
			}
			const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/change-profile-picture`, { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${user.token}`
				},
				body: JSON.stringify(payload)
			});
			
			//const data = await response.json()
			submitRef.current.classList.remove("show-c")
			props.formRef.current.classList.remove("show-c")
			const display = document.getElementById("display");
			display.src = ''
			display.style.display = 'none'
			document.body.classList.remove("not-scrollable");
			buttonRef.current.style.display = 'none'
			document.getElementsByClassName("post-form-hidden")[0].reset();
			props.getPosts()
		} catch (error) {
			console.log(error)
		}
	}

	const removeImage = () => {
		const display = document.getElementById("display");
		display.src = ''
		display.style.display = 'none'
		buttonRef.current.style.display = 'none'
		submitRef.current.classList.add("show-c")
	}

	/*const handleFileUpload = (e) => {
    const uploadData = new FormData();
		console.log(e.target.files[0])
    uploadData.append('file', e.target.files[0], 'file');
		console.log(uploadData)
    cloudinaryUpload(uploadData).then((response) => console.log(response.secure_url))
  }*/

	const adjustHeight = (e) => {
		if (e) {
			e.target.style.height = "1px";
			e.target.style.height = (e.target.scrollHeight)+"px";

			//if (e.target.value !== '') {
			if (e.target.value.replace(/\s/g, '').length) {
				submitRef.current.classList.add("show-c")
			} else {
				submitRef.current.classList.remove("show-c")
			}
		}
	}

	//Controls what content will be shown in the form
	const renderForm = () => {
		if (props.form === 'Edit') {
			return (
				<form className="post-form-hidden" onSubmit={submitForm}>
					<div>
						<button type="button" className="close-button" onClick={closeForm}>&#88;</button>
					</div>
					<div>
						<h3>{props.formData.title} post</h3>
					</div>
					<div className="pic-div">
						<img src={user_storage.pic} alt="profile-pic" className="profile-pic" />
						<textarea name="content" rows="1" className="auto_height" placeholder="What are you thinking?" onInput={adjustHeight} ref={textRef} required></textarea>
					</div>
					<div className="form-image">
						<label htmlFor="input-image" className='custom-file-upload'>
							<h4>Add image:</h4>
							<i className="fa fa-2x fa-camera"></i>
						</label>
						<input type="file" id="input-image" name="image" accept="image/png, image/jpg, image/jpeg" onChange={(e) => selectImage(e)}/>
						<div className="img-div">
							<button type="button" className="remove-image" ref={buttonRef} onClick={removeImage}>&#88;</button>
							<img id="display" src="#" alt="img-display" ref={imgRef}/>
						</div>
						
					</div>
					<div>
						<button className="blue-button post-button" ref={submitRef} disabled={isFetching}>{props.formData.title}</button>
					</div>
			  </form>
			)
		} else if (props.form === 'Picture') {
			return (
				<form className="post-form-hidden" onSubmit={changePicture}>
					<div>
						<button type="button" className="close-button" onClick={closeForm}>&#88;</button>
					</div>
					<div>
						<h3>{props.formData.title}</h3>
					</div>
					<div className="form-image">
						<label htmlFor="input-image" className='custom-file-upload'>
							<h4>Add image:</h4>
							<i className="fa fa-2x fa-camera"></i>
						</label>
						<input type="file" id="input-image" name="image" accept="image/png, image/jpg, image/jpeg" onChange={(e) => selectImage(e)}/>
						<div className="img-div">
							<button type="button" className="remove-image" ref={buttonRef} onClick={removeImage}>&#88;</button>
							<img id="display" src="#" alt="img-display" className="round-container" ref={imgRef}/>
						</div>
					</div>
					<div>
						<button className="blue-button post-button" ref={submitRef}>Save</button>
					</div>
			  </form>
			)
		}

		return (
			<form className="post-form-hidden" onSubmit={deletePost}>
				<div>
					<h3>Do you want to delete this post?</h3>
				</div>
				<div className='request-buttons'>
					<button className="blue-button">Delete</button>
					<button type="button" className="grey-button" onClick={closeForm}>Cancel</button>
				</div>
			</form>
		)
	}

	const closeForm = () => {
		props.formRef.current.classList.remove("show-c")
		if (submitRef.current) {
			submitRef.current.classList.remove("show-c")
		}
		const display = document.getElementById("display");
		if (display) {
			display.src = ''
			display.style.display = 'none'
			buttonRef.current.classList.remove("show-c")
		}
		document.getElementsByClassName("post-form-hidden")[0].reset();
		document.body.classList.remove("not-scrollable");
	}
	
	return (
		<div className="hidden-form" ref={props.formRef}>
			{renderForm()}
		</div>
	)
}

export default PostForm