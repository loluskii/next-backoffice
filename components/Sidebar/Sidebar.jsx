import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import NotificationDropdown from "components/Dropdowns/TableDropdown";
import UserDropdown from "components/Dropdowns/UserDropdown.jsx";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    let storedUser = currentUser ? JSON.parse(currentUser) : null;
    if (storedUser) {
      setIsSuperUser(storedUser.role === "super");
    }
  }, []);
  return (
    <>
      <nav className="bg-blueGray-700 md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl  flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-white opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link legacyBehavior href="/">
            <a
              href="#pablo"
              className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            >
              Backoffice
            </a>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block md:pb-4 md:mb-4 md:border-b md:border-solid md:border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link legacyBehavior href="/">
                    <a
                      href="#pablo"
                      className="md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    >
                      Backoffice
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Wallet System
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link legacyBehavior href="/wallet/accounts">
                  <a
                    href="#pablo"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/wallet/accounts") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "")
                    }
                  >
                    <i
                      className={
                        "fas fa-newspaper mr-2 text-sm " +
                        (router.pathname.indexOf("/wallet/accounts") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Accounts
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link legacyBehavior href="/wallet/web-players">
                  <a
                    href="#pablo"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/wallet/web-players") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-500")
                    }
                  >
                    <i
                      className={
                        "fas fa-newspaper mr-2 text-sm " +
                        (router.pathname.indexOf("/wallet/web-players") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Web Players
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link legacyBehavior href="/wallet/transfer-search">
                  <a
                    href="#pablo"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/wallet/transfer-search") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-500")
                    }
                  >
                    <i
                      className={
                        "fas fa-newspaper mr-2 text-sm " +
                        (router.pathname.indexOf("/wallet/transfer-search") !==
                        -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Transfer Search
                  </a>
                </Link>
              </li>
            </ul>
            <br className="md:hidden" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Ticket Management
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link legacyBehavior href="/tickets/ticket-search">
                  <a
                    href="#pablo"
                    className={
                      "text-white hover:text-white text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/tickets/ticket-search") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-500")
                    }
                  >
                    <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                    Tickets Search
                  </a>
                </Link>
              </li>
            </ul>

            <br className="md:hidden" />

            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Financials
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link legacyBehavior href="/financials">
                  <a
                    href="#pablo"
                    className={
                      "text-white hover:text-white text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/financials") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-500")
                    }
                  >
                    <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                    General Revenue
                  </a>
                </Link>
              </li>
            </ul>

            <br className="md:hidden" />

            {isSuperUser && (
              <>
                {/* Heading */}
                <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                  Settings
                </h6>
                {/* Navigation */}

                <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                  <li className="items-center">
                    <Link legacyBehavior href="/currency">
                      <a
                        href="#pablo"
                        className={
                          "text-white hover:text-white text-xs uppercase py-3 font-bold block " +
                          (router.pathname.indexOf("/currency") !== -1
                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                            : "text-blueGray-500")
                        }
                      >
                        <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                        Currency
                      </a>
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
