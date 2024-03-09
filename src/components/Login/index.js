import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const apiLoginUrl = 'https://apis.ccbp.in/login'

class Login extends Component {
  state = {
    inputUserValue: '',
    inputPasswordValue: '',
    isLoginFailure: false,
    errorMsg: '',
  }

  renderInputEle = (
    inputType,
    inputValue,
    label,
    placeHolder,
    onChangeUserName,
  ) => (
    <div className="input-container">
      <label className="label-style" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type={inputType}
        value={inputValue}
        placeholder={placeHolder}
        className="input-element-style"
        onChange={onChangeUserName}
      />
    </div>
  )

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 20,
    })
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitLoginCreditials = async event => {
    event.preventDefault()
    const {inputUserValue, inputPasswordValue} = this.state
    const loginCreditials = {
      username: inputUserValue,
      password: inputPasswordValue,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(loginCreditials),
    }

    const response = await fetch(apiLoginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        isLoginFailure: false,
        inputUserValue: '',
        inputPasswordValue: '',
      })
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.setState({
        isLoginFailure: true,
        inputUserValue: '',
        inputPasswordValue: '',
      })
      this.onLoginFailure(data.error_msg)
    }
  }

  failureMessage = () => {
    const {errorMsg} = this.state
    return <p className="error-message">*{errorMsg}</p>
  }

  render() {
    const {inputUserValue, inputPasswordValue, isLoginFailure} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) return <Redirect to="/" />

    return (
      <div className="loginContainer">
        <div className="login-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form
            className="form-container"
            onSubmit={this.onSubmitLoginCreditials}
          >
            {this.renderInputEle(
              'text',
              inputUserValue,
              'USERNAME',
              'Username',
              e => {
                this.setState({inputUserValue: e.target.value})
              },
            )}
            {this.renderInputEle(
              'password',
              inputPasswordValue,
              'PASSWORD',
              'password',
              e => {
                this.setState({inputPasswordValue: e.target.value})
              },
            )}
            <button type="submit" className="login-button-style">
              Login
            </button>
          </form>
          {isLoginFailure && this.failureMessage()}
        </div>
      </div>
    )
  }
}

export default Login
