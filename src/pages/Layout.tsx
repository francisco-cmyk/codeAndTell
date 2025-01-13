import { Outlet } from "react-router-dom";
import "../index.css";
import Nav from "../components/custom-ui/Nav";

export default function Layout() {
  return (
    <div className='sm:min-h-screen min-h-dvh w-screen flex flex-col relative '>
      <Nav />
      <main className={`w-full min-h-full `}>
        <Outlet />
      </main>
    </div>
  );
}
