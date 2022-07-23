import FacebookLogin from 'react-facebook-login';

const Sign = (props) => {

	//Logs in the user using a facebook user
	const responseFacebook = async (response) => {
		console.log(response);

		const fetchResponse = await fetch(`https://agile-springs-89726.herokuapp.com/auth/facebook/token?access_token=${response.accessToken}`, {method: 'GET'});
		const data = await fetchResponse.json();
		console.log(data)

		const userData = {
			id: data._doc._id,
			token: data.token,
			pic: data._doc.pic
		}

		props.getToken(data.token)
		localStorage.setItem('user_data', JSON.stringify(userData))
		const now = new Date().getTime();
		props.setTimer(1000*60*60)
		localStorage.setItem('setupTime', now)
	}

	//Logs in as guest (no facebook account required)
	const logGuest = async () => {
		try {
			const payload = {
				username: 'Verna Osinski',
				password: '627e8949ad0015cb9b3dd5ca'
			}
			const response = await fetch(`https://agile-springs-89726.herokuapp.com/auth/local`, {
				method: 'POST',
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(payload)
			})

			const data = await response.json();
			console.log(data)

			const userData = {
				id: data._doc._id,
				token: data.token,
				pic: data._doc.pic
			}

			props.getToken(data.token)
			localStorage.setItem('user_data', JSON.stringify(userData))
			const now = new Date().getTime();
			props.setTimer(1*60*60*1000)
			localStorage.setItem('setupTime', now)
		} catch (error) {
			console.log(error)
		}
	}

	//Renders react facebook component
	return (
		<div className="App log-div">
			<h1>Odinbook</h1>
			<h3>You need to login to see the content</h3>
			<FacebookLogin
				appId={"360320489401780"}
				autoLoad={false}
				fields="name,email,picture"
				callback={responseFacebook}
				icon='fa-facebook'
			/>
			<button type='button' className='grey-button' onClick={logGuest}>Login as guest</button>
		</div>
	)
}

export default Sign