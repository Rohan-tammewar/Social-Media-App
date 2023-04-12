import express, { application } from 'express'
import bodyparser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/post.js'
import authroutes from './routes/auth.js'
import userroutes from './routes/user.js'
import postroutes from './routes/post.js'
import { verifyToken } from './middleware/auth.js'
// Cofigurations
const __filename = fileURLToPath(import.meta.url) //URl is converted to the file path
const __dirname = path.dirname(__filename) //directory name is taken from the file path
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyparser.json({ limit: '30mb', extended: true }))
app.use(bodyparser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// FILE STORAGE
const storage = multer.diskStorage({
  //when users upload a file it saves the file to this specific location
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.post('/auth/register', upload.single('profilePicture'), register)

app.post('/posts', verifyToken, upload.single('postPicture'), createPost)
// ROUTES
app.use('/auth', authroutes)

app.use('/users', userroutes)

app.use('/posts', postroutes)

//MONGOOSE SETUP
const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(app.listen(PORT, () => console.log(`Listening at ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`))
