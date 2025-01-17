import "./App.css";
import { DarkModeProvider } from "./context/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Feed from "./components/custom-ui/Feed";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import NewPost from "./pages/NewPost";
=======
import HelpPage from "./pages/HelpPage";
import PostForm from "./pages/PostForm";
import UserPosts from "./pages/UserPosts";
import SignUp from "./pages/SignUp";
>>>>>>> main

const queryClient = new QueryClient();

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<SignUp />} />

            <Route path='/' element={<Layout />}>
              <Route index element={<Feed />} />
<<<<<<< HEAD
              <Route path='login' element={<Login />} />
              <Route path='submit' element={<NewPost />} />
              {/* <Route path='nameOfPage' element={<CustomPage />} /> */}
=======
              <Route path='/createPost' element={<PostForm />} />
              <Route path='/ask4help' element={<HelpPage />} />
              <Route path='/myPosts' element={<UserPosts />} />
>>>>>>> main
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;

{
  /* <Route path='nameOfPage' element={<CustomPage />} /> */
}
