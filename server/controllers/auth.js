import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//function that will register a new user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      email,
      friends,
      picturePath,
      location,
      occupation,
    } = req.body

    //hashing password
    const salt = await bcrypt.genSalt() // creating salt for the password before encrypting
    const passwordHash = await bcrypt.hash(password, salt)

    //creating a mongodb user object
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      friends,
      picturePath,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100000),
      impressions: Math.floor(Math.random() * 100000),
    })

    //saving the user in mongodb database
    const savedUser = await newUser.save()
    delete savedUser.firstName
    console.log(savedUser)
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//Logging IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    //searching for the user object
    const userFound = await User.findOne({ email: email })
    if (!userFound) {
      res.status(400).json({ message: 'User does not exist' })
    }
    const isMatch = await bcrypt.compare(password, userFound.password)

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Credential' })
    }

    const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET)

    res.status(200).json({
      user: userFound,
      token,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
