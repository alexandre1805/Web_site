import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Dashboard(props) {
    const [isLoading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
  
    useEffect(() => {
      axios.get("http://localhost:4000/verifToken", { withCredentials: true }).then(response => {
        if(response.data.message === "OK")
            setAuthorized(true);
        setLoading(false);   
      });
    }, []);
  
    if (isLoading) {
      return <div className="App">Loading...</div>;
    }

    if(!authorized)
        return <Navigate to="/login"/>
  
    return (
        <div className="Dashboard">
            Welcome to our dashboard !
        </div>
    )

}

export default Dashboard