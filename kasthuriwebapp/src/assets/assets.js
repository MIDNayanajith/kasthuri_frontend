// assets.js
import hero from "./hero.png";
import logo from "./logo.jpeg";
import {
  LayoutDashboard,
  Users,
  MapPin,
  DollarSign,
  Truck,
  CalendarCheck,
  Wrench,
  UserCog,
} from "lucide-react";
export const assets = {
  hero,
  logo,
};
export const SIDE_BAR_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Drivers",
    icon: Users,
    path: "/drivers",
  },
  {
    id: "03",
    label: "Transport",
    icon: MapPin,
    path: "/transports",
  },
  {
    id: "04",
    label: "Vehicles",
    icon: Truck,
    children: [
      { label: "Own Vehicles", path: "/ownvehicles" },
      { label: "Ex Vehicles", path: "/exvehicles" },
    ],
  },
  {
    id: "05",
    label: "Finance",
    icon: DollarSign,
    children: [
      { label: "Invoice", path: "/invoice" },
      { label: "Payments", path: "/payments" },
      { label: "Advance", path: "/advance" },
      { label: "Fuel", path: "/fuel" },
    ],
  },
  {
    id: "06",
    label: "Attendance",
    icon: CalendarCheck,
    path: "/attendance",
  },
  {
    id: "07",
    label: "Maintenance",
    icon: Wrench,
    children: [
      { label: "Tire Maintenance", path: "/tire_maintenance" },
      { label: "Other Maintenance", path: "/other_maintenance" },
    ],
  },
  {
    id: "08",
    label: "Users",
    icon: UserCog,
    path: "/users",
  },
];
