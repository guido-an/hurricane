const User = require('../models/User')

defineUser = async myUser => {
  let user
  if (myUser.provider === 'facebook') {
    const userFromDB = await User.findOne({ facebookId: myUser.id })
    user = userFromDB
  } else {
    user = myUser
  }
  return user
}

module.exports = defineUser