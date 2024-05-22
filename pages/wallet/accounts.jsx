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
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <NestedAccordion />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardPageVisits />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          {/* <CardPageVisits /> */}
        </div>
        <div className="w-full xl:w-4/12 px-4">
          {/* <CardSocialTraffic /> */}
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
