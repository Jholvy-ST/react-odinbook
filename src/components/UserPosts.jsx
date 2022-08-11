import { useState, useEffect } from 'react'
import SpecificPosts from './SpecificPosts';
import Friends from './Friends';
import Requests from './Requests';

const UserPosts = (props) => {
	
	const [isLoading, setLoading] = useState(true)
	const [data, setData] = useState(false)
	const [tab, setTab] = useState('Posts')
	const [reload, setReload] = useState(0)

	//Reloads the content when there is a change
	useEffect( () => {
		const pathname = window.location.pathname;
		const lastPart = pathname.split("/").pop();
		fetchUserData(lastPart);
	}, [reload, props.posts])

	//Gets the data of a single user
	const fetchUserData = async (user_id) => {
		try {
			//const user = JSON.parse(localStorage.getItem('user_data'));
			const payload = { id: user_id }
			const response = await fetch('https://agile-springs-89726.herokuapp.com/home/my-profile', { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify(payload)
			});
			const userData = await response.json();
			const arrangedPosts = await attachComments(orderPosts(userData.posts))
			/*setPosts(arrangedPosts);
			setUser(userData.user);*/
			setLoading(false)
			setData(
				{
					user: userData.user,
					posts: arrangedPosts
				}
			)
			console.log(userData)
			
		} catch (error) {
			console.log(error)
		}
	}

	const orderPosts = (posts) => {
		const allPosts = []

		const ownPosts = posts

		for (let i = 0; i < ownPosts.length; i++) {
			const date = new Date(ownPosts[i].date)
			ownPosts[i].date = date
			allPosts.push(ownPosts[i]);
		}

		const ordered = allPosts.sort( (a, b) => { return b.date.getTime() - a.date.getTime() })
		//console.log(allPosts.sort( (a, b) => { return b.date.getTime() - a.date.getTime() }))

		return ordered
	}

	const fetchComments = async (id) => {
		try {
			const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/posts/${id}`, { 
				method: 'get',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				}
			});

			const commentData = await response.json();
			if (!commentData.comments.length > 0) {
				return []
			}

			return commentData.comments
		} catch (error) {
			console.log(error)
		}
	}

	const attachComments = async (posts) => {
		for (let i = 0; i < posts.length; i++) {
			const comments =  await fetchComments(posts[i]._id)
			posts[i].comments = comments;
		}

		console.log(posts)

		return posts
	}

	//Allows the current user to change his profile picture
	const editPic = () => {
		const user = JSON.parse(localStorage.getItem('user_data'));
		if (data.user._id === user.id) {
			return (
				<div onClick={showProfileForm} style={{cursor: "pointer"}}>
					<img src={data.user.pic} alt="current-user-pic" />
				</div>
			)
		}

		return (
			<div>
				<img src={data.user.pic} alt="current-user-pic" />
			</div>
		)
	}

	//Shows the form to change the profile picture
	const showProfileForm = () => {
		props.selectForm('Picture')
		props.formRef.current.classList.add("show-c")
		document.body.classList.add("not-scrollable");
		props.setFormData(
			{
				title: 'Change profile picture',
				action: 'change-profile-picture',
				type: 'picture',
				payload: {
					id: data.user._id,
					pic: data.user.pic
				}
			}
		)
	}

	const changeTab = (e) => {
		setTab(e.target.innerText)
	}

	const renderTab = (data) => {
		if (tab === 'Posts') {
			return <SpecificPosts user={props.user} posts={data.posts} formRef={props.formRef} mainRef={props.mainRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
		} else if (tab === 'Friends') {
			return <Friends friends={data.user.friends} token={props.token} reload={reload} setReload={setReload} formRef={props.formRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
		}

		return <Requests requests={data.user.requests} token={props.token} reload={reload} setReload={setReload}/>
	}

	const highlight = (e) => {
		const items = Array.from(document.getElementsByClassName("nav-item"))
		//e.preventDefault()
		items.forEach(link => link.classList.remove("highlight"))
		e.target.parentElement.classList.add("highlight")
	}

	if (!isLoading) {
		return (
			<div className='main-page'>
				<div className='posts-container'>
					<div className='user-data'>
						{editPic()}
						<div>
							<h3>{data.user.name}</h3>
						</div>
					</div>
					<div className='user-nav'>
						<div className='nav-item highlight' onClick={changeTab}>
							<h3 onClick={highlight}>Posts</h3>
						</div>
						<div className='nav-item' onClick={changeTab}>
							<h3 onClick={highlight}>Friends</h3>
						</div>
						<div className='nav-item' onClick={changeTab}>
							<h3 onClick={highlight}>Requests</h3>
						</div>
					</div>
					{renderTab(data)}
				</div>
			</div>
			
		)
	}

	return (
		<div className="spinner-container">
			<div className="loading-spinner"></div>
		</div>
	)
	
}

export default UserPosts