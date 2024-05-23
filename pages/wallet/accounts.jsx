import React from "react";

// components

import NestedAccordion from "components/Cards/NestedAccordion";
// layout for page

import Admin from "layouts/Admin.jsx";
import UserDetails from "components/Cards/UserDetails";

export default function Dashboard() {
  return (
    <>
      <div className="flex h-screen">
        <div className="w-full xl:w-1/4 mb-12 xl:mb-0 px-4 bg-rose-200">
          <NestedAccordion />
        </div>
        <div className="w-full xl:w-1/2 px-4">
          <UserDetails />
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
