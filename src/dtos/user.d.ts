 type UserAPIRole = "customer" | "technician" | "admin";
 
 type UserAPIResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserAPIRole;
    avatar: string;
    technician: {
      active: boolean;
      availability: string[]
    }
  };
};

 type TechnicianProfile = {
  id: string;
  avatar: string;
  active: boolean;
  availability?: string[];
  name: string;
  email: string
};
