import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization')

    if (!token) {
      return res.status(403).json('Access Denied')
    }

    token = token.slice(7, token.length).trimleft()

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    console.log(verified)
    req.user = verified // what is req.user over here
    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
