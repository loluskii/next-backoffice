// components/NestedAccordion.jsx

import React, { useState } from "react";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-gray-500">{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && <div className="p-4 border-t border-gray-300">{children}</div>}
    </div>
  );
};

const NestedAccordion = () => {
  const managers = [
    {
      name: "John Doe",
      users: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    },
    {
      name: "Jane Smith",
      users: [{ name: "David" }, { name: "Eve" }, { name: "Frank" }],
    },
  ];

  return (
    <div className="w-full">
      <AccordionItem title="Admin">
        {managers.map((manager, index) => (
          <AccordionItem key={index} title={manager.name}>
            {manager.users.map((user, userIndex) => (
              <AccordionItem key={`${index}-${userIndex}`} title={user.name} />
            ))}
          </AccordionItem>
        ))}
      </AccordionItem>
    </div>
  );
};

export default NestedAccordion;
