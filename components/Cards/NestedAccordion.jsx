// components/NestedAccordion.jsx

import { Image } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { getStructuredUsers } from "services/account.service";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { MdAddBox } from "react-icons/md";

export const NestedAccordion = (props) => {
  const [users, setAgents] = useState({});
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [createType, setCreateType] = useState(false);

  const { data } = props;

  const AccordionItem = ({ title, type, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className={type === "cashier" ? "pl-3" : ""}>
        <div className="flex justify-between items-center p-4 cursor-pointer border-l border-b">
          <div className="flex items-center">
            <div onClick={toggleAccordion}>
              {isOpen ? (
                <i className="fas fa-caret-down mr-2"></i>
              ) : (
                <i className="fas fa-caret-right mr-2"></i>
              )}
            </div>
            <h3 className="text-lg font-semibold flex items-center">
              {type === "agent" ? (
                // <Image src="/agent.svg" className="" style={} />
                <IoIosPeople className="mr-2" />
              ) : (
                <FaDesktop className="mr-2" />
              )}
              {title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              // e.preventDefault();
              setCreateType(type);
              showCreateAgentCashier(true); // Set modal visibility to true
            }}
          >
            <MdAddBox />
          </button>
        </div>
        {isOpen && (
          <div className="px-4 pb-4 border-t border-l border-gray-300">
            {children}
          </div>
        )}
      </div>
    );
  };

  // async function getUsers() {
  //   const res = await getStructuredUsers();
  //   setAgents(res.data);
  //   console.log(res);
  // }

  useEffect(() => {
    setAgents(data);
  }, [data]);

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
              />
            ))}
            {users.cashiers.map((cashier, cIndex) => (
              <AccordionItem
                key={`${cIndex}`}
                title={cashier.name}
                type="cashier"
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
