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
  Select,
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
  },[]);

  return (
    <>
      <div className="h-screen">
        <div class="flex flex-row w-full">
          <div className="bg-white rounded h-full p-4 flex-grow">
            <NestedAccordion data={data} />
          </div>
          {/* <div></div> */}
          <div className="px-4 pb-4 flex-grow">
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
                  <FormControl className="form-group mr-3">
                    <FormLabel htmlFor="">Reset Password</FormLabel>
                    <Input
                      type="text"
                      placeholder="Small Input"
                      className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                    />
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
