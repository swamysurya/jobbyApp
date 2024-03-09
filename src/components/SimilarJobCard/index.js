import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  return (
    <div className="job-card-container1">
      <div className="logo-job-star-container">
        <img
          className="company-image"
          alt="similar job company logo"
          src={jobDetails.companyLogoUrl}
        />
        <div className="job-star-container">
          <h1 className="job-title">{jobDetails.title}</h1>
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
      </div>
      <hr />
      <h1 className="description-heading">description</h1>
      <p className="description-para">{jobDetails.jobDescription}</p>
    </div>
  )
}

export default SimilarJobCard
