import { useState, useEffect } from "react"
import { Link } from "react-router-dom";	

const Friends = (props) => {
	const [isLoading, setLoading] = useState(true)
	const [friends, setFriends] = useState([])

	const user_storage = JSON.parse(localStorage.getItem('user_data'))

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

	const showFriendDeleteForm = (friend) => {
		props.selectForm('Delete')
		props.formRef.current.classList.add("show-c")
		props.setFormData(
			{
				message: 'delete this friend',
				action: 'delete-friend',
				payload: {
					id: user_storage.id,
					friend: friend._id
				}
			}
		)
	}
	
	//Checks if the data is loaded before rendering the content
	if (!isLoading) {
		return (
			<div className='friends-container'>
				{friends.map(friend => 
					<div key={friend._id} className="friend">
						<div className="user-div">
							<img src={friend.pic} alt="profile-pic" />
							<Link to={`../user/${friend._id}`} className='linkD' onClick={() => changeLocation()}>
								{friend.name}
							</Link>
						</div>
						<button className="grey-button" id={friend._id} onClick={() => showFriendDeleteForm(friend)}>Delete</button>
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