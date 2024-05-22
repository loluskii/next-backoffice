import React from "react";
import Admin from "layouts/Admin.jsx";
import {
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

const TransferSearch = () => {
  return (
    <>
      <div className="h-screen">
        <div className="title mb-5">
          <h3 className="text-2xl">Transfer Search</h3>
        </div>
        <div className="form">
          <form action="">
            <div className="flex bg-white rounded p-4 gap-x-3 w-full">
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Agent</FormLabel>
                <Select className="w-full" id="">
                  <option value="">Select Agent</option>
                </Select>
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Target</FormLabel>
                <Input
                  type="text"
                  placeholder="Small Input"
                  className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Start</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">End</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>

              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Currency</FormLabel>
                <Select name="bet-type" className="w-full" id="">
                  <option value="">All</option>
                </Select>
              </FormControl>
              <button></button>
            </div>
          </form>
        </div>
        <div className="bg-white mt-3">
          <TableContainer>
            <Table className="table table-striped table-bordered">
              <Thead className="bg-gray-500">
                <Tr>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Date
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Agent
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    TX Type
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Target
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Amount
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Currency
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Deposit
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Withdrawal
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
      </div>
    </>
  );
};

export default TransferSearch;
TransferSearch.layout = Admin;
