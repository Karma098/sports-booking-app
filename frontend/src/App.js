import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage";
// import LoginPage from "./pages/Auth/LoginPage"; // Placeholder for later
import store from "./store"; // Import the store

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
