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
		
		
		const user = JSON.parse(localStorage.getItem('user_data'));
		if (user) {
			console.log(user)
			setToken(user.token)
		}
	}, [time])

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
						<Nav getToken={getToken}/>
						<PostForm formRef={formRef} posts={posts} getPosts={getPosts} formData={formData} mainRef={mainRef} form={form}/>
						<Routes>
							<Route path='/' index element={<AllPosts token={token} formRef={formRef} mainRef={mainRef} posts={posts} getPosts={getPosts} setFormData={setFormData} selectForm={selectForm}/>}/>
							<Route path='/user/:id' element={<UserPosts token={token} formRef={formRef} mainRef={mainRef} setFormData={setFormData} selectForm={selectForm} posts={posts}/>}/>
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
