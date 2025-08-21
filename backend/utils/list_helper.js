const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const authorCounts = authors.reduce((acc, author) => {
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b
  );
  return { author: mostFrequentAuthor, blogs: authorCounts[mostFrequentAuthor] };
};

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});
  const mostLikedAuthor = Object.keys(authorLikes).reduce((a, b) =>
    authorLikes[a] > authorLikes[b] ? a : b
  );
  return { author: mostLikedAuthor, likes: authorLikes[mostLikedAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
