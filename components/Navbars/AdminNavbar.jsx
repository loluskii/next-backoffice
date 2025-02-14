import React from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.jsx";

export default function Navbar() {
  return (
    <nav className="absolute hidden top-0 left-0 w-full z-10 bg-white md:flex-row md:flex-nowrap md:justify-start md:flex items-center p-4 border-b shadow-sm">
      <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
        {/* Brand */}
        <a
          className="text-sm uppercase inline-block font-semibold"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          Dashboard
        </a>
        {/* User */}
        <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
          <UserDropdown />
        </ul>
      </div>
    </nav>
  );
}
