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
  TableContainer,
} from "@chakra-ui/react";
import { getStructuredUsers } from "services/account.service";
import { MdAddBox } from "react-icons/md";
import { BiSolidMinusSquare, BiTransfer } from "react-icons/bi";
import { PiEmptyBold } from "react-icons/pi";
import {
  getGameData,
  getGameSettings,
  updateGameData,
} from "services/settings.service";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const [gameSettings, setGameSettings] = useState({
    ticketStakeMin: 100,
    ticketStakeMax: 10000,
    ticketSizeMin: 1,
    ticketSizeMax: 10,
    quickPick: [100, 300, 500, 1000],
    payoutMode: "Manual",
  });

  const [gameData, setGameData] = useState({
    roundWaitTimeValue: 5,
    timerCountdownValue: 30,
    roundBetsLimit: 10,
  });

  const fetchData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const currentUser = localStorage.getItem("currentUser");
      let storedUser = currentUser ? JSON.parse(currentUser) : null;
      setActiveAgentId(storedUser);
      const [authData, userData, gameData] = await Promise.all([
        getUser(storedUser.id),
        getStructuredUsers(),
        getGameSettings(storedUser.id),
      ]);
      setLoading(false);
      setAdminSection((prev) => !prev);
      setData(userData.data);
      setSelectedData(userData.data);
      setGameData(gameData.data.game[0]);
      setGameSettings(gameData.data.gameConfig[0]);
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
    fetchData();
  }, []);

  const handleAdminDetails = () => {
    if (!adminSection) {
      fetchData();
    } else {
      setAdminSection((prev) => !prev);
      setActiveAgentId(null);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    let payload;
    if (authUser.id === activeAgentId.id) {
      payload = {
        oldPassword: oldPassword,
        password: newPassword,
      };
    } else {
      payload = {
        password: newPassword,
        agentId: activeAgentId.id,
      };
    }

    const res = await resetPassword(payload);
    if (res.status) {
      alert("Password changed successfully");
    } else {
      alert(res.data.message);
    }
  };

  const handleGameSettingsUpdate = async (e) => {
    e.preventDefault();
    const res = await updateGameData(gameData, selectedUser);
    if (res.status) {
      alert("Game settings updated successfully");
    } else {
      alert(res.data.message);
    }
  };

  const handleGameDataUpdate = async (e) => {
    e.preventDefault();
    const res = await updateGameData(gameData, selectedUser);
    if (res.status) {
      alert("Game data updated successfully");
    } else {
      alert(res.data.message);
    }
  };

  const handleChangeForGameSettings = (e) => {
    const { name, value } = e.target;
    setGameSettings((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChangeForGameData = (e) => {
    const { name, value } = e.target;
    setGameData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="" style={{ minHeight: "500px" }}>
        <div className="flex flex-col md:flex-row w-full h-full gap-6">
          <div style={{ flexBasis: "45%" }}>
            <div className="card bg-white rounded w-full relative">
              <div className="px-4 py-3 border-b w-full mb-2 sticky">
                <h2 className="font-bold">System List</h2>
              </div>
              <div className="content p-4">
                <div
                  className="flex border w-full justify-between gap-2 items-center hover-bg-blueGrey-100 cursor-pointer"
                  onClick={handleAdminDetails}
                >
                  <div
                    style={{ gap: ".5rem" }}
                    className="flex p-2 justify-start items-center"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={handleAdminDetails}
                    >
                      {adminSection ? (
                        <i className="fas fa-caret-down"></i>
                      ) : (
                        <i className="fas fa-caret-right"></i>
                      )}
                    </div>
                    <h4 className="text-xl font-semibold">{authUser.name}</h4>
                  </div>

                  <span
                    onClick={() => {
                      showCreateAgentCashier(true);
                    }}
                    className="p-4 px-8"
                  >
                    <MdAddBox />
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
                    setSelectedUser={setSelectedUser}
                    setGameData={setGameData}
                    setGameSettings={setGameSettings}
                    setActiveAgentId={setActiveAgentId}
                    data={data}
                    activeAgentId={activeAgentId}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ flexBasis: "55%" }}>
            <div className="card bg-white rounded w-full relative">
              <div className="px-4 py-3 border-b w-full">
                <h2 className="font-bold">Details</h2>
              </div>
              {activeAgentId ? (
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
                      <Tab className="text-left focus:outline-none focus:border-none focus:ring-0">
                        Game Config.
                      </Tab>
                      <Tab className="text-left focus:outline-none focus:border-none focus:ring-0">
                        Game Settings
                      </Tab>
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
                                    wallet.currencyId && (
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
                                          <span
                                            onClick={() => {
                                              setShowWalletActions(true);
                                              setWalletAction("deduct");
                                              setWalletActionCurrency(wallet);
                                            }}
                                            className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-red-600  last:mr-0 mr-1"
                                          >
                                            <BiSolidMinusSquare />
                                          </span>
                                          <span
                                            onClick={() => {
                                              setShowWalletActions(true);
                                              setWalletAction("add");
                                              setWalletActionCurrency(wallet);
                                            }}
                                            className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-emerald-500 last:mr-0 mr-1"
                                          >
                                            <MdAddBox />
                                          </span>
                                          {authUser.id === selectedUser && (
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
                      <TabPanel px={"0px"}>
                        <div className="container">
                          <h6 className="text-xl font-normal leading-normal mt-0 mb-3 text-blueGray-800">
                            Game Configurations
                          </h6>
                          <form onSubmit={handleGameDataUpdate}>
                            <div className="container">
                              <div className="flex md:flex-row flex-col">
                                <div className="md:w-1/3 w-full">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="roundWaitTimeValue">
                                      Round Wait Time
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="roundWaitTimeValue"
                                      value={gameData?.roundWaitTimeValue}
                                      onChange={handleChangeForGameData}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                                <div className="md:w-1/3 w-full px-2">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="timerCountdownValue">
                                      Timer Countdown
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="timerCountdownValue"
                                      value={gameData?.timerCountdownValue}
                                      onChange={handleChangeForGameData}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                                <div className="md:w-1/3 w-full">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="roundBetsLimit">
                                      Round Bets Limit
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="roundBetsLimit"
                                      value={gameData?.roundBetsLimit}
                                      onChange={handleChangeForGameData}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="submit"
                              className="bg-black text-white"
                              isLoading={loading}
                            >
                              Update
                            </Button>
                          </form>
                        </div>
                      </TabPanel>
                      <TabPanel px={"0px"}>
                        <div className="container">
                          <form onSubmit={handleGameSettingsUpdate}>
                            <div className="container">
                              <div className="flex md:flex-row flex-col">
                                <div className="md:w-1/2">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="ticketStakeMin">
                                      Min Ticket Stake
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="ticketStakeMin"
                                      value={gameSettings?.ticketStakeMin}
                                      onChange={handleChangeForGameSettings}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                                <div className="md:w-1/2 md:px-2">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="ticketStakeMax">
                                      Max Ticket Stake
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="ticketStakeMax"
                                      value={gameSettings?.ticketStakeMax}
                                      onChange={handleChangeForGameSettings}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                              </div>
                              <div className="flex md:flex-row flex-col">
                                <div className="md:w-1/2">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="ticketSizeMin">
                                      Min Ticket Size
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="ticketSizeMin"
                                      value={gameSettings?.ticketSizeMin}
                                      onChange={handleChangeForGameSettings}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                                <div className="md:w-1/2 md:px-2">
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="ticketSizeMax">
                                      Max Ticket Size
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      name="ticketSizeMax"
                                      value={gameSettings?.ticketSizeMax}
                                      onChange={handleChangeForGameSettings}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                              </div>
                              <div className="flex md:flex-row flex-col">
                                {gameSettings?.quickPick.length &&
                                  gameSettings?.quickPick.map((q, index) => (
                                    <div className="w-1/4" key={index}>
                                      <FormControl className="form-group mb-3">
                                        <FormLabel
                                          htmlFor={`quickPick-${index}`}
                                        >
                                          Quick Stake {index + 1}
                                        </FormLabel>
                                        <Input
                                          type="text"
                                          placeholder=""
                                          name={`quickPick-${index}`}
                                          value={q}
                                          onChange={(e) => {
                                            const newQuickPick = [
                                              ...gameSettings?.quickPick,
                                            ];
                                            newQuickPick[index] =
                                              e.target.value;
                                            setGameSettings((prev) => ({
                                              ...prev,
                                              quickPick: newQuickPick,
                                            }));
                                          }}
                                          className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                        />
                                      </FormControl>
                                    </div>
                                  ))}
                              </div>
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="payoutMode">
                                  Payout Mode
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  name="payoutMode"
                                  value={gameSettings?.payoutMode}
                                  onChange={handleChangeForGameSettings}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                            <Button
                              type="submit"
                              isLoading={loading}
                              className="bg-black text-white"
                            >
                              Update
                            </Button>
                          </form>
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center w-full h-full justify-center">
                  <PiEmptyBold className="text-5xl" />
                  <p>Select an account</p>
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
