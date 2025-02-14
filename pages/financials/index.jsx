import { React, useState, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { IoCaretDown } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { getFinancialReport } from "services/tickets.service";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const Index = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gameType, setGameType] = useState("");
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
    let filteredHierarchy = {};
    try {
      const res = await getFinancialReport(startDate, endDate, gameType);
      Object.entries(res.hierarchy).forEach(([key, value]) => {
        const hasTotals = Object.keys(value.totals).length > 0;

        // Check if at least one value in totals is either < 0 or > 0
        const isTotalsNonZero = Object.values(value.totals).some((totalsObj) =>
          Object.values(totalsObj).some(
            (val) => typeof val === "number" && val !== 0
          )
        );

        // Add to filteredHierarchy only if totals exist and are not all zeros
        if (hasTotals && isTotalsNonZero) {
          filteredHierarchy[key] = value;
        }
      });

      setLoading(false);
      setData(filteredHierarchy);
    } catch (error) {
      setData({});
      setLoading(false);
    }
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

  const sumNumberOfBets = (totals) => {
    let totalNumberOfBets = 0;
    Object.values(totals).forEach((currencyData) => {
      totalNumberOfBets += currencyData.numberOfBets;
    });
    return totalNumberOfBets;
  };

  const renderTableRows = (entity, depth = 1, parentKey = "") => {
    const indent = { paddingLeft: `${depth * 30}px` };
    const cashierKeys = Object.keys(entity.cashiers || {});
    const agentKeys = Object.keys(entity.agents || {});
    const totalsInPrimaryCurrency = entity.totalsInPrimaryCurrency;

    return (
      <>
        {agentKeys.map((subAgent, index) => {
          const key = `${parentKey}-agent-${index}`;
          const isVisible = visibleRows[key];
          return (
            Object.keys(entity.agents[subAgent].totals).length > 0 && (
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

                  {Object.keys(entity.agents[subAgent].totals).map(
                    (currency) => (
                      <>
                        {/* <Td>{currency}</Td> */}
                        <Td>
                          {entity.agents[subAgent].totals[
                            currency
                          ].numberOfBets.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].totalStake.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].totalWinnings.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].totalOpenPayout.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].jackpot1Payout.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].jackpot1Contributions.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].jackpot2Payout.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].jackpot2Contributions.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].jackpot3Payout.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].jackpot3Contributions.toLocaleString("en")}
                        </Td>
                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].totalClosedPayout.toLocaleString("en")}
                        </Td>

                        <Td>
                          {currency}{" "}
                          {entity.agents[subAgent].totals[
                            currency
                          ].profit.toLocaleString("en")}
                        </Td>
                        <Td>
                          USA{" "}
                          {parseFloat(
                            totalsInPrimaryCurrency["USA"].profit
                          ).toLocaleString("en")}
                        </Td>
                      </>
                    )
                  )}
                </Tr>
                {isVisible &&
                  renderTableRows(entity.agents[subAgent], depth + 1, key)}
              </>
            )
          );
        })}

        {cashierKeys.map((cashier, index) => {
          const currency = Object.keys(entity.cashiers[cashier])[0];
          const cashierData = entity.cashiers[cashier][currency];
          return (
            <Tr key={`${parentKey}-cashier-${index}`}>
              <Td style={indent}>{cashier}</Td>
              {/* <Td>{currency}</Td> */}
              <Td>{cashierData.numberOfBets}</Td>
              <Td>
                {currency} {cashierData.totalStake.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.totalWinnings.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.totalOpenPayout.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.jackpot1Payout.toLocaleString("en")}
              </Td>
              <Td>
                {currency}{" "}
                {cashierData.jackpot1Contributions.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.jackpot2Payout.toLocaleString("en")}
              </Td>
              <Td>
                {currency}{" "}
                {cashierData.jackpot2Contributions.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.jackpot3Payout.toLocaleString("en")}
              </Td>
              <Td>
                {currency}{" "}
                {cashierData.jackpot3Contributions.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.totalClosedPayout.toLocaleString("en")}
              </Td>
              <Td>
                {currency} {cashierData.profit.toLocaleString("en")}
              </Td>
              <Td>
                USD
                {parseFloat(
                  totalsInPrimaryCurrency["USA"].profit
                ).toLocaleString("en")}
              </Td>
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
            <div className="flex md:flex-row flex-col bg-white rounded p-4 gap-3 w-full items-end">
              <FormControl className="form-group ">
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
              <FormControl className="form-group ">
                <FormLabel htmlFor="">Game Type</FormLabel>
                <Select
                  name="gameType"
                  className="w-full"
                  id=""
                  onChange={(e) => setGameType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="aviata">Aviata</option>
                  <option value="shootout">Shootout</option>
                </Select>
              </FormControl>

              <FormControl className="form-group ">
                <FormLabel htmlFor="">Start</FormLabel>
                <Datetime
                  value={moment(startDate).toDate()}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false} // Format for the date
                  inputProps={{
                    placeholder: "Select date",
                    className: "w-full focus:outline-none rounded border-gray-200",
                    name: "startDate",
                  }}
                />
              </FormControl>
              <FormControl className="form-group ">
                <FormLabel htmlFor="">End</FormLabel>
                <Datetime
                  value={moment(endDate).toDate()}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="DD/MM/YYYY" // Format for the date
                  timeFormat={false}
                  inputProps={{
                    placeholder: "Select date",
                    className: "w-full focus:outline-none rounded border-gray-200",
                    name: "endDate",
                  }}
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
        <div className="bg-white mt-3 pb-5 shadow">
          <TableContainer>
            <Table className="table table-striped table-bordered" size={"sm"}>
              <Thead className="">
                <Tr>
                  <Th className="whitespace-break-spaces border">Name</Th>
                  {/* <Th className="whitespace-break-spaces border">Currency</Th> */}
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
                    const totalsInPC = data[agentKey].totalsInPrimaryCurrency;

                    const totalsKeys = Object.keys(totals);
                    const totalsInPCKeys = Object.keys(totalsInPC);
                    const firstKey = totalsKeys[0];
                    const firstValue = totals[firstKey];

                    return (
                      totalsKeys.length > 0 && (
                        <>
                          <Tr
                            key={key}
                            className={index % 2 === 1 ? "bg-blueGray-50" : ""}
                          >
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
                            {/* <Td>{firstKey}</Td> */}
                            <Td
                              className="border"
                              rowSpan={
                                totalsKeys.length > 0 ? totalsKeys.length : 1
                              }
                            >
                              {sumNumberOfBets(totals)}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.totalStake.toLocaleString("en")}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.totalWinnings.toLocaleString("en")}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.totalOpenPayout.toLocaleString("en")}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.jackpot1Payout.toLocaleString("en")}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.jackpot1Contributions.toLocaleString(
                                "en"
                              )}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.jackpot2Payout.toLocaleString("en")}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.jackpot2Contributions.toLocaleString(
                                "en"
                              )}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.jackpot3Payout.toLocaleString("en")}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.jackpot3Contributions.toLocaleString(
                                "en"
                              )}
                            </Td>
                            <Td>
                              {firstKey}{" "}
                              {firstValue?.totalClosedPayout.toLocaleString(
                                "en"
                              )}
                            </Td>

                            <Td>
                              {firstKey}{" "}
                              {firstValue?.profit.toLocaleString("en")}
                            </Td>
                            <Td
                              className="border"
                              rowSpan={
                                totalsKeys.length > 0 ? totalsKeys.length : 1
                              }
                            >
                              USD
                              {parseFloat(
                                totalsInPC["USA"].profit
                              ).toLocaleString("en")}
                            </Td>
                          </Tr>

                          {totalsKeys.slice(1).map((currency) => {
                            const currencyData = totals[currency];
                            return (
                              <Tr key={`${key}-${currency}`}>
                                <Td>
                                  {currency}{" "}
                                  {currencyData.totalStake.toLocaleString("en")}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData.totalWinnings.toLocaleString(
                                    "en"
                                  )}
                                </Td>

                                <Td>
                                  {currency}{" "}
                                  {currencyData.totalOpenPayout.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData?.jackpot1Payout.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData?.jackpot1Contributions.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData?.jackpot2Payout.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData?.jackpot2Contributions.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData?.jackpot3Payout.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData?.jackpot3Contributions.toLocaleString(
                                    "en"
                                  )}
                                </Td>
                                <Td>
                                  {currency}{" "}
                                  {currencyData.totalClosedPayout.toLocaleString(
                                    "en"
                                  )}
                                </Td>

                                <Td>
                                  {currency}{" "}
                                  {currencyData.profit.toLocaleString("en")}
                                </Td>
                              </Tr>
                            );
                          })}

                          {isVisible && renderTableRows(data[agentKey], 1, key)}
                        </>
                      )
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
