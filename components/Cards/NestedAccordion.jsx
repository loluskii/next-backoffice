// components/NestedAccordion.jsx

import { Image } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { MdAddBox } from "react-icons/md";
import { getStructuredUsers } from "services/account.service";

export const NestedAccordion = (props) => {
  const [users, setAgents] = useState({});
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [createType, setCreateType] = useState(false);
  const [fetchData, setFetchData] = useState({});
  async function getUserList() {
    const res = await getStructuredUsers(data.id);
    setFetchData(res.data);
  }

  const { data, setSelectedUser } = props;

  const AccordionItem = ({ title, type, data, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };


    return (
      <div className={type === "cashier" ? "pl-3" : ""}>
        <div className="flex justify-between items-center p-4 cursor-pointer border-l border-b">
          <div className="flex items-center">
            <div
              onClick={() => {
                getUserList();
                toggleAccordion();
              }}
            >
              {type !== "cashier" && (
                <>
                  {isOpen ? (
                    <i className="fas fa-caret-down mr-2"></i>
                  ) : (
                    <i className="fas fa-caret-right mr-2"></i>
                  )}
                </>
              )}
            </div>
            <h3
              className="text-lg font-semibold flex items-center"
              onClick={(e) => {
                setIsOpen(!isOpen);
                setSelectedUser(data);
              }}
            >
              {type === "agent" ? (
                <IoIosPeople className="mr-2" />
              ) : type === "cashier" ? (
                <FaDesktop className="mr-2" />
              ) : (
                <></>
              )}
              {title}
            </h3>
          </div>
          {type === "agent" && (
            <button
              onClick={(e) => {
                // e.preventDefault();
                setCreateType(type);
                showCreateAgentCashier(true); // Set modal visibility to true
              }}
            >
              <MdAddBox />
            </button>
          )}
        </div>
        {isOpen && (
          <div className="px-4 pb-4 border-t border-l border-gray-300">
            {children}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setAgents(fetchData);
  }, [fetchData]);

  return (
    <div className="w-full">
      <AccordionItem title="Admin" type="">
        {users && Object?.keys(users).length && (
          <>
            {users.agents.map((agent, aIndex) => (
              <AccordionItem
                key={`${aIndex}`}
                title={agent.name}
                type="agent"
                data={agent}
              />
            ))}
            {users.cashiers.map((cashier, cIndex) => (
              <AccordionItem
                key={`${cIndex}`}
                title={cashier.name}
                type="cashier"
                data={cashier}
              />
            ))}
          </>
        )}
      </AccordionItem>

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
