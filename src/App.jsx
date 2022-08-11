import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, matchRoutes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import AllPosts from './components/AllPosts';
import UserPosts from './components/UserPosts';
import SpecificPosts from './components/SpecificPosts'
import Users from './components/Users';
import Sign from './components/Sign';
import PostForm from './components/PostForm';

function App() {
	const [time, setTime] = useState(0)
	const [posts, setPosts] = useState(0)
  const [token, setToken] = useState(false)
	const [user, setUser] = useState(false)
	const [form, setForm] = useState('Edit')
	const [formData, setFormData] = useState({payload: { content: '' }})

	const mainRef = useRef();
	const formRef = useRef();

	useEffect( () => {
		const now = new Date().getTime();
		const setupTime = localStorage.getItem('setupTime');

		if(now-setupTime > 1000*60*60) {
			localStorage.clear()
			console.log('Session expired')
		}
		
		
		const user_storage = JSON.parse(localStorage.getItem('user_data'));
		if (user_storage) {
			console.log(user_storage)
			setToken(user_storage.token)
			fetchUser()
		}
	}, [time])

	//Loads the data of the user once
	/*useEffect(() => {
		const user_storage = JSON.parse(localStorage.getItem('user_data'));
		if (user_storage) {
			fetchUser()
		}
	}, [time])*/

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
		setUser(data.user)
	}

	//Reloads the content when there is a submit
	const getPosts = () => {
		setPosts(posts + 1)
	}

	const setTimer = (time) => {
		setTime(time)
	}

	const getToken = (value) => {
		setToken(value)
	}

	//Sets what kind of form will be shown by the renderForm function (PostForm.jsx)
	const selectForm = (type) => {
		setForm(type)
	}

	const isLogged = () => {
		if (token) {
			return (
				<Router>
					<div className='main-container' ref={mainRef}>
						<Nav getToken={getToken} user={user}/>
						<PostForm user={user} setUser={setUser} formRef={formRef} posts={posts} getPosts={getPosts} formData={formData} mainRef={mainRef} form={form}/>
						<Routes>
							<Route path='/' index element={<AllPosts user={user} token={token} formRef={formRef} mainRef={mainRef} posts={posts} getPosts={getPosts} setFormData={setFormData} selectForm={selectForm}/>}/>
							<Route path='/user/:id' element={<UserPosts user={user} token={token} formRef={formRef} mainRef={mainRef} setFormData={setFormData} selectForm={selectForm} posts={posts}/>}/>
							<Route path='/users' element={<Users token={token}/>}/>
						</Routes>
					</div>
				</Router>
			)
		} else {
			return (
				<Sign getToken={getToken} setTimer={setTimer}/>
			)
		}
	}

  return (
    <div className='full-height'>
			{isLogged()}
		</div>
  )
}

export default App
