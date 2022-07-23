import { useState, useEffect } from "react"
import { Link } from "react-router-dom";	

const Friends = (props) => {
	const [isLoading, setLoading] = useState(true)
	const [friends, setFriends] = useState([])

	useEffect(() => {
		getFriends()
	}, [props.friends])

	//Gets user from server by id
	const fetchFriend = async (user) => {
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

	//Gets all the friends of the current user
	const getFriends = async () => {
		const friends_list = []
		for (let i = 0; i < props.friends.length; i++) {
			const friend = await fetchFriend(props.friends[i])
			friends_list.push(friend)
		}

		setLoading(false)
		setFriends(friends_list)
	}

	//POST request to delete a friend
	const deleteFriend = async (e) => {
		try {
			const user = JSON.parse(localStorage.getItem('user_data'))
			const payload = { id: user.id, friend: e.target.id }
			const response = await fetch('https://agile-springs-89726.herokuapp.com/home/delete-friend', { 
				method: 'POST',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify(payload)
			});
			props.setReload(props.reload + 1)
		} catch (error) {
			console.log(error)
		}
	}

	/*const changePage = (url) => {
		navigate(url, { replace: true });
		window.location.reload();
	}*/
	
	//Checks if the data is loaded before rendering the content
	if (!isLoading) {
		return (
			<div className='friends-container'>
				{friends.map(friend => 
					<div key={friend._id} className="friend">
						<div className="friend-div">
							<img src={friend.pic} alt="profile-pic" />
							<Link to={`../user/${friend._id}`} className='linkD' onClick={() => changeLocation()}>
								{friend.name}
							</Link>
						</div>
						<button className="grey-button" id={friend._id} onClick={deleteFriend}>Delete</button>
					</div>
				)}
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

export default Friends