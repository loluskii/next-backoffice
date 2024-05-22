"use client";
import React from "react";
import {
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

// components

export default function UserDetails() {
  return (
    <div className="w-full">
      <Tabs>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Password</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
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
                    {/* <tr>
            <td colspan="10" className="text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr> */}
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
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
