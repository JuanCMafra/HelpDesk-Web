type TicketStatus = "open" | "in_progress" | "close";

type TicketProps = {
  updated_at: string;
  created_at: string;
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  status: TicketStatus;
  service: {
    id: string;
    title: string;
    price: number;
    type: "base" | "additional";
  }[];
  total: number;
  base_value: number;
  additional_value: number;
  additional_services: {
    title: string;
    price: number;
  }[];
  technician: {
    name: string;
    avatar: string;
    email: string;
  };
  client: {
    name: string;
    avatar: string;
    email: string;
  };
};
