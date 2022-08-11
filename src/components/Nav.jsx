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

	//Adds listener for the showDrop function
	useEffect( () => {
		const drop = document.getElementById("root");
		drop.addEventListener('click', showDrop)	
		
		return () => {
			drop.removeEventListener('click', showDrop)
		} 
	}, [])

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
	
	//if (props.user) {
	return (
		<div className='header'>
			<div>
				<h1><Link to='/' className='linkD'>Odinbook</Link></h1>
			</div>
			<div className='nav-links'>
					<div className="pic-div" onClick={goToProfile}>
						<div className="pic-div">
							<img src={props.user ? props.user.pic : ''} alt="profile-pic" className="profile-pic" />
						</div>
						<div>
							<h3>{props.user ? props.user.name.substring(0, props.user.name.indexOf(' ')) : ''}</h3>
						</div>
					</div>
					<div className="dropdown">
						<div className="pic-div" onClick={showMenu}>▼</div>
						<div className="dropdown-content" id="myDropdown">
							<Link to={`user/${props.user ? props.user._id : ''}`} className='linkD'>My profile</Link>
							<Link to='/users' className='linkD'>Users</Link>
							<Link to='/' className='linkD' onClick={logOut}>Log out</Link>
						</div>
					</div>
				</div>
		</div>
	)
	//}
}

export default Nav;