// components/NestedAccordion.jsx

import { Image } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { IoIosPeople } from "react-icons/io";
import { FaDesktop } from "react-icons/fa6";
import CreateAgentCashier from "components/Modals/CreateAgent";
import { MdAddBox } from "react-icons/md";
import { getStructuredUsers } from "services/account.service";
import { data } from "autoprefixer";

export const NestedAccordion = (props) => {
  const [users, setAgents] = useState({});
  const [createAgentCashier, showCreateAgentCashier] = useState(false);
  const [createType, setCreateType] = useState(false);

  const { data, setSelectedUser } = props;

  const AccordionItem = ({ user, data, text, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [fetchData, setFetchData] = useState({});

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    // async function getUserList() {
    //   const res = await getStructuredUsers(data?.id);
    //   setFetchData(res.data);
    // }

    console.log(data, "fetc");

    return (
      <div className={user === "cashier" ? "pl-3" : ""}>
        <div className="flex justify-between items-center p-4 cursor-pointer border-l border-b">
          <div className="flex items-center">
            <div
              onClick={() => {
                // getUserList();
                toggleAccordion();
              }}
            >
              {user !== "cashier" && (
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
              {user === "agent" ? (
                <IoIosPeople className="mr-2" />
              ) : user === "cashier" ? (
                <FaDesktop className="mr-2" />
              ) : (
                <></>
              )}
              {text}
            </h3>
          </div>
          {user === "agent" && (
            <button
              onClick={(e) => {
                // e.preventDefault();
                // setCreateuser(type);
                showCreateAgentCashier(true);
              }}
            >
              <MdAddBox />
            </button>
          )}
        </div>
        {isOpen && (
          <>
            <div className="px-4 pb-4 border-t border-l border-gray-300">
              {children}
            </div>
          </>
        )}
      </div>
    );
  };

  const Accordion = ({ type, data, title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fetchData, setFetchData] = useState({});

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    async function getUserList() {
      const res = await getStructuredUsers(data?.id);
      setFetchData(res.data);
    }

    // console.log(fetchData, "fetc");

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
          <>
            <div className="px-4 pb-4 border-t border-l border-gray-300">
              {children}
            </div>

            <div className="pl-4 border-t border-l border-gray-300">
              {fetchData?.agents?.map((agent, aIndex) => (
                <AccordionItem
                  key={`${aIndex}`}
                  text={agent.name}
                  user="agent"
                  data={agent}
                />
              ))}
              {fetchData?.cashiers?.map((cashier, cIndex) => (
                <AccordionItem
                  key={`${cIndex}`}
                  text={cashier.name}
                  user="cashier"
                  data={cashier}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    setAgents(data);
  }, [data]);

  return (
    <div className="w-full">
      <Accordion title="Admin" type="">
        {users && Object?.keys(users).length && (
          <>
            {users.agents.map((agent, aIndex) => (
              <Accordion
                key={`${aIndex}`}
                title={agent.name}
                type="agent"
                data={agent}
              />
            ))}
            {users.cashiers.map((cashier, cIndex) => (
              <Accordion
                key={`${cIndex}`}
                title={cashier.name}
                type="cashier"
                data={cashier}
              />
            ))}
          </>
        )}
      </Accordion>
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
