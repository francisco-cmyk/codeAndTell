import "./App.css";
import { DarkModeProvider } from "./context/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Feed from "./components/custom-ui/Feed";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Feed />} />
              <Route path='login' element={<Login />} />
              {/* <Route path='nameOfPage' element={<CustomPage />} /> */}
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
