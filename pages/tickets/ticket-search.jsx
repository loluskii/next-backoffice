import React, { useState, useEffect } from "react";
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
  Box,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { getTicketsHistory } from "services/tickets.service";

// Pagination control component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <Box display="flex" justifyContent="center" mt="4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        mr="2"
      >
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          colorScheme={page === currentPage ? "blue" : "gray"}
          mx="1"
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        ml="2"
      >
        Next
      </Button>
    </Box>
  );
};

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
    };
    setLoading(true);
    const res = await getTicketsHistory(payload);
    setLoading(false);
    setResults(res.results);
    setTotalPages(res.totalPages); // Assuming `totalPages` is part of the response
  };

  useEffect(() => {
    getFilteredData(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="h-screen">
        <div className="title mb-5">
          <h3 className="text-2xl">Tickets Search</h3>
        </div>
        <div className="form">
          <form action="">
            <div className="flex bg-white rounded p-4 gap-x-3 w-full items-end">
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Start</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">End</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>
              <FormControl className="form-group mr-3">
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
              </FormControl>
              <FormControl className="form-group mr-3">
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
                        <Tr key={index}>
                          <Td className="text-center">{res.ticketId}</Td>
                          <Td className="text-center">{res.betType}</Td>
                          <Td className="text-center">
                            {res.selections.length}
                          </Td>
                          <Td className="text-center">
                            {res.stake.toLocaleString("en")}
                          </Td>
                          <Td className="text-center">{res.result}</Td>
                          <Td className="text-center">
                            {res.potentialWinnings.toLocaleString("en")}
                          </Td>
                          <Td className="text-center">{res.gameOutcome}</Td>
                          <Td className="text-center">
                            {res.winnings.toLocaleString("en")}
                          </Td>
                          <Td className="text-center">
                            {res.roundHasEnded ? "Ended" : "Ongoing"}
                          </Td>
                          <Td className="text-center">
                            {res.payout ? "Paid Out" : "Awaiting Payout"}
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
