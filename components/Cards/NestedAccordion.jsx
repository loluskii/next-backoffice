import React, { Fragment, useEffect, useState } from "react";
import { getStructuredUsers } from "services/account.service";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import { IoCaretDown } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
const NestedAccordion = ({ data }) => {
  console.log("data", data);
  const [agentsData, setAgentsData] = useState([]);
  const [cashiersData, setCashiersData] = useState([]);
  const [fetchData, setFetchData] = useState({});
  useEffect(() => {
    const agents =
      data && data.agents
        ? data.agents.map((agent) => {
            return { ...agent, state: false };
          })
        : [];
    const cashiers =
      data && data.cashiers
        ? data.cashiers.map((agent) => {
            return { ...agent, state: false };
          })
        : [];
    setAgentsData(agents);
    setCashiersData(cashiers);
  }, [data]);
  const handleAgentsState = async (id) => {
    const res = await getStructuredUsers(id);
    setFetchData(res.data);
    const agentmap = agentsData.map((agentData) => {
      return agentData.id === id
        ? { ...agentData, state: !agentData.state }
        : { ...agentData, state: false };
    });
    setAgentsData(agentmap);
  };

  return (
    <div className="flex flex-col px-4 justify-between w-full text-sm items-center text-[#A7A7A7]">
      {agentsData && agentsData.length ? (
        agentsData.map((agentData, i) => (
          <div key={i} className="bg-white rounded  h-full flex-grow w-full">
            <div
              style={{ gap: ".5rem" }}
              onClick={() => handleAgentsState(agentData.id)}
              className="bg-red-900 flex p-2 border px-4 justify-between w-full items-center cursor-pointer"
            >
              <span
                className="flex justify-start items-center"
                style={{ gap: ".5rem" }}
              >
                <IoIosPeople fontSize={28} />

                <h4 className="font-semibold">{agentData.name}</h4>
              </span>
              <span className="p-2">
                {agentData.state ? (
                  <IoCaretDown fontSize={18} />
                ) : (
                  <AiFillCaretRight fontSize={18} />
                )}
              </span>
            </div>
            <div
              className={`${
                agentData.state ? "max-h-[20rem] h-full" : "max-h-0 h-0"
              } overflow-hidden transition-all flex flex-col w-full gap-2 items-center `}
            >
              <NestedAccordion data={fetchData} />
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
      {cashiersData && cashiersData.length ? (
        cashiersData.map((cashierData, i) => (
          <div
            style={{ gap: ".5rem" }}
            className="flex border p-4 justify-between w-full items-center cursor-pointer"
          >
            <span
              className="flex justify-start items-center"
              style={{ gap: ".5rem" }}
            >
              <FaDesktop fontSize={24} />

              <h4 className="font-semibold">{cashierData.name}</h4>
            </span>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default NestedAccordion;
