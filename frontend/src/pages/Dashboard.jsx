import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
        <div>
            <button onClick={() => navigate("/signup")}>SignUp</button> <br/>
            <button onClick={() => navigate("/login")}>Login</button> <br />
        </div>
    </>
  )
}

export default Dashboard