import { Outlet } from "react-router";

import logoSvg from "../assets/Logo_IconDark.svg";

export function AuthLayout() {
  return (
    <div className="w-screen h-screen bg-image pt-8 md:pt-6 md:flex md:justify-end ">
      <main className="bg-gray-600 h-full w-full py-8 px-6 flex flex-col items-center rounded-t-lg md:pt-12 md:px-36 md:pb-12 md:rounded-tl-lg md:rounded-r-none md:max-w-170 overflow-y-auto no-scrollbar">
        <div className="flex gap-3 items-center text-blue-dark text-xl pb-6 md:pb-8 ">
          <img src={logoSvg} alt="Logo" className="w-10" />
          <span>HelpDesk</span>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
