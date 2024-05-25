import React, { useState } from "react";
import { currency_list } from "utils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Select,
} from "@chakra-ui/react";
import { createCurrency } from "services/tickets.service";
import { createAgentOrCashier } from "services/account.service";
import { FaCheckCircle } from "react-icons/fa";

const CreateAgentCashier = ({ type, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [agentCashierCreated, setAgentCashierCreated] = useState(false);
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await createAgentOrCashier(type, formData);
      if (res.status === 201) {
        setAgentCashierCreated(true);
        setUserData(res.data);
      }
    } catch (error) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      size={agentCashierCreated ? "sm" : "xl"}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      {agentCashierCreated ? (
        <>
          <ModalContent fontFamily="PolySans">
            <ModalBody p="23px 26px">
              <div className="text-center">
                <div className="flex justify-center">
                  <FaCheckCircle className="text-5xl" />
                </div>
                <div className="flex justify-between mt-8">
                  <p>Username: </p>
                  <b>{userData.email}</b>
                </div>
                <div className="flex justify-between mt-4">
                  <p>Password: </p>
                  <b style={{ maxWidth: "220px", textAlign: "right" }}>
                    {userData.password}
                  </b>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <ModalContent fontFamily="PolySans">
            <ModalHeader>
              <Text
                fontSize="20px"
                fontWeight="400"
                color="#293137"
                className="text-capitalize"
              >
                Create {type}
              </Text>
              <ModalCloseButton bg="unset" />
            </ModalHeader>
            <ModalBody p="23px 26px" overflowY="scroll">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  type="text"
                  placeholder="Agent Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Mobile</FormLabel>
                <Input
                  name="mobile"
                  type="number"
                  placeholder="12345"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter
              borderTop="1px solid #f1f1f1"
              justifyContent="flex-end"
            >
              <Button
                type="submit"
                h="35px"
                w="95px"
                bg="#2942FF"
                color="#fff"
                fontWeight="400"
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      )}
    </Modal>
  );
};

export default CreateAgentCashier;
