import { useState, useRef, useEffect } from "react";
import cloudinaryUpload from "../services/uploads";

const PostForm = (props) => {
	const user_storage = JSON.parse(localStorage.getItem('user_data'))
	const [isFetching, setFetching] = useState(false)//Controls the form button

	const imageFormRef = useRef();
	const submitRef = useRef();
	const textRef = useRef();
	const imgRef = useRef();
	const removeImgButtonRef = useRef();

	//Focuses the input of the form when this is opened
	useEffect(() => {
		if (textRef.current) {
			textRef.current.focus()
			textRef.current.value = props.formData.payload.content
		}

		if (props.formData.payload.image) {
			console.log('There is an image')
			imageFormRef.current.style.display = 'flex'
			imgRef.current.style.display = 'block'
			imgRef.current.src = props.formData.payload.image
			removeImgButtonRef.current.style.display = 'block'
		} else if (props.formData.type) {
			imageFormRef.current.style.display = 'flex'
		}
	}, [props.formData])

	//Adds listener for the selectImage function
	useEffect(() => {
		const input = document.getElementById("input-image");
		input.addEventListener('change', selectImage)	
		
		return () => {
			input.removeEventListener('change', selectImage)
		} 
	}, [])

	const hideImgDisplay = () => {
		imgRef.current.style.display = 'none'
		imgRef.current.src = ''
	}

	//Shows the image selected
	const selectImage = () => {
		const image = document.getElementById("input-image").files[0];
		hideImgDisplay()
		if (image) {
			imgRef.current.style.display = 'block'
			imgRef.current.src = URL.createObjectURL(image)
			submitRef.current.classList.add("show-c")
			removeImgButtonRef.current.style.display = 'block'
		}
	}

	const resetForm = () => {
		props.formRef.current.classList.remove("show-c")
		document.body.classList.remove("not-scrollable");
		document.getElementsByClassName("post-form-hidden")[0].reset();
	}

	//Sends the data to create or edit a post
	const submitForm = async (e) => {
		try {
			e.preventDefault();
			setFetching(true)
			const user = JSON.parse(localStorage.getItem('user_data'));
			const payload = props.formData.payload
			if (e.target.image.files[0]) {
				const uploadData = new FormData();
				uploadData.append('file', e.target.image.files[0], 'file');
				await cloudinaryUpload(uploadData).then((response) => payload.image = response.secure_url)
			}

			if (!imgRef.current.getAttribute('src')) {
				console.log('Imaged erased')
				delete payload['image']
				console.log(payload)
			}
			payload.content = e.target.content.value
			
			await fetch(`https://agile-springs-89726.herokuapp.com/home/${props.formData.action}`, { 
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
			if (imgRef.current) {
				submitRef.current.classList.remove("show-c")
				hideImgDisplay()
				removeImgButtonRef.current.style.display = 'none'
			}
			setFetching(false)
			resetForm()
			props.getPosts()
		} catch (error) {
			console.log(error)
		}
	}

	const deleteContent = async (e) => {
		try {
			e.preventDefault();
			const user = JSON.parse(localStorage.getItem('user_data'));
			//const payload = { id: props.formData.payload.id }
			const payload = props.formData.payload
			await fetch(`https://agile-springs-89726.herokuapp.com/home/${props.formData.action}`, { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${user.token}`
				},
				body: JSON.stringify(payload)
			});

			resetForm()
			props.getPosts()
		} catch (error) {
			console.log(error)
		}
	}

	const changePicture = async (e) => {
		try {
			e.preventDefault();
			const payload = props.formData.payload
			if (e.target.image.files[0]) {
				const uploadData = new FormData();
				uploadData.append('file', e.target.image.files[0], 'file');
				await cloudinaryUpload(uploadData).then((response) => payload.pic = response.secure_url)
			}
			await fetch(`https://agile-springs-89726.herokuapp.com/home/${props.formData.action}`, { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${user_storage.token}`
				},
				body: JSON.stringify(payload)
			});
			
			//const data = await response.json()
			submitRef.current.classList.remove("show-c")
			hideImgDisplay()
			removeImgButtonRef.current.style.display = 'none'
			resetForm()
			/*props.setUser(prevState => ({
				...prevState,
				pic: payload.pic
		 	}))*/
			window.location.reload();
		} catch (error) {
			console.log(error)
		}
	}

	const removeImage = () => {
		hideImgDisplay()
		removeImgButtonRef.current.style.display = 'none'
		submitRef.current.classList.add("show-c")
	}

	//Changes the height of the textarea depending on the content
	const adjustHeight = (e) => {
		if (e) {
			e.target.style.height = "1px";
			e.target.style.height = (e.target.scrollHeight)+"px";
		}
	}

	//Checks that the textarea is not empty
	const checkEmpty = (string) => {
		if (string.replace(/\s/g, '').length) {
			submitRef.current.classList.add("show-c")
		} else {
			submitRef.current.classList.remove("show-c")
		}
	}

	const controlContent = (e) => {
		adjustHeight(e)
		checkEmpty(e.target.value)
	}

	const closeForm = () => {
		props.formRef.current.classList.remove("show-c")
		if (submitRef.current) {
			submitRef.current.classList.remove("show-c")
		}
		if (imgRef.current) {
			hideImgDisplay()
			removeImgButtonRef.current.style.display = 'none'
			imageFormRef.current.style.display = 'none'
		}
		document.getElementsByClassName("post-form-hidden")[0].reset();
		document.body.classList.remove("not-scrollable");
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
						<h3>{props.formData.title}</h3>
					</div>
					<div className="pic-div">
						<img src={props.user ? props.user.pic : ''} alt="profile-pic" className="profile-pic" />
						<textarea name="content" rows="1" className="auto_height" placeholder="What are you thinking?" onInput={controlContent} ref={textRef} required></textarea>
					</div>
					<div className="form-image" ref={imageFormRef}>
						<label htmlFor="input-image" className='custom-file-upload'>
							<h4>Add image:</h4>
							<i className="fa fa-2x fa-camera"></i>
						</label>
						<input type="file" id="input-image" name="image" accept="image/png, image/jpg, image/jpeg" onChange={(e) => selectImage(e)}/>
						<div className="img-div">
							<button type="button" className="remove-image" ref={removeImgButtonRef} onClick={removeImage}>&#88;</button>
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
					<div className="form-image" ref={imageFormRef}>
						<label htmlFor="input-image" className='custom-file-upload'>
							<h4>Add image:</h4>
							<i className="fa fa-2x fa-camera"></i>
						</label>
						<input type="file" id="input-image" name="image" accept="image/png, image/jpg, image/jpeg" onChange={(e) => selectImage(e)}/>
						<div className="img-div">
							<button type="button" className="remove-image" ref={removeImgButtonRef} onClick={removeImage}>&#88;</button>
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
			<form className="post-form-hidden" onSubmit={deleteContent}>
				<div>
					<h3>Do you want to {props.formData.message}?</h3>
				</div>
				<div className='request-buttons'>
					<button className="blue-button">Delete</button>
					<button type="button" className="grey-button" onClick={closeForm}>Cancel</button>
				</div>
			</form>
		)
	}
	
	return (
		<div className="hidden-form" ref={props.formRef}>
			{renderForm()}
		</div>
	)
}

export default PostForm