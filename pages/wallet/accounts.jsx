import React, { useEffect, useState } from "react";
import {
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { getStructuredUsers } from "services/account.service";
import GameConfiguration from "components/AccountDetail/GameConfiguration";
import GameSettings from "components/AccountDetail/GameSettings";
import { MdAddBox } from "react-icons/md";
import { BiSolidMinusSquare, BiTransfer } from "react-icons/bi";
import { PiEmptyBold } from "react-icons/pi";
import { FaRegSquarePlus, FaRegSquareMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import {
  getGameData,
  getGameSettings,
  updateGameData,
} from "services/settings.service";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { getUser } from "services/account.service";
import WalletActions from "components/Modals/WalletActions";
import NestedAccordion from "components/Cards/NestedAccordion";
import Admin from "layouts/Admin.jsx";
import { resetPassword } from "services/auth.service";

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState({});
  const [adminSection, setAdminSection] = useState(false);

  const [data, setData] = useState({});
  const [userWallets, setUserWallets] = useState([]);
  const [userRole, setUserRole] = useState("super");
  const [selectedData, setSelectedData] = useState({});
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [showWalletActions, setShowWalletActions] = useState(false);
  const [walletAction, setWalletAction] = useState("");
  const [walletActionCurrency, setWalletActionCurrency] = useState("");

  const [activeAgentId, setActiveAgentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const fetchData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const currentUser = localStorage.getItem("currentUser");
      let storedUser = currentUser ? JSON.parse(currentUser) : null;
      setActiveAgentId(storedUser);
      const [authData, userData] = await Promise.all([
        getUser(storedUser.id),
        getStructuredUsers(),
      ]);
      setLoading(false);
      // setAdminSection((prev) => !prev);
      setData(userData.data);
      setSelectedData(userData.data);
      setAuthUser(authData);
      setSelectedUser(authData.id);
      setUserWallets(authData.wallets);
      setUserRole(authUser.role);

    } catch (error) {
      // console.error("Error fetching data:", error);
      alert("An error occurred");
    }
  };
  
  useEffect(() => {
    console.log('fetching...')
    fetchData();
    console.log(selectedUser);
    setAdminSection((prev) => !prev);
  }, []);

  const handleAdminDetails = () => {
    fetchData();
  };

  const handleCaretClick = () => {
    console.log(adminSection);
    if (adminSection) {
      setAdminSection(false);
    } else {
      setAdminSection(true);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const isSuperUser = authUser.id === activeAgentId.id;
    const type = isSuperUser ? "super" : "agent";
    const payload = isSuperUser
      ? { oldPassword, password: newPassword }
      : { password: newPassword, email: activeAgentId.email };

    try {
      const res = await resetPassword(type, payload);
      if (res.status) {
        alert("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        throw Error(res);
      }
    } catch (error) {
      alert(error.response.data.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="" style={{ minHeight: "500px" }}>
        <div className="flex flex-col md:flex-row w-full h-full gap-6">
          <div style={{ flexBasis: "45%" }}>
            <div className="card  rounded w-full relative">
              <div className="px-4 py-3 border-b w-full mb-2 sticky bg-white">
                <h2 className="font-bold">System List</h2>
              </div>
              <div className="content">
                <div
                  style={{ gap: ".5rem" }}
                  className="flex p-2 justify-start items-center bg-white hover-bg-blueGrey-100 border"
                >
                  <div style={{ flexBasis: "5%" }}>
                    {!adminSection ? (
                      <FaRegSquarePlus onClick={handleCaretClick} />
                    ) : (
                      <FaRegSquareMinus onClick={handleCaretClick} />
                    )}
                  </div>

                  <div
                    className="flex justify-between gap-2 items-center cursor-pointer"
                    onClick={handleAdminDetails}
                    style={{ flexBasis: "90%" }}
                  >
                    <h4 className="text-xl font-semibold">{authUser.name}</h4>
                  </div>
                  <span
                    className="p-2 px-8"
                    style={{ flexBasis: "5%" }}
                    onClick={() => {
                      showCreateAgentCashier(true);
                    }}
                  >
                    <FaPlus />
                  </span>
                </div>

                <div
                  className={`${
                    adminSection ? "max-h-[20rem] h-full" : "max-h-0 h-0"
                  } overflow-hidden transition-all flex flex-col w-full gap-2 items-center `}
                >
                  <NestedAccordion
                    setUserWallets={setUserWallets}
                    setUserRole={setUserRole}
                    setSelectedData={setSelectedData}
                    setActiveAgentId={setActiveAgentId}
                    data={data}
                    activeAgentId={activeAgentId}
                    setDetailLoading={setDetailLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ flexBasis: "55%" }}>
            <div
              className="card bg-white rounded w-full relative"
              style={{ minHeight: "500px" }}
            >
              <div className="px-4 py-3 border-b w-full">
                <h2 className="font-bold">Details</h2>
              </div>
              {!detailLoading && activeAgentId ? (
                <div className="card p-4">
                  <div className="summary">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className=" bg-blueGray-100 text-blueGray-600 p-3 w-full border-l mb-2">
                        <p>Account Type</p>
                        <p className="text-2xl font-bold">{userRole}</p>
                      </div>
                      <div className=" bg-blueGray-100 text-blueGray-600 p-3 w-full border-l mb-2">
                        <p>Sub Agents</p>
                        <p className="text-2xl font-bold">
                          {selectedData?.agents
                            ? selectedData?.agents?.length
                            : "..."}
                        </p>
                      </div>
                      <div className=" bg-blueGray-100 text-blueGray-600 p-3 w-full border-l mb-2">
                        <p>Cashiers</p>
                        <p className="text-2xl font-bold">
                          {selectedData?.cashiers
                            ? selectedData?.cashiers?.length
                            : "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Tabs>
                    <TabList>
                      <Tab className="text-left focus:outline-none focus:border-none focus:ring-0">
                        Summary
                      </Tab>
                      <Tab className="text-left focus:outline-none focus:border-none focus:ring-0">
                        Password
                      </Tab>
                      {selectedUser &&
                        (userRole === "agent" || userRole === "super") && (
                          <>
                            <Tab className="text-left focus:outline-none focus:border-none focus:ring-0">
                              Game Config.
                            </Tab>
                            <Tab className="text-left focus:outline-none focus:border-none focus:ring-0">
                              Game Settings
                            </Tab>
                          </>
                        )}
                    </TabList>

                    <TabPanels>
                      <TabPanel px="0px">
                        <div className="bg-white mt-3">
                          {/* <TableContainer> */}
                          <Table className="table table-striped table-bordered">
                            <Thead className="bg-gray-500">
                              <Tr>
                                <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                                  Currency
                                </Th>
                                <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                                  Balance
                                </Th>
                                <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                                  Action
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {userWallets.length ? (
                                userWallets.map(
                                  (wallet, index) =>
                                    wallet.currencyId &&
                                    wallet.currencyId.status === "active" && (
                                      <Tr key={index}>
                                        <Td className="text-center">
                                          {wallet?.currencyId?.countryId}
                                          {wallet.primaryWallet && (
                                            <span className="ml-1 text-xs font-semibold inline-block py-1 px-2 rounded text-blueGray-600 bg-blueGray-200 uppercase last:mr-0 mr-1">
                                              Primary
                                            </span>
                                          )}
                                        </Td>
                                        <Td className="text-center">
                                          {wallet.balance}
                                        </Td>
                                        <Td className="text-center">
                                          {authUser.id === selectedUser ? (
                                            <span
                                              onClick={() => {
                                                setShowWalletActions(true);
                                                setWalletAction("transfer");
                                                setWalletActionCurrency(wallet);
                                              }}
                                              className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-lightBlue-600  last:mr-0 mr-1"
                                            >
                                              <BiTransfer />
                                            </span>
                                          ) : (
                                            <>
                                              <span
                                                onClick={() => {
                                                  setShowWalletActions(true);
                                                  setWalletAction("deduct");
                                                  setWalletActionCurrency(
                                                    wallet
                                                  );
                                                }}
                                                className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-red-600  last:mr-0 mr-1"
                                              >
                                                <BiSolidMinusSquare />
                                              </span>
                                              <span
                                                onClick={() => {
                                                  setShowWalletActions(true);
                                                  setWalletAction("add");
                                                  setWalletActionCurrency(
                                                    wallet
                                                  );
                                                }}
                                                className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-emerald-500 last:mr-0 mr-1"
                                              >
                                                <MdAddBox />
                                              </span>
                                              <span
                                                onClick={() => {
                                                  setShowWalletActions(true);
                                                  setWalletAction("transfer");
                                                  setWalletActionCurrency(
                                                    wallet
                                                  );
                                                }}
                                                className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-lightBlue-600  last:mr-0 mr-1"
                                              >
                                                <BiTransfer />
                                              </span>
                                            </>
                                          )}
                                        </Td>
                                      </Tr>
                                    )
                                )
                              ) : (
                                <Tr>
                                  <Td className="text-center" colSpan="10">
                                    No Data Available.
                                  </Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                          {/* </TableContainer> */}
                        </div>
                      </TabPanel>
                      <TabPanel px={"0px"}>
                        <form onSubmit={handlePasswordChange}>
                          {activeAgentId.id === authUser?.id ? (
                            <>
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="oldPassword">
                                  Old Password
                                </FormLabel>
                                <Input
                                  type="password"
                                  placeholder="Enter old password"
                                  onChange={(e) =>
                                    setOldPassword(e.target.value)
                                  }
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="newPassword">
                                  New Password
                                </FormLabel>
                                <Input
                                  type="password"
                                  placeholder="Enter new password"
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </>
                          ) : (
                            <FormControl className="form-group mb-3">
                              <FormLabel htmlFor="newPassword">
                                Password
                              </FormLabel>
                              <Input
                                type="password"
                                placeholder="Enter new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                              />
                            </FormControl>
                          )}
                          <Button
                            type="submit"
                            isLoading={loading}
                            className="bg-black text-white"
                          >
                            Update
                          </Button>
                        </form>
                      </TabPanel>

                      {selectedUser &&
                        (userRole === "agent" || userRole === "super") && (
                          <>
                            <GameConfiguration
                              loading={loading}
                              authUser={authUser}
                              selectedUser={selectedUser}
                            />
                          </>
                        )}
                    </TabPanels>
                  </Tabs>
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center w-full h-full justify-center">
                  <Spinner size="xl" />
                </div>
              )}
            </div>
          </div>
        </div>
        {createAgentCashier && (
          <CreateAgentCashier
            type={"direct"}
            isOpen={createAgentCashier}
            onClose={() => showCreateAgentCashier(false)}
          ></CreateAgentCashier>
        )}

        {showWalletActions && (
          <WalletActions
            isOpen={showWalletActions}
            onClose={() => setShowWalletActions(false)}
            action={walletAction}
            currency={walletActionCurrency}
            agentId={selectedUser}
          ></WalletActions>
        )}
      </div>
    </>
  );
}

Dashboard.layout = Admin;
