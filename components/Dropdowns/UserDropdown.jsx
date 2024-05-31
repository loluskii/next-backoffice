import React from "react";
import { createPopper } from "@popperjs/core";
import { FaPowerOff } from "react-icons/fa6";
import { useRouter } from "next/router";

const UserDropdown = () => {
  // dropdown props
  const router = useRouter();
  function doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("refreshToken");
    return router.push("/auth/login");
  }
  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        onClick={(e) => {
          e.preventDefault();
          doLogout();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-2xl bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <FaPowerOff />
          </span>
        </div>
      </a>
    </>
  );
};

export default UserDropdown;
