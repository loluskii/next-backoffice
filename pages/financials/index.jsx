import { React, useState, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { IoCaretDown } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { getFinancialReport } from "services/tickets.service";

const Index = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gameType, setGameType] = useState("multiple");
  const [loading, setLoading] = useState(false);
  const [visibleRows, setVisibleRows] = useState({});
  const [data, setData] = useState({});
  const [dateRange, setDateRange] = useState("today");

  const toggleVisibility = (key) => {
    setVisibleRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  async function handleSubmit() {
    setLoading(true);
    const res = await getFinancialReport(startDate, endDate, gameType);
    setLoading(false);
    setData(res.hierarchy);
    // setData(res.heirachy);
  }

  useEffect(() => {
    updateDateRange("today");
  }, []);

  const updateDateRange = (range) => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    let start, end;

    switch (range) {
      case "lastHour":
        start = new Date(now.getTime() - 1000 * 60 * 60);
        end = now;
        break;
      case "today":
        start = new Date();
        end = new Date();
        break;
      case "yesterday":
        start = new Date(startOfToday.getTime() - 1000 * 60 * 60 * 24);
        end = new Date(endOfToday.getTime() - 1000 * 60 * 60 * 24);
        break;
      case "currentWeek":
        start = new Date(
          startOfToday.getTime() - 1000 * 60 * 60 * 24 * now.getDay()
        );
        end = endOfToday;
        break;
      case "lastWeek":
        start = new Date(
          startOfToday.getTime() - 1000 * 60 * 60 * 24 * (now.getDay() + 7)
        );
        end = new Date(
          endOfToday.getTime() - 1000 * 60 * 60 * 24 * now.getDay() - 1
        );
        break;
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      case "currentYear":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = "";
        end = "";
    }

    setStartDate(start ? start.toISOString().split("T")[0] : "");
    setEndDate(end ? end.toISOString().split("T")[0] : "");
  };

  const renderTableRows = (entity, depth = 1, parentKey = "") => {
    const indent = { paddingLeft: `${depth * 25}px` };
    const cashierKeys = Object.keys(entity.cashiers || {});
    const agentKeys = Object.keys(entity.agents || {});

    return (
      <>
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
                          {entity.agents[subAgent].totals[currency].totalStake}
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .totalWinnings
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
                              .jackpot1Payout
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .jackpot1Contributions
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .jackpot2Payout
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .jackpot2Contributions
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .jackpot3Payout
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .jackpot3Contributions
                          }
                        </Td>
                        <Td>
                          {
                            entity.agents[subAgent].totals[currency]
                              .totalClosedPayout
                          }
                        </Td>

                        <Td>
                          {entity.agents[subAgent].totals[currency].profit}
                        </Td>
                        <Td></Td>
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

        {cashierKeys.map((cashier, index) => {
          const currency = Object.keys(entity.cashiers[cashier])[0];
          const cashierData = entity.cashiers[cashier][currency];
          return (
            <Tr key={`${parentKey}-cashier-${index}`}>
              <Td style={indent}>{cashier}</Td>
              <Td>{currency}</Td>
              <Td>{cashierData.numberOfBets}</Td>
              <Td>{cashierData.totalStake}</Td>
              <Td>{cashierData.totalWinnings}</Td>
              <Td>{cashierData.totalOpenPayout}</Td>
              <Td>{cashierData.jackpot1Payout}</Td>
              <Td>{cashierData.jackpot1Contributions}</Td>
              <Td>{cashierData.jackpot2Payout}</Td>
              <Td>{cashierData.jackpot2Contributions}</Td>
              <Td>{cashierData.jackpot3Payout}</Td>
              <Td>{cashierData.jackpot3Contributions}</Td>
              <Td>{cashierData.totalClosedPayout}</Td>
              <Td>{cashierData.profit}</Td>
              <Td></Td>
            </Tr>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="h-full pb-5">
        <div className="title mb-5">
          <h3 className="text-2xl">Financials</h3>
        </div>
        <div className="form">
          <form action="">
            <div className="flex bg-white rounded p-4 gap-x-3 w-full items-end">
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Date Range</FormLabel>
                <Select
                  name="date-range"
                  className="w-full"
                  id=""
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    updateDateRange(e.target.value);
                  }}
                >
                  <option value="lastHour">Last Hour</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="currentWeek">Current Week</option>
                  <option value="lastWeek">Last Week</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="currentYear">Current Year</option>
                </Select>
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Game Type</FormLabel>
                <Select
                  name="gameType"
                  className="w-full"
                  id=""
                  onChange={(e) => setGameType(e.target.value)}
                >
                  <option value="aviata">Aviata</option>
                  <option value="shootout">Shootout</option>
                </Select>
              </FormControl>
              <FormControl className="form-group mr-3">
                <FormLabel htmlFor="">Start</FormLabel>
                <Input
                  type="date"
                  placeholder="Small Input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className=" placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
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
                  <Th className="whitespace-break-spaces border">Name</Th>
                  <Th className="whitespace-break-spaces border">Currency</Th>
                  <Th className="whitespace-break-spaces border">
                    tickets count
                  </Th>
                  <Th className="whitespace-break-spaces border">Total In</Th>
                  <Th className="whitespace-break-spaces border">Total Out</Th>
                  <Th className="whitespace-break-spaces border">
                    Open Payouts
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    jackpot 1 Payout
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    jackpot 1 Contribution
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    jackpot 2 Payout
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    jackpot 2 Contribution
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    jackpot 3 Payout
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    jackpot 3 Contribution
                  </Th>
                  <Th className="whitespace-break-spaces border">
                    Closed Payout
                  </Th>
                  <Th className="border">Profit</Th>
                  <Th>Profit usd</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!Object.keys(data).length && !loading ? (
                  <Tr>
                    <Td colSpan={14} style={{ textAlign: "center" }}>
                      No Data Available
                    </Td>
                  </Tr>
                ) : loading ? (
                  <Tr>
                    <Td colSpan={14} style={{ textAlign: "center" }}>
                      <Spinner />
                    </Td>
                  </Tr>
                ) : (
                  Object.keys(data).map((agentKey, index) => {
                    const key = `agent-${index}`;
                    const isVisible = visibleRows[key];
                    const totals = data[agentKey].totals;

                    const totalsKeys = Object.keys(totals);
                    const firstKey = totalsKeys[0];
                    const firstValue = totals[firstKey];

                    return (
                      <>
                        <Tr key={key}>
                          <Td
                            className="border"
                            rowSpan={
                              totalsKeys.length > 0 ? totalsKeys.length : 1
                            }
                          >
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
                          <Td className="border">{firstKey}</Td>
                          <Td className="border">
                            {firstValue?.numberOfBets.toLocaleString("en")}
                          </Td>
                          <Td className="border">
                            {firstValue?.totalStake.toLocaleString("en")}
                          </Td>
                          <Td className="border">
                            {firstValue?.totalWinnings.toLocaleString("en")}
                          </Td>
                          <Td className="border">
                            {firstValue?.totalOpenPayout.toLocaleString("en")}
                          </Td>
                          <Td className="border">
                            {firstValue?.jackpot1Payout}
                          </Td>
                          <Td className="border">
                            {firstValue?.jackpot1Contributions}
                          </Td>
                          <Td className="border">
                            {firstValue?.jackpot2Payout}
                          </Td>
                          <Td className="border">
                            {firstValue?.jackpot2Contributions}
                          </Td>
                          <Td className="border">
                            {firstValue?.jackpot3Payout}
                          </Td>
                          <Td className="border">
                            {firstValue?.jackpot3Contributions}
                          </Td>
                          <Td className="border">
                            {firstValue?.totalClosedPayout.toLocaleString("en")}
                          </Td>

                          <Td className="border">
                            {firstValue?.profit.toLocaleString("en")}
                          </Td>
                          <Td></Td>
                        </Tr>
                        {totalsKeys.slice(1).map((currency) => {
                          const currencyData = totals[currency];
                          return (
                            <Tr key={`${key}-${currency}`}>
                              <Td>{currency}</Td>
                              <Td>
                                {currencyData.numberOfBets.toLocaleString("en")}
                              </Td>
                              <Td>
                                {currencyData.totalStake.toLocaleString("en")}
                              </Td>
                              <Td>
                                {currencyData.totalWinnings.toLocaleString(
                                  "en"
                                )}
                              </Td>

                              <Td>
                                {currencyData.totalOpenPayout.toLocaleString(
                                  "en"
                                )}
                              </Td>
                              <Td className="border">
                                {currencyData?.jackpot1Payout}
                              </Td>
                              <Td className="border">
                                {currencyData?.jackpot1Contributions}
                              </Td>
                              <Td className="border">
                                {currencyData?.jackpot2Payout}
                              </Td>
                              <Td className="border">
                                {currencyData?.jackpot2Contributions}
                              </Td>
                              <Td className="border">
                                {currencyData?.jackpot3Payout}
                              </Td>
                              <Td className="border">
                                {currencyData?.jackpot3Contributions}
                              </Td>
                              <Td>
                                {currencyData.totalClosedPayout.toLocaleString(
                                  "en"
                                )}
                              </Td>

                              <Td>
                                {currencyData.profit.toLocaleString("en")}
                              </Td>
                              <Td></Td>
                            </Tr>
                          );
                        })}

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
