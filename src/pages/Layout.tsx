import { Outlet } from "react-router-dom";
import "../index.css";
import Nav from "../components/custom-ui/Nav";
import Sidebar from "../components/custom-ui/Sidebar";

export default function Layout() {
  return (
    <div className='max-h-dvh w-full flex flex-col relative overflow-y-scroll no-scrollbar'>
      <Nav />
      <main className={`flex flex-row w-full min-h-full`}>
        <Sidebar />
        <Outlet />
      </main>
    </div>
  );
}
