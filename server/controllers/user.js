import User from '../models/User.js'

//getting user data from the database
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userFound = await User.findById(id)

    if (!userFound) {
      res.status(404).json('User not found')
    }
    res.status(200).json(userFound)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

//getting friends data
export const getUserFriends = async (req, res, next) => {
  try {
    const { id } = req.param
    console.log(id)
    let userFound = User.findById(id)
    let friendsFound = await Promise.all(
      userFound.friends.map((id) => User.findById(id)),
    )
    const fromattedFriends = friendsFound.map(
      ({ _id, firstName, lastname, Occupation, picturePath }) => {
        return {
          _id,
          firstName,
          lastname,
          Occupation,
          picturePath,
        }
      },
    )
    res.status(200).json(fromattedFriends)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

//adding removing friends
export const addRemoveFriends = async (req, res, next) => {
  try {
    const { id, friendId } = req.param

    const user = User.findById(id)
    const friend = User.findById(friendId)

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId)
      friend.friends = friend.friends.filter((id) => id !== id)
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save()
    await friend.save()

    const fromattedFriends = friendsFound.map(
      ({ _id, firstName, lastname, Occupation, picturePath }) => {
        return {
          _id,
          firstName,
          lastname,
          Occupation,
          picturePath,
        }
      },
    )

    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
