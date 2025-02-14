"use client";
import React from "react";
import { useRouter } from "next/navigation";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import FooterAdmin from "components/Footers/FooterAdmin.jsx";

export default function Admin({ children }) {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
  const auth = localStorage.getItem("token");

  // if (!auth) {
  //   router.push("/auth/login");
  //   return;
  // }
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <div className="px-4 md:px-10 mx-auto w-full py-24 min-h-screen">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
