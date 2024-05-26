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

// components

import NestedAccordion from "components/Cards/NestedAccordion";
// layout for page

import Admin from "layouts/Admin.jsx";
import UserDetails from "components/Cards/UserDetails";

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState({});
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  async function getUsers() {
    const res = await getStructuredUsers();
    setData(res.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="min-h-screen pb-5">
        <div class="flex flex-row w-full gap-6">
          <div
            className="bg-white rounded h-full flex-grow"
            style={{ flexBasis: "40%" }}
          >
            <NestedAccordion data={data} />
          </div>
          {/* <div></div> */}
          <div className="flex-grow" style={{ flexBasis: "60%" }}>
            <div className="card p-4 bg-white">
              <div className="summary">
                <Grid templateColumns="repeat(3, 1fr)" gap={6} className="mb-5">
                  <GridItem
                    w="100%"
                    padding="10px"
                    className=" bg-blueGray-100 text-blueGray-600"
                    borderStart="2px solid"
                  >
                    <p>Account Type</p>
                    <p className="text-2xl font-bold">{authUser.role}</p>
                  </GridItem>
                  <GridItem
                    w="100%"
                    padding="10px"
                    className=" bg-blueGray-100 text-blueGray-600"
                    borderStart="2px solid"
                  >
                    <p>Sub Agents</p>
                    <p className="text-2xl font-bold">{data?.agents?.length}</p>
                  </GridItem>
                  <GridItem
                    w="100%"
                    padding="10px"
                    className=" bg-blueGray-100 text-blueGray-600"
                    borderStart="2px solid"
                  >
                    <p>Cashiers</p>
                    <p className="text-2xl font-bold">
                      {data?.cashiers?.length}
                    </p>
                  </GridItem>
                </Grid>
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
                          {authUser && authUser.wallets.length ? (
                            authUser?.wallets.map((wallet, index) => (
                              <Tr>
                                <Td className="text-center">
                                  {wallet.currencyId}
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
                                  <span className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-red-600  last:mr-0 mr-1">
                                    <BiSolidMinusSquare />
                                  </span>
                                  <span className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-emerald-500 last:mr-0 mr-1">
                                    <MdAddBox />
                                  </span>
                                  <span className="text-xs cursor-pointer font-semibold inline-block py-1 px-2 uppercase rounded text-white bg-lightBlue-600  last:mr-0 mr-1">
                                    <BiTransfer />
                                  </span>
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
                        placeholder="Enter Password"
                        className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </FormControl>
                    <Button className="bg-black text-white">Update</Button>
                  </TabPanel>
                  <TabPanel>
                    <p>three!</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
