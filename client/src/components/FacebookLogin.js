import '../components/scss/buttons.scss'
import React from 'react'

class FacebookLogin extends React.Component {
  render () {
    return (
      <div>
        <a href='http://localhost:5000/auth/facebook' className='facebook-btn'><i className="fab fa-facebook"></i>Login with Facebook</a>
      </div>
    )
  }
}

export default FacebookLogin
