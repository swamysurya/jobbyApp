import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoLocationSharp} from 'react-icons/io5'
import {FaExternalLinkAlt, FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import SimilarJobCard from '../SimilarJobCard'
import SkillCard from '../SkillCard'

import Header from '../Header'
import './index.css'

const apiUrlConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class JobDetails extends Component {
  state = {
    apiUrlStatus: apiUrlConstants.initial,
    jobDetailsobj: {},
  }

  componentDidMount() {
    this.getJobDetails()
  }

  toCamelCase = str =>
    str.replace(/([-_][a-z])/gi, $1 =>
      $1.toUpperCase().replace('-', '').replace('_', ''),
    )

  convertToCamelCase = obj => {
    const newObj = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = this.toCamelCase(key)
        const value = obj[key]
        if (
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          newObj[newKey] = this.convertToCamelCase(value)
        } else if (Array.isArray(value)) {
          newObj[newKey] = value.map(item =>
            typeof item === 'object' ? this.convertToCamelCase(item) : item,
          )
        } else {
          newObj[newKey] = value
        }
      }
    }
    return newObj
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    this.setState({apiUrlStatus: apiUrlConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.convertToCamelCase(fetchedData)
      this.setState({
        jobDetailsobj: updatedData,
        apiUrlStatus: apiUrlConstants.success,
      })
    } else {
      this.setState({apiUrlStatus: apiUrlConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  successView = () => {
    const {jobDetailsobj} = this.state
    const {jobDetails, similarJobs} = jobDetailsobj
    return (
      <div className="job-details">
        <div className="job-card">
          <div className="logo-job-star-container">
            <img
              className="company-image"
              alt="job details company logo"
              src={jobDetails.companyLogoUrl}
            />
            <div className="job-star-container">
              <h1>{jobDetails.title}</h1>
              <div className="star-container">
                <FaStar className="star" />
                <p className="rating-para">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="loc-jobtype-container">
            <div className="loc-job-lpa-container">
              <div className="loc-job-container">
                <IoLocationSharp />
                <p>{jobDetails.location}</p>
              </div>
              <div className="loc-job-container">
                <BsBriefcaseFill />
                <p>{jobDetails.employmentType}</p>
              </div>
            </div>
            <p className="lpa-heading">{jobDetails.packagePerAnnum}</p>
          </div>
          <hr />
          <div className="des">
            <h1 className="description-heading">description</h1>
            <a href={jobDetails.companyWebsiteUrl} target="_blank">
              <FaExternalLinkAlt />
              Visit
            </a>
          </div>
          <p className="description-para">{jobDetails.jobDescription}</p>
          <h1 className="description-heading">Skills</h1>
          <ul className="skills-container">
            {jobDetails.skills.map(eachskills => (
              <SkillCard key={eachskills.name} skillDetails={eachskills} />
            ))}
          </ul>
          <h1 className="description-heading">Life at Company</h1>
          <div className="life-style-container">
            <p className="description-para">
              {jobDetails.lifeAtCompany.description}
            </p>
            <img
              src={jobDetails.lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-comapy-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="simailar-jobs-container">
          {similarJobs.map(eachJob => (
            <SimilarJobCard
              jobDetails={eachJob}
              key={eachJob.id}
              className="jobCard"
            />
          ))}
        </ul>
      </div>
    )
  }

  handleRetryBtn = () => {
    this.getJobDetails()
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" type="button" onClick={this.handleRetryBtn}>
        Retry
      </button>
    </div>
  )

  renderViews = () => {
    const {apiUrlStatus} = this.state
    switch (apiUrlStatus) {
      case apiUrlConstants.loading:
        return this.renderLoadingView()
      case apiUrlConstants.success:
        return this.successView()
      case apiUrlConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        {this.renderViews()}
      </div>
    )
  }
}

export default JobDetails
