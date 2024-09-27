import React, { useState, useEffect } from "react";
import Admin from "layouts/Admin.jsx";
import moment from "moment-timezone";
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
  Box,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { getTicketsHistory, getUsers } from "services/tickets.service";
import Pagination from "components/Pagination";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const getDefaultDates = () => {
  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);

  return {
    startDate: today.toISOString().split("T")[0], // Format: YYYY-MM-DD
    endDate: oneWeekLater.toISOString().split("T")[0], // Format: YYYY-MM-DD
  };
};

const TicketSearch = () => {
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getDefaultDates();

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [betType, setBetType] = useState("");
  const [gameType, setGameType] = useState("");
  const [cashier, setCashier] = useState([]);
  const [payout, setPayout] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getFilteredData = async (page = 1) => {
    let payload = {
      startDate,
      endDate,
      betType,
      payout,
      page,
      gameType,
    };
    setLoading(true);
    const res = await getTicketsHistory(payload);
    setLoading(false);
    setResults(res.results);
    setTotalPages(res.totalPages); // Assuming `totalPages` is part of the response
  };

  const getCashiersList = async () => {
    const res = await getUsers("cashier");
    setCashier(res.results);
  };

  useEffect(() => {
    getFilteredData(currentPage);
    getCashiersList();
  }, [currentPage]);

  return (
    <>
      <div className="h-screen">
        <div className="title mb-5">
          <h3 className="text-2xl">Tickets Search</h3>
        </div>
        <div className="form">
          <form action="">
            <div className="flex md:flex-row flex-col bg-white rounded p-4 gap-3 w-full items-end">
              <FormControl className="form-group">
                <FormLabel htmlFor="">Start</FormLabel>
                <Datetime
                  value={moment(startDate).toDate()}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="DD/MM/YYYY" // Format for the date
                  timeFormat={false}
                  inputProps={{
                    placeholder: "Select date",
                    className:
                      "w-full focus:outline-none rounded border-gray-200",
                    name: "startDate",
                  }}
                />
              </FormControl>
              <FormControl className="form-group">
                <FormLabel htmlFor="">End</FormLabel>
                <Datetime
                  value={moment(endDate).toDate()}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="DD/MM/YYYY" // Format for the date
                  timeFormat={false}
                  inputProps={{
                    placeholder: "Select date",
                    className:
                      "w-full focus:outline-none rounded border-gray-200",
                    name: "endDate",
                  }}
                />
              </FormControl>
              {/* <FormControl className="form-group">
                <FormLabel htmlFor="">Bet Type</FormLabel>
                <Select
                  name="bet-type"
                  className="w-full"
                  id=""
                  onChange={(e) => setBetType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="multiple">Multiple</option>
                  <option value="single">Single</option>
                </Select>
              </FormControl> */}
              <FormControl className="form-group">
                <FormLabel htmlFor="">Game Type</FormLabel>
                <Select
                  name="bet-type"
                  className="w-full"
                  id=""
                  onChange={(e) => setGameType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="aviata">Aviata</option>
                  <option value="shootout">ShootOut</option>
                </Select>
              </FormControl>
              <FormControl className="form-group">
                <FormLabel htmlFor="">Payout Status</FormLabel>
                <Select
                  name="bet-type"
                  className="w-full"
                  id=""
                  onChange={(e) => setPayout(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="true">Paid Out</option>
                  <option value="false">Pending</option>
                </Select>
              </FormControl>
              <button
                type="button"
                className="bg-black text-white rounded px-3 py-2"
                onClick={() => {
                  setCurrentPage(1);
                  getFilteredData(1);
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white mt-3">
          <TableContainer>
            <Table className="table table-striped table-bordered">
              <Thead className="bg-gray-500">
                <Tr>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Ticket ID
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Bet Type
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Game Type
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Selections
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Stake
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Result
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Potential Winnings
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Outcome
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Winnings
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Round Status
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Payout
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan="10" className="text-center">
                      <Spinner size="xl" />
                    </Td>
                  </Tr>
                ) : (
                  <>
                    {results.length ? (
                      results.map((res, index) => (
                        <Tr
                          key={index}
                          className={index % 2 === 1 ? "bg-blueGray-50" : ""}
                        >
                          <Td className="text-center border">{res.ticketId}</Td>
                          <Td className="text-center border">{res.betType}</Td>
                          <Td className="text-center border">{res.gameType}</Td>
                          <Td className="text-center border">
                            {res.selections.length}
                          </Td>
                          <Td className="text-center border">
                            {res.stake.toLocaleString("en")}
                          </Td>
                          <Td className="text-center border">{res.result}</Td>
                          <Td className="text-center border">
                            {res.potentialWinnings.toLocaleString("en")}
                          </Td>
                          <Td className="text-center border">
                            {res.gameOutcome}
                          </Td>
                          <Td className="text-center border">
                            {res.winnings.toLocaleString("en")}
                          </Td>
                          <Td className="text-center border">
                            {res.roundHasEnded ? "Ended" : "Ongoing"}
                          </Td>
                          <Td className="text-center border">
                            {res.payout ? "Paid Out" : "Pending"}
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
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            getFilteredData(page);
          }}
        />
      </div>
    </>
  );
};

export default TicketSearch;
TicketSearch.layout = Admin;
