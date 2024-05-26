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

// components

import NestedAccordion from "components/Cards/NestedAccordion";
// layout for page

import Admin from "layouts/Admin.jsx";
import UserDetails from "components/Cards/UserDetails";

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState({});
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
                    <p className="text-2xl font-bold">Agent</p>
                  </GridItem>
                  <GridItem
                    w="100%"
                    padding="10px"
                    className=" bg-blueGray-100 text-blueGray-600"
                    borderStart="2px solid"
                  >
                    <p>Sub Agents</p>
                    <p className="text-2xl font-bold">0</p>
                  </GridItem>
                  <GridItem
                    w="100%"
                    padding="10px"
                    className=" bg-blueGray-100 text-blueGray-600"
                    borderStart="2px solid"
                  >
                    <p>Cashiers</p>
                    <p className="text-2xl font-bold">0</p>
                  </GridItem>
                </Grid>
              </div>
              <Tabs>
                <TabList>
                  <Tab>Summary</Tab>
                  <Tab>Password</Tab>
                  <Tab>Settings</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px="0px">
                    <div className="bg-white mt-3 w-full">
                      <TableContainer>
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
                                Available Amount
                              </Th>
                              <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                                Deposit Withdrawal
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td className="text-center" colspan="10">
                                No Data Available.
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
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
