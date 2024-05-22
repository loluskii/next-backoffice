import React from "react";

// components

import CardLineChart from "components/Cards/CardLineChart.jsx";
import CardBarChart from "components/Cards/CardBarChart.jsx";
import CardPageVisits from "components/Cards/CardPageVisits.jsx";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.jsx";
import NestedAccordion from "components/Cards/NestedAccordion.jsx";

// layout for page

import Admin from "layouts/Admin.jsx";

export default function Dashboard() {
  return (
    <>
      <div className="h-screen">
        <div className="flex flex-row gap-x-3 w-full">
          <NestedAccordion />
          {/* <div className="p-1"></div> */}
          <CardPageVisits />
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
