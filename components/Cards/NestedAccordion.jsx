import React, { Fragment, useEffect, useState } from "react";
import { getStructuredUsers, getUser } from "services/account.service";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import { IoCaretDown } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { MdAddBox } from "react-icons/md";

const NestedAccordion = ({
  data,
  setSelectedUser,
  setSelectedData,
  setUserRole,
  setUserWallets,
}) => {
  const [agentsData, setAgentsData] = useState([]);
  const [cashiersData, setCashiersData] = useState([]);
  const [parentAgentId, setParentAgentId] = useState(null);
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
  const handleUserState = async (id, type) => {
    if (agentsData.state) {
    } else {
      const [res, user] = await Promise.all([
        getStructuredUsers(id),
        getUser(id),
      ]);
      setUserWallets(user.wallets);
      setParentAgentId(id);
      setSelectedUser(id);
      setSelectedData(res.data);
      setUserRole(type);
      setFetchData(res.data);
      if (res.data.agents) {
        const updatedAgentsData = agentsData.map((agentData) => ({
          ...agentData,
          state: agentData.id === id && !agentData.state,
        }));
        setAgentsData(updatedAgentsData);
      }
    }
  };

  return (
    <div className="flex flex-col pl-4 justify-between w-full text-sm items-center text-[#A7A7A7]">
      {agentsData && agentsData.length ? (
        agentsData.map((agentData, i) => (
          <div key={i} className="bg-white rounded  h-full flex-grow w-full">
            <div
              style={{ gap: ".5rem" }}
              className="bg-red-900 flex border justify-between w-full items-center cursor-pointer"
            >
              <span
                onClick={() => handleUserState(agentData.id, "agent")}
                className="flex p-2 justify-start items-center w-full"
                style={{ gap: ".5rem" }}
              >
                <span className="p-2">
                  {agentData.state ? <IoCaretDown /> : <AiFillCaretRight />}
                </span>
                <IoIosPeople fontSize={20} />

                <h4 className="font-semibold">{agentData.name}</h4>
              </span>

              <span
                onClick={() => {
                  setCreateType("agent");
                  showCreateAgentCashier(true);
                  setParentAgentId(agentData.id);
                }}
                className="p-4 px-8"
              >
                <MdAddBox />
              </span>
            </div>
            <div
              className={`${
                agentData.state ? "max-h-[20rem] h-full" : "max-h-0 h-0"
              } overflow-hidden transition-all flex flex-col w-full gap-2 items-center `}
            >
              <NestedAccordion
                setUserWallets={setUserWallets}
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
      <div className="pl-4 w-full">
        {cashiersData && cashiersData.length ? (
          cashiersData.map((cashierData, i) => (
            <div
              style={{ gap: ".5rem" }}
              className="flex border p-4 justify-between w-full items-center cursor-pointer"
            >
              <span
                className="flex justify-start items-center"
                style={{ gap: ".5rem" }}
                onClick={() => handleUserState(cashierData.id, "cashier")}
              >
                <FaDesktop />

                <h4 className="font-semibold">{cashierData.name}</h4>
              </span>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      {createAgentCashier && (
        <CreateAgentCashier
          type={"indirect"}
          agentId={parentAgentId}
          isOpen={createAgentCashier}
          onClose={() => showCreateAgentCashier(false)}
        ></CreateAgentCashier>
      )}
    </div>
  );
};

export default NestedAccordion;
