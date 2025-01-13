import "./App.css";
import { DarkModeProvider } from "./context/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Feed from "./components/custom-ui/Feed";
import Login from "./pages/Login";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path='login' element={<Login />} />
            {/* <Route path='nameOfPage' element={<CustomPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
