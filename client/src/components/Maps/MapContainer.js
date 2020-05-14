import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
// import { GET_POSTS } from '../../api/postAPI'


class MapContainer extends React.Component {

  state = { 
    posts: [],
     lat: null,
     lng: null,
     errorMessage: ''
     }

    
  // getSports = async () => {
  //   try {
  //     let postsFromDb = await GET_POSTS()
  //     console.log(postsFromDb, 'postsFromDb')
  //     this.setState({ posts: postsFromDb })
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }

  componentDidMount(){
    this.getSports()
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ 
          lat: position.coords.latitude,
          lng: position.coords.longitude 
      })
      },
       err => {
         this.setState({ errorMessage: err.message })
       }
    )
  }

  renderMap(){

    const style = {
      width: '100%',
      height: '100%'
    }
    const containerStyle = {
      position: 'relative',  
      width: '100%',
      height: '300px'
    }

    if(this.state.errorMessage){
      return <div>Error message: {this.state.errorMessage}</div>
    } 

    if(!this.state.errorMessage && this.state.lat && this.state.lng) {
        return <Map 
        google={this.props.google} 
        containerStyle={containerStyle}
        style={style}
        zoom={4}
        initialCenter={{
            lat: this.state.lat,
            lng: this.state.lng
          }}>
          {this.state.posts && this.state.posts.map(post => {
            return  <Marker 
            title={'The marker`s title will appear as a tooltip.'}
            key={post._id}  
            position={{ lat: post.location.coordinates.lat, lng: post.location.coordinates.lng }} />
          })}
        </Map>
    } 

    return <p>Loading..</p>
  }

  // renderPosts(){
  //    if(this.state.posts){
  //      return <div>
  //        {this.state.posts.map(post => {
  //          return <div>
  //            <p>{post.content}</p>
  //          </div>
  //        })}
  //      </div>
  //    }
  // }

  render(){
    return (
      <div>
        <div>
        { this.renderMap() }
        </div>
        <div>
        { this.renderPosts() }
        </div>
  
        </div>
      );
  }
}
 
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API
})(MapContainer)

