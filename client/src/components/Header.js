import { useState, useEffect } from 'react';
import '../styles/Header.css';

import { Link, useNavigate } from 'react-router-dom'


const Header = () => {
  const [loginUser, setLoginUser] = useState('')
  const navigate = useNavigate();
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('user'))
    if (storedData && storedData.user) {
      setLoginUser(storedData.user) 
    }
  }, [])

  const logoutHandler = () =>{
    localStorage.removeItem('user')
    navigate("/login")
  }

  return (
    <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Expense-Manager</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item d-flex align-items-center me-3">
                  <i className="bi bi-person-circle me-2" style={{ fontSize: '1.2rem' }}></i>
                  <span className="nav-link mb-0">{loginUser && loginUser.username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-primary" onClick={logoutHandler}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    </>
  )
}

export default Header