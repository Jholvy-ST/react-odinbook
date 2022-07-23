import { useState, useEffect } from "react"
import { Link } from "react-router-dom";	

const Requests = (props) => {
	const [isLoading, setLoading] = useState(true)
	const [requests, setRequests] = useState([])
	const [list, setList] = useState(props.requests)

	//Loads the data once
	useEffect(() => {
		getRequests(props.requests)
	}, [])

	//Gets the data of a single user
	const fetchUser = async (user) => {
		try {
			//const user = JSON.parse(localStorage.getItem('user_data'));
			const payload = { id: user }
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
			console.log(userData)
			return userData.user
			
		} catch (error) {
			console.log(error)
		}
	}

	//Gets the data of the users on the list if requests
	const getRequests = async () => {
		const users_list = []
		for (let i = 0; i < list.length; i++) {
			const user = await fetchUser(list[i])
			users_list.push(user)
		}

		props.setReload(props.reload + 1)
		setLoading(false)
		setRequests(users_list)
	}

	//Accepts the request from a user
	const acceptRequest = async (e) => {
		try {
			e.preventDefault();
			const user = JSON.parse(localStorage.getItem('user_data'));
			const payload = { id: user.id, req_id: e.target.user_id.value }
			const response = await fetch('https://agile-springs-89726.herokuapp.com/home/friend-requests', { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify(payload)
			});
			const index = list.indexOf(e.target.className)
			const newList = list
			newList.splice(index, 1)
			setList(newList)
			getRequests()
		} catch (error) {
			console.log(error)
		}
	}

	//Deletes a request from the list
	const deleteRequest = async (e) => {
		try {
			//e.preventDefault();
			const user = JSON.parse(localStorage.getItem('user_data'));
			const payload = { id: user.id, req_id: e.target.className }
			const response = await fetch('https://agile-springs-89726.herokuapp.com/home/delete-request', { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify(payload)
			});
			//setLoading(true)
			const index = list.indexOf(e.target.className)
			const newList = list
			newList.splice(index, 1)
			setList(newList)
			getRequests()
		} catch (error) {
			console.log(error)
		}
	}
	
	//Renders different content depending on the list of requests
	if (!isLoading && list.length > 0) {
		return (
			<div className='posts-subcontainer'>
				{requests.map(user => 
					<form key={user._id} className="user" key={user._id} onSubmit={acceptRequest}>
						<Link to={`../user/${user._id}`} className='linkD' onClick={() => changeLocation()}>
							{user.name}
						</Link>
						<div className="user-id">
							<input type="text" name='user_id' defaultValue={user._id}/>
						</div>
						<div className='request-buttons'>
							<button className="blue-button">Accept</button>
							<button type="button" onClick={deleteRequest} className={user._id}>Delete</button>
						</div>
					</form>
				)}
			</div>
		)
	} else if (!isLoading && list.length === 0) {
		return (
			<div className='posts-container'>
				<h3>You have no requests</h3>
			</div>
		)
	}

	//Loading screen
	return (
		<div className="spinner-container">
			<div className="loading-spinner"></div>
		</div>
	)
	
}

export default Requests