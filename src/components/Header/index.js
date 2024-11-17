import {Link} from 'react-router-dom'
import { handleSuccess } from '../utils';
import {FiLogOut} from 'react-icons/fi'
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './index.css'

const Header = props => {
    const navigate = useNavigate();
    const name = localStorage.getItem('loggedInUser')
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout')
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

  return (
    <div>
        <ul className="header-cont">
        <Link to="/update-profile" className="nav-link">
            <li className='user-list'>
                <img
                    src="https://cdn.pixabay.com/photo/2023/08/17/16/49/logo-8197007_1280.png"
                    alt="website logo"
                    className="logo"
                />
                <div className='welcome-cont'>
                    <p className='name'>Hii, <span  style={{ color: '#24822ce2' }}>{name}</span> 👋</p>
                    <p className='welcome'><span style={{ color: 'blue' }}>Welcome!</span> Each task brings you closer to your goals.</p>

                </div>
            </li>
        </Link>
        <li>
            <button className="logout-btn" type="button" onClick={handleLogout}>
            Logout
            </button>
            <FiLogOut className="nav-icon" onClick={handleLogout} />
        </li>
        </ul>
        <ToastContainer />
    </div>
  )
}

export default Header