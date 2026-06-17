import AddIcon from "../assets/icons/add.svg?react";
import DocIcon from "../assets/icons/doc.svg?react";
import TechIcon from "../assets/icons/users.svg?react";
import BagIcon from "../assets/icons/bag.svg?react";
import ServicesIcon from "../assets/icons/maintenance.svg?react";

import type { SidebarLink } from "../types/sidebar-links";

export const sidebarLinks: Record<UserAPIRole, SidebarLink[]> = {
  customer: [
    {
      label: "Meus chamados",
      path: "/",
      icon: DocIcon,
    },
    {
      label: "Novo chamado",
      path: "/newTicket",
      icon: AddIcon,
    },
  ],

  technician: [
    {
      label: "Meus chamados",
      path: "/",
      icon: DocIcon,
    },
  ],

  admin: [
    {
      label: "Chamados",
      path: "/",
      icon: DocIcon,
    },
    {
      label: "Técnicos",
      path: "/technician",
      icon: TechIcon,
    },
    {
      label: "Clientes",
      path: "/customers",
      icon: BagIcon,
    },
    {
      label: "Serviços",
      path: "/services",
      icon: ServicesIcon,
    },
  ],
};
