import {Link, withRouter} from 'react-router-dom'
import {IoMdHome} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    console.log(history)
    history.replace('/login')
  }

  const renderNavElements = () => (
    <ul className="nav-items-container">
      <li>
        <Link to="/" className="list-element1">
          Home
        </Link>
      </li>
      <li>
        <Link to="/jobs" className="list-element1">
          Jobs
        </Link>
      </li>
    </ul>
  )

  const renderLogoutBtnEle = () => (
    <button className="logout-button" type="button" onClick={onClickLogout}>
      Logout
    </button>
  )

  const renderNavIconsContainer = () => (
    <ul className="nav-list-icons-container">
      <li>
        <Link to="/" className="nav-icon-element">
          <IoMdHome />
        </Link>
      </li>
      <li>
        <Link to="/jobs" className="nav-icon-element">
          <BsBriefcaseFill />
        </Link>
      </li>
      <li>
        <button
          className="logout-icon"
          type="button"
          aria-label="logout"
          onClick={onClickLogout}
        >
          <FiLogOut />
        </button>
      </li>
    </ul>
  )

  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      {renderNavElements()}
      {renderLogoutBtnEle()}
      {renderNavIconsContainer()}
    </nav>
  )
}

export default withRouter(Header)
