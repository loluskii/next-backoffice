import React, { useState, useEffect } from "react";
import { getStructuredUsers, getUser } from "services/account.service";
import { getGameSettings } from "services/settings.service";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import { FaRegSquarePlus, FaRegSquareMinus, FaPlus } from "react-icons/fa6";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { Spinner } from "@chakra-ui/react";
import clsx from "clsx";

const NestedAccordion = ({
  setUserWallets,
  setUserRole,
  setSelectedData,
  setSelectedUser,
  setGameData,
  setGameSettings,
  setActiveAgentId,
  data,
  activeAgentId,
}) => {
  const [agentsData, setAgentsData] = useState([]);
  const [cashiersData, setCashiersData] = useState([]);
  const [parentAgentId, setParentAgentId] = useState(null);
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (data) {
      setAgentsData(
        data.agents
          ? data.agents.map((agent) => ({ ...agent, state: false }))
          : []
      );
      setCashiersData(
        data.cashiers
          ? data.cashiers.map((agent) => ({ ...agent, state: false }))
          : []
      );
    }
  }, [data]);

  const fetchUserData = async (id, type) => {
    setLoading((prev) => ({ ...prev, [id]: true }));

    const [res, user, gameSettings] = await Promise.all([
      getStructuredUsers(id),
      getUser(id),
      getGameSettings(id),
    ]);

    setActiveAgentId(user);
    setUserWallets(user.wallets);
    setParentAgentId(id);
    setSelectedUser(id);
    setSelectedData(res.data);
    setUserRole(type);
    setFetchedData((prevData) => ({ ...prevData, [id]: res.data }));
    setLoading((prev) => ({ ...prev, [id]: false }));

    if (type === "agent") {
      setGameData(gameSettings.data.game[0]);
      setGameSettings(gameSettings.data.gameConfig[0]);
    }
  };

  const handleMainClick = async (data, type) => {
    if (fetchedData[data.id]) {
      // Data already fetched, just toggle dropdown
      setActiveAgentId(data);
      // setAgentsData((prevAgentsData) =>
      //   prevAgentsData.map((agentData) => ({
      //     ...agentData,
      //     state: agentData.id === data.id ? !agentData.state : agentData.state,
      //   }))
      // );
    } else {
      // Fetch data and toggle dropdown
      await fetchUserData(data.id, type);
    }
  };

  const toggleDropdown = async (data) => {
    const isCurrentlyOpen = agentsData.find(
      (agentData) => agentData.id === data.id
    )?.state;

    if (!isCurrentlyOpen) {
      await fetchUserData(data.id, "agent");
    }

    setAgentsData((prevAgentsData) =>
      prevAgentsData.map((agentData) => ({
        ...agentData,
        state: agentData.id === data.id ? !agentData.state : agentData.state,
      }))
    );
  };

  return (
    <div className="flex flex-col pl-4 justify-between w-full text-sm items-center text-[#A7A7A7]">
      {agentsData.length > 0 &&
        agentsData.map((agentData, i) => (
          <div key={i} className="bg-white rounded h-full flex-grow w-full">
            <div
              className="hover-bg-blueGrey-100 flex border justify-between w-full items-center cursor-pointer"
              style={{ gap: ".5rem" }}
              onClick={(e) => {
                e.preventDefault();
                handleMainClick(agentData, "agent");
              }}
            >
              <div
                className={clsx("flex p-2 justify-start items-center", {
                  "text-lightBlue-500": agentData.id === activeAgentId?.id,
                })}
                style={{ gap: ".5rem" }}
              >
                <span
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!loading[agentData.id]) {
                      toggleDropdown(agentData);
                    }
                  }}
                >
                  {agentData.state ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
                </span>
                <IoIosPeople fontSize={20} />
                <h4 className="font-semibold">{agentData.name}</h4>
              </div>

              {loading[agentData.id] && (
                <span className="p-4 px-8">
                  <Spinner size="xs" />
                </span>
              )}

              {!loading[agentData.id] && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    showCreateAgentCashier(true);
                    setParentAgentId(agentData.id);
                  }}
                  className="p-4 px-8"
                >
                  <FaPlus />
                </span>
              )}
            </div>
            <div
              className={clsx(
                "overflow-hidden transition-all flex flex-col w-full gap-2 items-center",
                {
                  "max-h-[20rem] h-full": agentData.state,
                  "max-h-0 h-0": !agentData.state,
                }
              )}
            >
              {agentData.state && (
                <NestedAccordion
                  setUserWallets={setUserWallets}
                  setUserRole={setUserRole}
                  setSelectedData={setSelectedData}
                  setSelectedUser={setSelectedUser}
                  setGameData={setGameData}
                  setGameSettings={setGameSettings}
                  setActiveAgentId={setActiveAgentId}
                  data={fetchedData[agentData.id]}
                  activeAgentId={activeAgentId}
                />
              )}
            </div>
          </div>
        ))}
      <div className="pl-4 w-full">
        {cashiersData.length > 0 &&
          cashiersData.map((cashierData, j) => (
            <div
              key={j}
              className="flex border p-4 justify-between w-full items-center cursor-pointer"
              style={{ gap: ".5rem" }}
              onClick={() => handleMainClick(cashierData, "cashier")}
            >
              <span
                className="flex justify-start items-center"
                style={{ gap: ".5rem" }}
              >
                <FaDesktop />
                <h4 className="font-semibold">{cashierData.name}</h4>
              </span>
            </div>
          ))}
      </div>
      {createAgentCashier && (
        <CreateAgentCashier
          type={"indirect"}
          agentId={parentAgentId}
          isOpen={createAgentCashier}
          onClose={() => showCreateAgentCashier(false)}
        />
      )}
    </div>
  );
};

export default NestedAccordion;
