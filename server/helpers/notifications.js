const User = require('../models/User')
var ObjectId = require('mongodb').ObjectID

const notificationLike = async (currentUser, post, type, message) => {
  if (currentUser._id.toString() == post.user.toString()) {

  } else {
    try {
      const url = post.mediaFile[0] ? post.mediaFile[0].url : ''
      const filter = { _id: post.user }
      const update = {
        $addToSet: {
          notifications: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            action: 'had liked your post',
            postUrl: `/post/${post._id}/`,
            mediaFile: url,
            date: Date.now()
          }
        },
        $inc: { unreadNotifications: 1 }
      }
      await User.findOneAndUpdate(filter, update)
    } catch (err) {
      console.log(err)
    }
  }
}

const notificationComments = async (currentUser, post) => {
  const myUserId = ObjectId(currentUser._id).toString()
  const postUserId = ObjectId(post.user._id).toString()
  // const today = new Date()
  // const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  // const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

  try {
    if (myUserId == postUserId) {
      console.log('same user')
      return
    }
    const usersToSendNotification = [postUserId]
    post.comments.forEach(comment => {
      const userIdInComments = ObjectId(comment.user).toString()
      if (!usersToSendNotification.includes(userIdInComments)) {
        usersToSendNotification.push(userIdInComments)
      }
    })

    usersToSendNotification.forEach(async userId => {
      const commentInPostUserId = ObjectId(userId).toString()
      if (commentInPostUserId != myUserId) {
        const filter = { _id: commentInPostUserId }
        const update = {
          $addToSet: {
            notifications: {
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              action: commentInPostUserId == postUserId ? 'had commented your post' : 'had also commented the post',
              postUrl: `/post/${post._id}/`,
              date: Date.now()
            }
          },
          $inc: { unreadNotifications: 1 }
        }
        await User.findOneAndUpdate(filter, update)
      }
    })
  } catch (err) {
    console.log(err, 'Err:')
  }
}

module.exports = {
  notificationLike,
  notificationComments
}
