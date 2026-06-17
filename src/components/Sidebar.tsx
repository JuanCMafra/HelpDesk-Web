import ListIcon from "../assets/icons/list.svg?react";
import CloseIcon from "../assets/icons/x.svg?react";

import logoSvg from "../assets/Logo_IconLight.svg";
import profileIcon from "../assets/icons/profile.svg";
import exitIcon from "../assets/icons/get-out.svg";

import clsx from "clsx";

import type { SidebarLink } from "../types/sidebar-links";
import { useState } from "react";
import { NavLink } from "react-router";

import { Profile } from "./Profile";
import { useAuth } from "../hooks/useAuth";

type SidebarProps = {
  links: SidebarLink[] | undefined;
  setProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ links, setProfile }: SidebarProps) {
  const auth = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  function closeAllMenus() {
    setIsOptionOpen(false);
    setIsMenuOpen(false);
  }

  function getUserRole(role?: string | undefined) {
    if (role === "customer" || null || undefined) {
      return "CLIENTE";
    }
    if (role === "technician") {
      return "TÉCNICO";
    }
    if (role === "admin") {
      return "ADMIN";
    }
  }

  return (
    <div className="w-full flex justify-between p-6 md:p-0 md:m-0 md:flex-col md:w-auto">
      <div className="gap-5">
        <header className="flex gap-4 md:py-6 md:px-5 md:min-w-50 md:border-b md:border-gray-200">
          <button
            className="cursor-pointer md:hidden transition-transform duration-500"
            onClick={() => {
              if (isMenuOpen || isOptionOpen) {
                return closeAllMenus();
              } else {
                setIsMenuOpen(true);
              }
            }}
          >
            <div className="bg-gray-200 max-w-10 p-2.5 max-h-10 rounded-md flex justify-center items-center md:hidden ">
              {isMenuOpen || isOptionOpen ? (
                <CloseIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <ListIcon className="w-5 h-5" />
              )}
            </div>
          </button>

          <div className="flex justify-center md:p-0 items-center gap-3 max-h-11">
            <img className="w-11 h-auto" src={logoSvg} alt="" />
            <div className="flex flex-col">
              <h1 className="text-lg text-gray-600">HelpDesk</h1>
              <span className="text-blue-light text-xxs uppercase">
                {getUserRole(auth.session?.user.role)}
              </span>
            </div>
          </div>
        </header>

        <nav className="hidden md:flex md:flex-col md:items-stretch md:px-4 md:gap-1 md:mt-5">
          {links?.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    "flex gap-3 p-3 rounded-lg transition text-sm",
                    isActive
                      ? "bg-blue-dark text-gray-600"
                      : "hover:bg-gray-200 hover:opacity-100 opacity-50",
                  )
                }
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex gap-3 md:py-5 md:px-4 md:border-t md:border-gray-200">
        <button
          onClick={() => {
            if (isOptionOpen) {
              closeAllMenus();
            } else {
              setIsMenuOpen(false);
              setIsOptionOpen(true);
            }
          }}
        >
          <div className="h-10 w-10 flex items-center justify-center bg-blue-dark rounded-full text-sm leading-none tracking-wider cursor-pointer">
            <Profile
              avatar={auth.session?.user.avatar}
              name={auth.session?.user.name}
              variants="xlg"
            />
          </div>
        </button>

        <div className="hidden md:flex md:flex-col">
          <h2 className="text-sm text-gray-600">{auth.session?.user.name}</h2>
          <span className="text-xs text-gray-400">
            {auth.session?.user.email}
          </span>
        </div>
      </div>

      {
        <div
          className={clsx(
            "fixed inset-x-0 h-full flex justify-center inset-y-23 rounded-t-2xl bg-black/40 z-50 md:hidden transition-opacity duration-450",
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          onClick={() => closeAllMenus()}
        >
          <aside
            className={clsx(
              "bg-gray-100 min-w-87 h-min py-4 px-5 flex flex-col justify-end mt-2 rounded-xl gap-4 transition-transform duration-500",
              isMenuOpen
                ? " translate-y-0 opacity-100"
                : " -translate-y-full opacity-0",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xxs uppercase text-gray-400">menu</span>

            <nav className="flex flex-col gap-1">
              {links?.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center justify-self-center-safe gap-3 p-3 rounded-lg transition text-sm",
                        isActive
                          ? "bg-blue-dark text-gray-600"
                          : "hover:bg-gray-200 hover:opacity-100 opacity-50",
                      )
                    }
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      }

      {
        <div
          className={clsx(
            "fixed inset-x-0 h-full flex justify-center inset-y-23 rounded-t-2xl bg-black/40 z-50 transition-opacity duration-450 md:inset-y-0 md:justify-start md:bg-transparent",
            isOptionOpen
              ? "opacity-100 pointer-events-auto bg-black/40"
              : "opacity-0 pointer-events-none bg-black/0",
          )}
          onClick={() => closeAllMenus()}
        >
          <aside
            className={clsx(
              "bg-gray-100 min-w-87 h-min mt-2 py-4 px-5 flex flex-col rounded-xl gap-4 transition-all duration-450 ease-in-out md:min-w-49.5 md:absolute md:bottom-2 md:left-52 md:mt-0",
              isOptionOpen
                ? "translate-y-0 opacity-100 md:scale-100"
                : "-translate-y-full opacity-0 md:translate-y-2 md:scale-95",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xxs uppercase text-gray-400">opções</span>

            <ul>
              <li
                className="flex items-center gap-2 py-2.25 text-gray-500 hover:opacity-70 cursor-pointer transition"
                onClick={() => {
                  setIsOptionOpen(false);
                  setProfile(true);
                }}
              >
                <img src={profileIcon} className="w-5 h-5" alt="" />

                <span>Perfil</span>
              </li>

              <li
                className="flex items-center gap-2 py-2.25 text-feedback-danger transition duration-300 hover:brightness-200 cursor-pointer"
                onClick={() => auth.remove()}
              >
                <img src={exitIcon} className="w-5 h-5" alt="" />

                <span>Sair</span>
              </li>
            </ul>
          </aside>
        </div>
      }
    </div>
  );
}
