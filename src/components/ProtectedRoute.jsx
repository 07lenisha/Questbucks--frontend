import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props) {
  const { data } = useSelector((state) => state.users);
console.log("ProtectedRoute user data:", data);
  
  if (!data.role) {
    return <Navigate to="/login" />;
  }

 
  if (data.role === "company" && data.subscription_status !== "active") {
    return <Navigate to="/subscribe" />;
  }


  
  if (props.roles.includes(data.role)) {
    return props.children;
  } else {
    return <Navigate to="/unauthorized" />;
  }
}
