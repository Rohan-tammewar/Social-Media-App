import express from 'express'
import { getFeedPosts, getUserPosts, likePost } from '../controllers/post.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
router.get('/', verifyToken, getUserPosts)
router.get('/:userId/posts', verifyToken, getFeedPosts)

//update

router.patch('/:id/like', verifyToken, likePost)

export default router
