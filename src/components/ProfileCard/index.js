import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiUrlConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

const apiprofileUrl = 'https://apis.ccbp.in/profile'

class ProfileCard extends Component {
  state = {
    apiUrlStatus: apiUrlConstants.initial,
    profileData: {},
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({apiUrlStatus: apiUrlConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiprofileUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedData,
        apiUrlStatus: apiUrlConstants.success,
      })
    } else {
      this.setState({apiUrlStatus: apiUrlConstants.failed})
    }
  }

  handleretry = () => {
    this.getProfile()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <button
        type="button"
        className="retry-btn-ele"
        onClick={this.handleretry}
      >
        retry
      </button>
    </div>
  )

  succssProfileView = () => {
    const {profileData} = this.state
    return (
      <div className="profile-card-container">
        <img src={profileData.profileImageUrl} alt={profileData.name} />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderView = () => {
    const {apiUrlStatus} = this.state
    switch (apiUrlStatus) {
      case apiUrlConstants.loading:
        return this.renderLoadingView()
      case apiUrlConstants.success:
        return this.succssProfileView()
      case apiUrlConstants.failed:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderView()}</>
  }
}

export default ProfileCard
