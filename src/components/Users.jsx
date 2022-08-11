import { useEffect } from "react"
import { useState } from "react"

const Users = (props) => {
	const [users, setUsers] = useState([])

	//Loads the content once
	useEffect(() => {
		fetchUsers();
	}, [])

	//Gets all the users from the server
	const fetchUsers = async () => {
		const user = JSON.parse(localStorage.getItem('user_data'));
		const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/users`, { 
			method: 'POST',	
			mode: 'cors',
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${props.token}`
			}
		})
		
		const usersData = await response.json();
		const no_requests = await removeRequests(usersData.user_list, user.id)
		const no_friends = await removeFriends(no_requests, user.id)
		const no_requested = await removeRequested(no_friends, user.id)
		setUsers(removeCurrentUser(no_requested, user.id))
	}

	//Removes current user from the list
	const removeCurrentUser = (users, current) => {
		const user_list = users
		for (let i = 0; i < user_list.length; i++) {
			if (users[i]._id === current) {
				user_list.splice(i, 1);
			}
		}

		return user_list
	}

	//Removes users who have already sent a request to the current user
	const removeRequests = (users_list, current) => {
		const user_list = users_list
		const toEliminate = []
		for (let i = 0; i < user_list.length; i++) {
			if (user_list[i]._id === current) {
				for (let j = 0; j < user_list[i].requests.length; j++) {
					console.log('pushed')
					toEliminate.push(user_list[i].requests[j])		
				}
			}
		}

		for (let i = 0; i < toEliminate.length; i++) {
			for (let j = 0; j < user_list.length; j++) {
				if (user_list[j]._id === toEliminate[i]) {
					user_list.splice(j, 1)
				}
			}
		}

		return user_list
	}

	//Removes the friends of the current user
	const removeFriends = (users_list, current) => {
		const user_list = users_list
		const toEliminate = []
		for (let i = 0; i < user_list.length; i++) {
			for (let j = 0; j < user_list[i].friends.length; j++) {
				if (user_list[i].friends[j] === current) {
					toEliminate.push(user_list[i])
					j = user_list[i].friends.length
				}
			}
		}

		for (let i = 0; i < toEliminate.length; i++) {
			for (let j = 0; j < user_list.length; j++) {
				const index = user_list.indexOf(toEliminate[i]);
				if (index !== -1) {
					user_list.splice(index, 1)
				}
			}
		}

		return user_list
	}

	//Removes the users who have a pending request from the current user
	const removeRequested = (users_list, current) => {
		const user_list = users_list
		const toEliminate = []
		for (let i = 0; i < user_list.length; i++) {
			for (let j = 0; j < user_list[i].requests.length; j++) {
				if (user_list[i].requests[j] === current) {
					toEliminate.push(user_list[i])
					j = user_list[i].requests.length
				}
			}
		}

		for (let i = 0; i < toEliminate.length; i++) {
			for (let j = 0; j < user_list.length; j++) {
				const index = user_list.indexOf(toEliminate[i]);
				console.log(index)
				if (index !== -1) {
					user_list.splice(index, 1)
					j = user_list.length
				}
			}
		}

		return user_list
	}

	//Sends a friend request from the current user
	const sendFriendReq = async (e) => {
		e.preventDefault();
		const user = JSON.parse(localStorage.getItem('user_data'));
		const payload = { req_id: e.target.user_id.value, id: user.id }
		const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/send-friend-request`, { 
			method: 'POST',	
			mode: 'cors',
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${props.token}`
			},
			body: JSON.stringify(payload)
		})
		//Reloads the list
		fetchUsers()
	}

	if (users.length > 0) {
		return (
			<div className="main-page">
				<div className="users-container">
					<div>
						<h3>Users</h3>
					</div>
					{users.map((user) => 
						<form className="user" key={user._id} onSubmit={sendFriendReq}>
							<div className="user-div">
								<img src={user.pic} alt="profile-pic" />
								{user.name}
							</div>
							<div className="user-id">
								<input type="text" name='user_id' defaultValue={user._id}/>
							</div>
							<div>
								<button className="blue-button">Add friend</button>
							</div>
						</form>
					)}
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

export default Users