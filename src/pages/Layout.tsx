import { Outlet } from "react-router-dom";
import "../index.css";
import Nav from "../components/custom-ui/Nav";
import Sidebar from "../components/custom-ui/Sidebar";
import LoginModal from "../components/custom-ui/LoginModal";
import { useState } from "react";

export default function Layout() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  function handleLoginOpen() {
    setIsLoginOpen(!isLoginOpen);
  }

  return (
    <div className='max-h-dvh w-screen flex flex-col relative overflow-y-scroll no-scrollbar cursor-default px-5'>
      <Nav setLoginOpen={handleLoginOpen} />
      <main
        className={`flex flex-row flex-grow w-full min-h-full overflow-hidden`}
      >
        <LoginModal isOpen={isLoginOpen} handleOpen={handleLoginOpen} />
        <Sidebar />
        <Outlet />
      </main>
    </div>
  );
}
