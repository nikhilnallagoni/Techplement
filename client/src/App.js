import logo from "./logo.svg";
import "./App.css";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Renamed to BrowserRouter
import UserContextProvider from "./Pages/UserContext";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
          </Routes>
        </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
