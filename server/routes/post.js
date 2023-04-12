import express from 'express'
import { getFeedPosts, getUserPosts, likePost } from '../controllers/post.js'

const router = express.Router()
