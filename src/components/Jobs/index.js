import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobCard from '../JobCard'
import ProfileCard from '../ProfileCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiUrlConstants = {
  intial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    apiUrlStatus: apiUrlConstants.intial,
    inputSearchValue: '',
    activesalaryID: '',
    activeEmpolymentTypeCheckBoxArray: [],
    jobsList: [],
    totalJobs: 0,
  }

  componentDidMount() {
    this.getJobs()
  }

  onChangeSearchInput = event => {
    this.setState({inputSearchValue: event.target.value})
  }

  onPreformSearch = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  getJobs = async () => {
    const {
      inputSearchValue,
      activeEmpolymentTypeCheckBoxArray,
      activesalaryID,
    } = this.state
    this.setState({apiUrlStatus: apiUrlConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const employmentType = activeEmpolymentTypeCheckBoxArray.join(',')
    console.log(employmentType)
    const apiJobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activesalaryID}&search=${inputSearchValue}`
    const response = await fetch(apiJobsUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        jobs: fetchedData.jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        })),
        total: fetchedData.total,
      }
      this.setState({
        jobsList: updatedData.jobs,
        totalJobs: updatedData.total,
        apiUrlStatus: apiUrlConstants.success,
      })
    } else {
      this.setState({apiUrlStatus: apiUrlConstants.failure})
    }
  }

  renderSearchEle = () => {
    const {inputSearchValue} = this.state
    return (
      <div className="jobs-search-input-container">
        <input
          value={inputSearchValue}
          className="jobs-search-input-style"
          placeholder="Search"
          type="search"
          onChange={this.onChangeSearchInput}
          onKeyPress={this.onPreformSearch}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-btn-element"
          onClick={this.perfomSearch}
          aria-label="search"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  handleEmploymentCheckBox = event => {
    const {activeEmpolymentTypeCheckBoxArray} = this.state
    if (activeEmpolymentTypeCheckBoxArray.includes(event.target.value)) {
      const deleteValueIndex = activeEmpolymentTypeCheckBoxArray.indexOf(
        event.target.value,
      )
      activeEmpolymentTypeCheckBoxArray.splice(deleteValueIndex, 1)
      this.setState(
        prevState => ({
          activeEmpolymentTypeCheckBoxArray:
            prevState.activeEmpolymentTypeCheckBoxArray,
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          activeEmpolymentTypeCheckBoxArray: [
            ...prevState.activeEmpolymentTypeCheckBoxArray,
            event.target.value,
          ],
        }),
        this.getJobs,
      )
    }
  }

  handleSalaryRadio = event => {
    this.setState({activesalaryID: event.target.value}, this.getJobs)
  }

  renderEmploymentFilterList = listObj => {
    const {activeEmpolymentTypeCheckBoxArray} = this.state
    return (
      <div className="employment-type-container">
        <h1 className="type-of-employment-heading">Type of Employment</h1>
        <ul className="ul-container">
          {listObj.map(eachObj => (
            <div className="list-element" key={eachObj.employmentTypeId}>
              <label>
                <input
                  type="checkbox"
                  value={eachObj.employmentTypeId}
                  checked={activeEmpolymentTypeCheckBoxArray.includes(
                    eachObj.employmentTypeId,
                  )}
                  onChange={this.handleEmploymentCheckBox}
                />
                {eachObj.label}
              </label>
            </div>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryFilterList = listObj => {
    const {activesalaryID} = this.state
    return (
      <div className="employment-type-container">
        <h1 className="type-of-employment-heading">Salary Range</h1>
        <ul className="ul-container">
          {listObj.map(eachObj => (
            <div className="list-element" key={eachObj.salaryRangeId}>
              <label>
                <input
                  onChange={this.handleSalaryRadio}
                  type="radio"
                  value={eachObj.salaryRangeId}
                  checked={activesalaryID === eachObj.salaryRangeId}
                />
                {eachObj.label}
              </label>
            </div>
          ))}
        </ul>
      </div>
    )
  }

  profleAndFilterSection = () => (
    <div className="filter-and-profile-section">
      <ProfileCard />
      <hr />
      {this.renderEmploymentFilterList(employmentTypesList)}
      <hr />
      {this.renderSalaryFilterList(salaryRangesList)}
    </div>
  )

  renderLoader = () => (
    <div className="loader-container1" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  perfomSearch = () => {
    this.getJobs()
  }

  renderSearchEle1 = () => {
    const {inputSearchValue} = this.state
    return (
      <div className="jobs-search-input-container1">
        <input
          value={inputSearchValue}
          className="jobs-search-input-style"
          placeholder="Search"
          type="search"
          onChange={this.onChangeSearchInput}
          onKeyPress={this.onPreformSearch}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-btn-element"
          onClick={this.perfomSearch}
          aria-label="search"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobsCards = () => {
    const {jobsList, totalJobs} = this.state
    if (totalJobs === 0) {
      return (
        <div className="no-jobs-container">
          <img
            className="no-jobs-image"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-para">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <div className="searh-job-container">
        <ul className="jobs-list-ul-container">
          {jobsList.map(eachJob => (
            <Link
              to={`/jobs/${eachJob.id}`}
              className="link-details-style"
              key={eachJob.id}
            >
              <JobCard jobDetails={eachJob} />
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  handleRetryBtn = () => this.getJobs()

  renderFailureView = () => (
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

  renderJobsList = () => {
    const {apiUrlStatus} = this.state

    switch (apiUrlStatus) {
      case apiUrlConstants.loading:
        return this.renderLoader()
      case apiUrlConstants.success:
        return this.renderJobsCards()
      case apiUrlConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />
        <div className="filter-list-container">
          {this.renderSearchEle()}
          {this.profleAndFilterSection()}
          <div className="search-and-job-list-container">
            {this.renderSearchEle1()}
            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
