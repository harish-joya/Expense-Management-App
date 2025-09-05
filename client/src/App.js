import "antd/dist/reset.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css"; 


function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <Routes>
          <Route path="/"element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;