import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./pages/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HelpPage from "./pages/HelpPage";
import PostForm from "./pages/PostFormPage";
import UserPosts from "./pages/UserPosts";
import { ToastContainer } from "react-toastify";
import { AuthenticationProvider } from "./context/auth";
import "react-toastify/dist/ReactToastify.css";
import AllPosts from "./pages/AllPosts";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
        />
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Navigate to='/feed' replace />} />
              <Route path='/feed' element={<AllPosts />} />
              <Route path='/newPost' element={<PostForm />} />
              <Route path='/ask4help' element={<HelpPage />} />
              <Route path='/myPosts' element={<UserPosts />} />
              <Route path='/settings' element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

export default App;
