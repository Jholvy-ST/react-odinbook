const cloudinaryUpload = async (fileToUpload) => {
	/*return fetch(API_URL + 'https://agile-springs-89726.herokuapp.com/home/cloudinary-upload', fileToUpload)
	.then(res => res.data)
	.catch(err => console.log(err))*/
	const user = JSON.parse(localStorage.getItem('user_data'));
	const response = await fetch('https://agile-springs-89726.herokuapp.com/home/cloudinary-upload', {
		method: 'POST',
		mode: 'cors',
		headers: {
			Authorization: `Bearer ${user.token}`
		},
		body: fileToUpload
	})
	
	const data = await response.json();
	return data
}

export default cloudinaryUpload