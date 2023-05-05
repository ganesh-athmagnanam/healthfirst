import { Link } from 'react-router-dom';
const LandingPage = () => {
    return (
        <div className="land">
            
            <Link to="/enroll"><button className="corner-button" style={{animationDelay:"1000ms"}}><span >Hospital Enrollment</span></button></Link>
            <Link to="/hospitalLogin"><button className="corner-button" style={{animationDelay:"2000ms",marginLeft:"15px",marginTop:"15px"}}><span >Hospital Login</span></button></Link><br />
            <Link to="/hospitalSearch"><button className="corner-button" style={{animationDelay:"3000ms",marginTop:"15px"}}><span >Search for Hospital</span></button></Link>
        </div>
    )
}
export default LandingPage;