export const BASE_URL = "http://localhost:8080/api/v1.0/";
const CLOUDINARY_CLOUD_NAME = "dmogz38bw";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_ALL_USERS: "/users",
  GET_USER_INFO: "/user-info",
  UPDATE_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,

  // Driver endpoints
  GET_ALL_DRIVERS: "/drivers",
  ADD_DRIVER: "/drivers",
  UPDATE_DRIVER: (id) => `/drivers/${id}`,
  DELETE_DRIVER: (id) => `/drivers/${id}`,

  // Own Vehicles endpoints
  GET_ALL_OWN_VEHICLES: "/own-vehicles",
  ADD_OWN_VEHICLE: "/own-vehicles",
  UPDATE_OWN_VEHICLE: (id) => `/own-vehicles/${id}`,
  DELETE_OWN_VEHICLE: (id) => `/own-vehicles/${id}`,

  // Ex Vehicles endpoints
  GET_ALL_EX_VEHICLES: "/ex-vehicles",
  ADD_EX_VEHICLE: "/ex-vehicles",
  UPDATE_EX_VEHICLE: (id) => `/ex-vehicles/${id}`,
  DELETE_EX_VEHICLE: (id) => `/ex-vehicles/${id}`,
  MAKE_PAYMENT: (id) => `/ex-vehicles/${id}/make-payment`,
  DOWNLOAD_EX_VEHICLES_EXCEL: "/excel/download/ex-vehicles",

  // Maintenance endpoints
  GET_ALL_MAINTENANCE: "/maintenance",
  ADD_MAINTENANCE: "/maintenance",
  UPDATE_MAINTENANCE: (id) => `/maintenance/${id}`,
  DELETE_MAINTENANCE: (id) => `/maintenance/${id}`,
  DOWNLOAD_MAINTENANCE_EXCEL: "/excel/download/maintenance",

  // Tire Maintenance endpoints
  GET_ALL_TIRE_MAINTENANCE: "/tire-maintenance",
  ADD_TIRE_MAINTENANCE: "/tire-maintenance",
  UPDATE_TIRE_MAINTENANCE: (id) => `/tire-maintenance/${id}`,
  DELETE_TIRE_MAINTENANCE: (id) => `/tire-maintenance/${id}`,
  DOWNLOAD_TIRE_MAINTENANCE_EXCEL: "/excel/download/tire-maintenance",
  // Transport endpoints
  GET_ALL_TRANSPORTS: "/transports",
  ADD_TRANSPORT: "/transports",
  UPDATE_TRANSPORT: (id) => `/transports/${id}`,
  DELETE_TRANSPORT: (id) => `/transports/${id}`,
  DOWNLOAD_TRANSPORT_EXCEL: "/excel/download/transport",

  // New Invoice endpoints
  GET_ALL_INVOICES: "/invoices",
  CREATE_INVOICE: "/invoices",
  GET_INVOICE: (id) => `/invoices/${id}`,
  UPDATE_INVOICE: (id) => `/invoices/${id}`,
  DELETE_INVOICE: (id) => `/invoices/${id}`,
  DOWNLOAD_INVOICE_PDF: (id) => `/invoices/${id}/pdf`,

  // Attendance endpoints
  GET_ALL_ATTENDANCE: "/attendances",
  ADD_ATTENDANCE: "/attendances",
  UPDATE_ATTENDANCE: (id) => `/attendances/${id}`,
  DELETE_ATTENDANCE: (id) => `/attendances/${id}`,
  DOWNLOAD_ATTENDANCE_EXCEL: "/excel/download/attendance",

  // Payment endpoints
  GET_ALL_PAYMENTS: "/payments",
  ADD_PAYMENT: "/payments",
  UPDATE_PAYMENT: (id) => `/payments/${id}`,
  DELETE_PAYMENT: (id) => `/payments/${id}`,
  DOWNLOAD_PAYMENTS_EXCEL: "/excel/download/payments",

  // Advance endpoints
  GET_ALL_ADVANCES: "/advances",
  ADD_ADVANCE: "/advances",
  UPDATE_ADVANCE: (id) => `/advances/${id}`,
  DELETE_ADVANCE: (id) => `/advances/${id}`,
  DOWNLOAD_ADVANCES_EXCEL: "/excel/download/advances",

  //Fuel endpoints
  GET_ALL_FUELS: "/fuel",
  ADD_FUEL: "/fuel",
  UPDATE_FUEL: (id) => `/fuel/${id}`,
  DELETE_FUEL: (id) => `/fuel/${id}`,
  GET_FUELS_BY_REG_NUMBER: "/fuel/by-regnumber",
  GET_TOTAL_FUEL_COST: "/fuel/total-cost",
  DOWNLOAD_FUEL_EXCEL: "/excel/download/fuel",

  //dashboard endpoint
  GET_DASHBOARD_DATA: "/dashboard",

  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};
