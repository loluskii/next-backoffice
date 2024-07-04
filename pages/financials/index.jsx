import { React, useState } from "react";
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
import { IoCaretDown } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { getFinancialReport } from "services/tickets.service";

const Index = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [betType, setBetType] = useState("multiple");
  const [loading, setLoading] = useState(false);
  const [visibleRows, setVisibleRows] = useState({});
  const [data, setData] = useState({});

  const toggleVisibility = (key) => {
    setVisibleRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  async function handleSubmit() {
    setLoading(true);
    const res = await getFinancialReport(startDate, endDate, betType);
    setLoading(false);
    setData(res);
  }

  const renderTableRows = (entity, depth = 1, parentKey = "") => {
    const indent = { paddingLeft: `${depth * 40}px` };
    const cashierKeys = Object.keys(entity.cashiers || {});
    const agentKeys = Object.keys(entity.agents || {});

    return (
      <>
        {cashierKeys.map((cashier, index) => {
          const currency = Object.keys(entity.cashiers[cashier])[0];
          const cashierData = entity.cashiers[cashier][currency];
          return (
            <Tr key={`${parentKey}-cashier-${index}`}>
              <Td style={indent}>{cashier}</Td>
              <Td>{currency}</Td>
              <Td>{cashierData.numberOfBets}</Td>
              <Td>{cashierData.totalOpenPayout}</Td>
              <Td>{cashierData.totalClosedPayout}</Td>
              <Td>{cashierData.totalStake}</Td>
              <Td>{cashierData.totalWinnings}</Td>
              <Td>{cashierData.profit}</Td>
            </Tr>
          );
        })}
        {agentKeys.map((subAgent, index) => {
          const key = `${parentKey}-agent-${index}`;
          const isVisible = visibleRows[key];
          return (
            <>
              <Tr key={key}>
                <Td style={indent}>
                  <button
                    onClick={() => toggleVisibility(key)}
                    className="focus:outline-none"
                  >
                    {isVisible ? <IoCaretDown /> : <AiFillCaretRight />}
                  </button>
                  {subAgent}
                </Td>
                {Object.keys(entity.agents[subAgent].totals).length ? (
                  Object.keys(entity.agents[subAgent].totals).map(
                    (currency) => (
                      <>
                        <Td>{currency}</Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .numberOfBets
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .totalOpenPayout
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .totalClosedPayout
                          }
                        </Td>
                        <Td>
                          {entity.agents[subAgent].totals[currency].totalStake}
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .totalWinnings
                          }
                        </Td>
                        <Td>
                          {entity.agents[subAgent].totals[currency].profit}
                        </Td>
                      </>
                    )
                  )
                ) : (
                  <>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td>--</Td>
                  </>
                )}
              </Tr>
              {isVisible &&
                renderTableRows(entity.agents[subAgent], depth + 1, key)}
            </>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="h-full">
        <div className="title mb-5">
          <h3 className="text-2xl">Financials</h3>
        </div>
        <div className="form">
          <form action="">
            <div className="flex bg-white rounded p-4 gap-x-3 w-full items-end">
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Bet Type</FormLabel>
                <Select
                  name="bet-type"
                  className="w-full"
                  id=""
                  onChange={(e) => setBetType(e.target.value)}
                >
                  <option value="multiple">Multiple</option>
                  <option value="single">Single</option>
                </Select>
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Start</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  onChange={(e) => setStartDate(e.target.value)}
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">End</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  onChange={(e) => setEndDate(e.target.value)}
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                />
              </FormControl>
              <button
                type="button"
                className="bg-black text-white rounded px-3 py-2"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white mt-3 pb-5">
          <TableContainer>
            <Table className="table table-striped table-bordered" size={"sm"}>
              <Thead className="bg-gray-500">
                <Tr>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Name
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Currency
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Number of Bets
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Total Open Payout
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Total Closed Payout
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Total Stake
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Total Winnings
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Profit
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {!Object.keys(data).length ? (
                  <Tr>
                    <Td colSpan={7} className="text-center">
                      No Data Available
                    </Td>
                  </Tr>
                ) : (
                  Object.keys(data).map((agentKey, index) => {
                    const key = `agent-${index}`;
                    const isVisible = visibleRows[key];
                    return (
                      <>
                        <Tr key={key}>
                          <Td>
                            <button
                              onClick={() => toggleVisibility(key)}
                              className="focus:outline-none"
                            >
                              {isVisible ? (
                                <IoCaretDown />
                              ) : (
                                <AiFillCaretRight />
                              )}
                            </button>
                            {agentKey}
                          </Td>
                          {Object.keys(data[agentKey].totals).length ? (
                            Object.keys(data[agentKey].totals).map(
                              (currency) => (
                                <>
                                  <Td>{currency}</Td>
                                  <Td>
                                    {
                                      data[agentKey].totals[currency]
                                        .numberOfBets
                                    }
                                  </Td>
                                  <Td>
                                    {
                                      data[agentKey].totals[currency]
                                        .totalOpenPayout
                                    }
                                  </Td>
                                  <Td>
                                    {
                                      data[agentKey].totals[currency]
                                        .totalClosedPayout
                                    }
                                  </Td>
                                  <Td>
                                    {data[agentKey].totals[currency].totalStake}
                                  </Td>
                                  <Td>
                                    {
                                      data[agentKey].totals[currency]
                                        .totalWinnings
                                    }
                                  </Td>
                                  <Td>
                                    {data[agentKey].totals[currency].profit}
                                  </Td>
                                </>
                              )
                            )
                          ) : (
                            <>
                              <Td>--</Td>
                              <Td>--</Td>
                              <Td>--</Td>
                              <Td>--</Td>
                              <Td>--</Td>
                              <Td>--</Td>
                              <Td>--</Td>
                            </>
                          )}
                        </Tr>
                        {isVisible && renderTableRows(data[agentKey], 1, key)}
                      </>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default Index;
Index.layout = Admin;
// R8Ua9_j5:guE5me
