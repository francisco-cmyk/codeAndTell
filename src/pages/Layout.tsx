import { Outlet } from "react-router-dom";
import "../index.css";
import Nav from "../components/custom-ui/Nav";
import Sidebar from "../components/custom-ui/Sidebar";

export default function Layout() {
  return (
    <div className='max-h-dvh w-screen flex flex-col relative overflow-y-scroll no-scrollbar cursor-default px-5'>
      <Nav />
      <main
        className={`flex flex-row flex-grow w-full min-h-full overflow-hidden`}
      >
        <Sidebar />
        <Outlet />
      </main>
    </div>
  );
}
