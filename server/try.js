import bcrypt from 'bcrypt'

const pass = 'rohan'

const encryptPass = async (pass) => {
  const salt = await bcrypt.genSalt()
  const passwordhash = await bcrypt.hash(pass, salt)
  console.log(passwordhash)
}
encryptPass(pass)
