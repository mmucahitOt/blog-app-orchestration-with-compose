import BlogDetail from './blogDetail/BlogDetail'


const Blogs = ({ blogs, handleNotification, refetchBlogs, user }) => {
  if (!blogs || blogs.length === 0) {
    return <div></div>
  }
  return (
    <div>
      {blogs.map((blog) => <BlogDetail key={blog.id} blog={blog} handleNotification={handleNotification} refetchBlogs={refetchBlogs} user={user}/>)}
    </div>
  )
}

export default Blogs