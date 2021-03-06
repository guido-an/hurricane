import React from 'react'
import AuthContext from '../../contexts/AuthContext'
import { FOLLOW_USER , GET_USER } from '../../api/userAPI'
import '../scss/PostCard.scss'
import '../scss/Comments.scss'
import {Link} from 'react-router-dom';
import ProfilePictureDefault from '../Profile/ProfilePictureDefault'
import FollowUserBtn from '../FollowUserBtn'
                    
            

class Follow extends React.Component {
 static contextType = AuthContext
 state = { 
   user: null,
   pageUser: null,
   pageUserIsFollowed: null,
  }

  async componentDidMount(){
    const user = this.props.post.user
    this.setState({ user})
    this.checkIfPageUserIsFollowed(user)
    try {
        await this.getUser()
      } catch(err){
        console.log(err)
      }
  }
  checkIfPageUserIsFollowed = (user) => {
      if(user && user.followedBy.includes(this.context.loggedInUser._id)){
        this.setState({ pageUserIsFollowed: true })
      } 
    else {
      this.setState({ pageUserIsFollowed: false })
    }
  }

  getUser = async () => {
    try {
      const user = await GET_USER(this.state.user._id)
      this.setState({ pageUser: user })
      this.checkIfPageUserIsFollowed(user)
    } catch(err){
      console.log(err)
    }
  }

  onSubmitHandler = async e => {
    e.preventDefault()
    try {
      await FOLLOW_USER(this.state.user._id)
      await this.getUser()
    } catch(err){
      console.log(err)
    }
  }
  

  render () {
    return (
      <div className="follow">
        <form onSubmit={this.onSubmitHandler}>
          <div style={{ display: 'flex '}}>
           {this.props.post.user.profilePicture ? 
                <img className='ui avatar image circular' src={this.props.post.user.profilePicture.url} />
                  :
                  <ProfilePictureDefault 
                         user={this.props.post.user}
                         heightAndWidth="40px"
                         fontSize="16px"
                         top="10px"
                    />
                } 
               <Link to={`/profile/${this.props.post.user._id}`}>{this.props.post.user.firstName} {this.props.post.user.lastName}</Link>
            </div>
            
        </form> 
        <FollowUserBtn user={this.props.post.user}/>
        <div className="spacer"></div>
      </div>
    )
  }
}

export default Follow