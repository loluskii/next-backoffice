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
import { getGameData, getGameSettings } from "services/settings.service";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { getUser } from "services/account.service";
import WalletActions from "components/Modals/WalletActions";
import NestedAccordion from "components/Cards/NestedAccordion";
import Admin from "layouts/Admin.jsx";

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState({});
  const [adminSection, setAdminSection] = useState(false);

  const [data, setData] = useState({});
  const [userWallets, setUserWallets] = useState([]);
  const [userRole, setUserRole] = useState("super");
  const [selectedData, setSelectedData] = useState({});
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [createType, setCreateType] = useState(false);
  const [showWalletActions, setShowWalletActions] = useState(false);
  const [walletAction, setWalletAction] = useState("");
  const [walletActionCurrency, setWalletActionCurrency] = useState("");

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

  async function fetchData() {
    try {
      const currentUser = localStorage.getItem("currentUser");
      let storedUser = currentUser ? JSON.parse(currentUser) : null;
      const [authData, userData, gameData, settingsData] = await Promise.all([
        getUser(storedUser.id),
        getStructuredUsers(),
        getGameData(),
        getGameSettings(),
      ]);
      setAdminSection((prev) => !prev);
      setData(userData.data);
      setSelectedData(userData.data);
      setGameData(gameData.data);
      setGameSettings(settingsData.data);
      setAuthUser(authData);
      setSelectedUser(authData.id);
      setUserWallets(authData.wallets);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("an error occured");
    }
  }
  // useEffect(() => {
  //   fetchData();
  // }, []);
  const handleAdminDetails = () => {
    if (!adminSection) {
      fetchData();
    } else {
      setAdminSection((prev) => !prev);
    }
  };

  const handleWalletAction = (name, value) => {
    setWalletAction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <div className="min-h-screen pb-5">
        <div className="flex flex-col md:flex-row w-full gap-6 place-items-start">
          <div
            style={{ flexBasis: "45%" }}
            className="bg-white rounded h-full flex-grow p-4 border border-black w-full"
          >
            <div className="flex border w-full justify-between gap-2 items-center">
              <div
                style={{ gap: ".5rem" }}
                onClick={handleAdminDetails}
                className="flex p-2 justify-start items-center cursor-pointer"
              >
                <span className="">
                  {adminSection ? (
                    <i className="fas fa-caret-down"></i>
                  ) : (
                    <i className="fas fa-caret-right"></i>
                  )}
                </span>
                <h4 className="text-xl font-semibold">Admin</h4>
              </div>

              <span
                onClick={() => {
                  setCreateType("agent");
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
                data={data}
              />
            </div>
          </div>
          {/* <div></div> */}
          <div className="flex-grow mb-8 w-full" style={{ flexBasis: "45%" }}>
            <div className="card p-4 bg-white">
              <div className="summary">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className=" bg-blueGray-100 text-blueGray-600 p-3 w-full border-l mb-2">
                    <p>Account Type</p>
                    <p className="text-2xl font-bold">{userRole}</p>
                  </div>
                  <div className=" bg-blueGray-100 text-blueGray-600 p-3 w-full border-l mb-2">
                    <p>Sub Agents</p>
                    <p className="text-2xl font-bold">
                      {selectedData?.agents?.length}
                    </p>
                  </div>
                  <div className=" bg-blueGray-100 text-blueGray-600 p-3 w-full border-l mb-2">
                    <p>Cashiers</p>
                    <p className="text-2xl font-bold">
                      {selectedData?.cashiers?.length}
                    </p>
                  </div>
                </div>
              </div>
              <Tabs>
                <TabList>
                  <Tab className="focus:outline-none focus:border-none focus:ring-0">
                    Summary
                  </Tab>
                  <Tab className="focus:outline-none focus:border-none focus:ring-0">
                    Password
                  </Tab>
                  <Tab className="focus:outline-none focus:border-none focus:ring-0">
                    Settings
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
                            userWallets.map((wallet, index) => (
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
                                  {wallet.balance.toFixed(2)}
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
                            ))
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
                  <TabPanel>
                    <FormControl className="form-group mb-3">
                      <FormLabel htmlFor="">Reset Password</FormLabel>
                      <Input
                        type="text"
                        placeholder=""
                        className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </FormControl>
                    <Button className="bg-black text-white">Update</Button>
                  </TabPanel>
                  <TabPanel px={"0px"}>
                    <div className="container">
                      <h6 className="text-xl font-normal leading-normal mt-0 mb-3 text-blueGray-800">
                        Game Configurations
                      </h6>
                      <form action="">
                        <div className="container">
                          <div className="flex md:flex-row flex-col">
                            <div className="md:w-1/3 w-full">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Round Wait Time
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameData.roundWaitTimeValue}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                            <div className="md:w-1/3 w-full px-2">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Timer Countdown
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameData.timerCountdownValue}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                            <div className="md:w-1/3 w-full">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Round Bets Limit
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameData.roundBetsLimit}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                          </div>
                        </div>
                        <Button type="submit" className="bg-black text-white">
                          Update
                        </Button>
                      </form>
                    </div>
                    <hr className="my-4 md:min-w-full" />
                    <div className="container">
                      <h6 className="text-xl font-normal leading-normal mt-0 mb-3 text-blueGray-800">
                        Game Settings
                      </h6>
                      <form action="">
                        <div className="container">
                          <div className="flex md:flex-row flex-col">
                            <div className="md:w-1/2 ">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Min Ticket Stake
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameSettings.ticketStakeMin}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                            <div className="md:w-1/2  md:px-2">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Max Ticket Stake
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameSettings.ticketStakeMax}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                          </div>
                          <div className="flex md:flex-row flex-col">
                            <div className="md:w-1/2 ">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Min Ticket Size
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameSettings.ticketSizeMin}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                            <div className="md:w-1/2  md:px-2">
                              <FormControl className="form-group mb-3">
                                <FormLabel htmlFor="">
                                  Max Ticket Size
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder=""
                                  value={gameSettings.ticketSizeMax}
                                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                />
                              </FormControl>
                            </div>
                          </div>
                          <div className="flex md:flex-row flex-col">
                            {gameSettings.quickPick.length &&
                              gameSettings.quickPick.map((q, index) => (
                                <div className="w-1/4" key={index}>
                                  <FormControl className="form-group mb-3">
                                    <FormLabel htmlFor="">
                                      Quick Stake {index + 1}
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      placeholder=""
                                      value={gameSettings.quickPick[index]}
                                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                    />
                                  </FormControl>
                                </div>
                              ))}
                          </div>
                          <FormControl className="form-group mb-3">
                            <FormLabel htmlFor="">Payout Mode</FormLabel>
                            <Input
                              type="text"
                              placeholder=""
                              value={gameSettings.payoutMode}
                              className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                            />
                          </FormControl>
                        </div>
                        <Button type="submit" className="bg-black text-white">
                          Update
                        </Button>
                      </form>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>
        {createAgentCashier && (
          <CreateAgentCashier
            type={"direct"}
            // agentId={authUser.id}
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
