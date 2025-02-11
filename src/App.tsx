import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HelpPage from "./pages/HelpPage";
import PostForm from "./pages/PostForm";
import UserPosts from "./pages/UserPosts";
import { ToastContainer } from "react-toastify";
import { AuthenticationProvider } from "./context/auth";
import "react-toastify/dist/ReactToastify.css";
import AllPosts from "./pages/AllPosts";

const queryClient = new QueryClient();

const contextClass = {
  success: "dark:bg-zinc-800 bg-zinc-50 text-zinc-500 dark:text-zinc-50",
  error: "bg-red-50 text-zinc-900",
  info: "dark:bg-zinc-800 dark:text-zinc-50 bg-zinc-50 text-zinc-900",
  warning: "bg-orange-400 dark:bg-orange-200 dark:text-zinc-600",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          toastClassName={(context) =>
            contextClass[context?.type || "default"] +
            "relative flex min-h-10 p-6 rounded-md justify-between overflow-hidden cursor-pointer"
          }
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
        />
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<AllPosts />} />
              <Route path='/newPost' element={<PostForm />} />
              <Route path='/ask4help' element={<HelpPage />} />
              <Route path='/myPosts' element={<UserPosts />} />
            </Route>
          </Routes>
        </Router>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

export default App;
