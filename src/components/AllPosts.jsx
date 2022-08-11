import { useState } from 'react';
import { useEffect } from 'react';
import SinglePost from './SinglePost';
import CreatePost from './CreatePost';
import Friends from './Friends';

const AllPosts = (props) => {

	const [isLoading, setLoading] = useState(true)
	const [posts, setPosts] = useState([])
	const [friends, setFriends] = useState([])
	const [isDesktop, setDesktop] = useState(window.innerWidth > 1380);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1380);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
	
	//Loads the content
	useEffect( () => {	
		fetchPosts();
	}, [props.posts])

	//Gets the user posts from the server
	const fetchPosts = async () => {
		try {
			const user = JSON.parse(localStorage.getItem('user_data'));
			//if (props.posts.length === 0 && isLoading === true) {
				const payload = { id: user.id }
				const response = await fetch('https://agile-springs-89726.herokuapp.com/home/user-posts', { 
					method: 'POST',	
					mode: 'cors',
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${props.token}`
					},
					body: JSON.stringify(payload)
				});
				const postData = await response.json();

				const friendsPosts = await fetchFriendsPosts(postData.friends)

				const allPosts = {
					own_posts: postData.own_posts,
					friends: friendsPosts
				}
				
				const arrangedPosts = await attachComments(orderPosts(allPosts))
				console.log(arrangedPosts)
				setLoading(false)
				setFriends(postData.friends.map((friend)=> friend._id))
				setPosts(arrangedPosts);
				console.log(postData.own_posts)
				console.log(postData.friends)
			//}			
		} catch (error) {
			console.log(error)
		}
	}

	//Gets the friends posts from the server
	const fetchFriendsPosts = async (friends) => {
		const allPosts = []
		if (friends.length > 0) {
			for (let i = 0; i < friends.length; i++) {
				const payload = { id: friends[i]._id }
				const response = await fetch('https://agile-springs-89726.herokuapp.com/home/user-posts', { 
					method: 'POST',	
					mode: 'cors',
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${props.token}`
					},
					body: JSON.stringify(payload)
				});
				const postData = await response.json();
				
				for (let i = 0; i < postData.own_posts.length; i++) {
					allPosts.push(postData.own_posts[i])
				}
			}
		}

		return allPosts
	}

	//Orders all the posts by date
	const orderPosts = (posts) => {
		const allPosts = []

		const ownPosts = posts.own_posts
		const friendsPosts = posts.friends

		for (let i = 0; i < ownPosts.length; i++) {
			const date = new Date(ownPosts[i].date)
			ownPosts[i].date = date
			allPosts.push(ownPosts[i]);
		}

		for (let i = 0; i < friendsPosts.length; i++) {
			const date = new Date(friendsPosts[i].date)
			friendsPosts[i].date = date
			allPosts.push(friendsPosts[i]);
		}

		const ordered = allPosts.sort( (a, b) => { return b.date.getTime() - a.date.getTime() })

		return ordered
	}

	//Gets the comments of a single post
	const fetchComments = async (id) => {
		try {
			const response = await fetch(`https://agile-springs-89726.herokuapp.com/home/posts/${id}`, { 
				method: 'get',	
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${props.token}`
				}
			});

			const commentData = await response.json();
			//Return an empty array if there are no comments
			if (!commentData.comments.length > 0) {
				return []
			}

			return commentData.comments
		} catch (error) {
			console.log(error)
		}
	}

	//Attaches comments to their corresponding post
	const attachComments = async (posts) => {
		for (let i = 0; i < posts.length; i++) {
			const comments =  await fetchComments(posts[i]._id)
			posts[i].comments = comments;
		}

		console.log(posts)

		return posts

		/*return posts.map(async (post) => {
			const comments =  await fetchComments(post._id)
			post.comments = comments
			return post
		})*/
	}

	const renderFriends = () => {
		if (isDesktop) {
			return (
				<div className='side-bar'>
					<h3>Friends</h3>
					<Friends token={props.token} friends={friends} formRef={props.formRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
				</div>
			)
		}
	} 

	
	//Checks if the data is loaded before rendering the content
	if (!isLoading) {
		return (
			<div className='main-page'>
				<div className='posts-container'>
					<div>
						<h3>Posts</h3>
					</div>
					<div>
						<CreatePost formRef={props.formRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
					</div>
					{posts.map((post) => 
						<SinglePost post={post} token={props.token} key={post._id} formRef={props.formRef} mainRef={props.mainRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
					)}
				</div>
				{renderFriends()}
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

export default AllPosts