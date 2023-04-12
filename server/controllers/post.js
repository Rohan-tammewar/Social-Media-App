import Post from '../models/post'
import User from '../models/User'

//CREATE
export const createPost = async (req, res, next) => {
  try {
    const { userId, description, picturePath } = req.body

    const user = User.findById(userId)
    const newPost = new Post({
      userId,
      firstname: user.firstname,
      lastname: user.lastname,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: {},
    })

    await newPost.save()
    const allPost = await Post.find()
    res.status(201).json(allPost)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
}

export const getFeedPosts = async (req, res) => {
  try {
    const feedPost = await Post.find()
    res.status(200).json(feedPost)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const userPost = await Post.find({ userId })
    res.status(200).json(userPost)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

//UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.param
    const { userId } = req.body

    const post = await Post.findbyId(id)

    const isLiked = post.likes.get(userId)

    if (isLiked) {
      post.likes.delete(userId)
    } else {
      post.likes.set(userId, true)
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true },
    )

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
