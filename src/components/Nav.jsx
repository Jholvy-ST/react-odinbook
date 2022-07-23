import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";	

const Nav = (props) => {
	const navigate = useNavigate();

	//Hides the header's dropdown menu when the user clicks elsewhere
	const showDrop = (e) => {
		if (!e.target.matches('.pic-div')) {
			const myDropdown = document.getElementById("myDropdown");
			if (myDropdown.classList.contains('show')) {
				myDropdown.classList.remove('show');
			}
		}
	}

	//Sets a timer for the current session (not accurate)
	useEffect(() => {
		const timer = setTimeout(() => {
			alert('Session expired')
			window.location.reload()
		}, 1000*60*60);
    return () => clearTimeout(timer);
	}, [])

	//Loads the data of the user once
	useEffect(() => {
		fetchUser()	
	}, [])

	//Adds listener for the showDrop function
	useEffect( () => {
		const drop = document.getElementById("root");
		drop.addEventListener('click', showDrop)	
		
		return () => {
			drop.removeEventListener('click', showDrop)
		} 
	}, [])

	const [userData, setUserData] =  useState(undefined)
	const [user_storage, setUserStorage] = useState(JSON.parse(localStorage.getItem('user_data')))

	//Gets the data of the current user from the server
	const fetchUser = async () => {
		const user = JSON.parse(localStorage.getItem('user_data'));
		const payload = { id: user.id }
		const response = await fetch('https://agile-springs-89726.herokuapp.com/home/my-profile', {
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

	//Shows the header's dropdown menu
	const showMenu = () => {
		document.getElementById("myDropdown").classList.toggle("show");
	}

	//Logs out the user
	const logOut = () => {
		localStorage.clear();
		props.getToken(false)
	}

	//Takes the user to his profile page
	const goToProfile = () => {
		navigate('/user')
	}
	
	//If the user is lpgged renders the content
	const isLogged = () => {
		if (userData) {
			return (
				<div className='nav-links'>
					<div className="pic-div" onClick={goToProfile}>
						<div className="pic-div">
							<img src={userData.pic} alt="profile-pic" className="profile-pic" />
						</div>
						<div>
							<h3>{userData.name.substring(0, userData.name.indexOf(' '))}</h3>
						</div>
					</div>
					<div className="dropdown">
						<div className="pic-div" onClick={showMenu}>▼</div>
						<div className="dropdown-content" id="myDropdown">
							<Link to={`user/${user_storage.id}`} className='linkD'>My profile</Link>
							<Link to='/users' className='linkD'>Users</Link>
							<Link to='/' className='linkD' onClick={logOut}>Log out</Link>
						</div>
					</div>
				</div>
			)
		}
	}

	return (
		<div className='header'>
			<div>
				<h1><Link to='/' className='linkD'>Odinbook</Link></h1>
			</div>
			{isLogged()}
		</div>
	)
}

export default Nav;