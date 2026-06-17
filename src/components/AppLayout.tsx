import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { sidebarLinks } from "../utils/SidebarLinks";
import { useAuth } from "../hooks/useAuth";
import { useMemo, useState } from "react";
import { EditProfile } from "./EditProfile";

export function AppLayout() {
  const [profile, setProfile] = useState(false);
  const auth = useAuth();
  const role = auth.session?.user.role;
  const currentLinks = useMemo(() => {
    return role ? sidebarLinks[role] : [];
  }, [role]);

  return (
    <div className="bg-gray-100 w-screen overflow-hidden h-screen p-0 m-0 md:pt-3 box-border">
      <main className="w-full md:overflow-y-hidden overflow-x-auto h-full flex flex-col text-gray-600 md:flex-row p-0 m-0 ">
        <Sidebar links={currentLinks} setProfile={setProfile} />
        <div className="flex flex-1 overflow-auto md:h-full w-full no-scrollbar bg-gray-600 rounded-t-2xl md:rounded-tl-2xl pt-7 pb-6 px-6 md:p-0">
          <div className="flex flex-1 w-full h-auto md:pt-13 md:pb-12 md:px-12">
            <Outlet />
          </div>
        </div>
      </main>

      <EditProfile profile={profile} setProfile={setProfile}/>
    </div>
  );
}
