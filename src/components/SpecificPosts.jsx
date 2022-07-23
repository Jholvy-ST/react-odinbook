import CreatePost from './CreatePost';
import SinglePost from "./SinglePost";

const SpecificPosts = (props) => {

	return (
		<div className='posts-subcontainer'>
			<CreatePost formRef={props.formRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
			{props.posts.map((post) => 
				<SinglePost post={post} key={post._id} formRef={props.formRef} mainRef={props.mainRef} setFormData={props.setFormData} selectForm={props.selectForm}/>
			)}
		</div>
		
	)
}

export default SpecificPosts