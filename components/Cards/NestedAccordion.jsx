import React, { Fragment, useEffect, useState } from "react";
import { getStructuredUsers } from "services/account.service";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import { IoCaretDown } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import CreateAgentCashier from "components/Modals/CreateAgent";
import PropTypes from "prop-types";

const NestedAccordion = ({
  data,
  setSelectedUser,
  setSelectedData,
  setUserRole,
}) => {
  const [agentsData, setAgentsData] = useState([]);
  const [cashiersData, setCashiersData] = useState([]);
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [createType, setCreateType] = useState(false);
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
    setSelectedUser(id);
    setSelectedData(res.data);
    setUserRole("agent");
    setFetchData(res.data);
    if (res.data.agents && res.data.agents.length) {
      const agentmap = agentsData.map((agentData) => {
        return agentData.id === id
          ? { ...agentData, state: !agentData.state }
          : { ...agentData, state: false };
      });
      setAgentsData(agentmap);
    }
  };

  return (
    <div className="flex flex-col px-4 justify-between w-full text-sm items-center text-[#A7A7A7]">
      {agentsData && agentsData.length ? (
        agentsData.map((agentData, i) => (
          <div key={i} className="bg-white rounded  h-full flex-grow w-full">
            <div
              style={{ gap: ".5rem" }}
              className="bg-red-900 flex border justify-between w-full items-center cursor-pointer"
            >
              <span
                onClick={() => handleAgentsState(agentData.id)}
                className="flex p-2 px-4 justify-start items-center w-full"
                style={{ gap: ".5rem" }}
              >
                <span className="p-2">
                  {agentData.state ? (
                    <IoCaretDown fontSize={18} />
                  ) : (
                    <AiFillCaretRight fontSize={18} />
                  )}
                </span>
                <IoIosPeople fontSize={28} />

                <h4 className="font-semibold">{agentData.name}</h4>
              </span>

              <span
                onClick={() => {
                  setCreateType(agentData.type);
                  showCreateAgentCashier(true);
                }}
                className="p-4 px-8"
              >
                <FaPlus fontSize={18} />
              </span>
            </div>
            <div
              className={`${
                agentData.state ? "max-h-[20rem] h-full" : "max-h-0 h-0"
              } overflow-hidden transition-all flex flex-col w-full gap-2 items-center `}
            >
              <NestedAccordion
                setUserRole={setUserRole}
                setSelectedData={setSelectedData}
                setSelectedUser={setSelectedUser}
                data={fetchData}
              />
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
      {cashiersData && cashiersData.length ? (
        cashiersData.map((cashierData, i) => (
          <div
            style={{ gap: ".5rem", paddingInline: "4rem" }}
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
      {createAgentCashier && (
        <CreateAgentCashier
          type={createType}
          isOpen={createAgentCashier}
          onClose={() => showCreateAgentCashier(false)}
        ></CreateAgentCashier>
      )}
    </div>
  );
};

export default NestedAccordion;
