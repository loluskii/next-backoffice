import React from "react";

// components

import CardLineChart from "components/Cards/CardLineChart.jsx";
import CardBarChart from "components/Cards/CardBarChart.jsx";
import CardPageVisits from "components/Cards/CardPageVisits.jsx";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.jsx";
import NestedAccordion from "components/Cards/NestedAccordion.jsx";

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
