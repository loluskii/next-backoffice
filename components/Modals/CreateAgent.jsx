import React, { useEffect, useState } from "react";
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
import { createCurrency, getCurrencies } from "services/tickets.service";
import { createAgentOrCashier } from "services/account.service";
import { FaCheckCircle } from "react-icons/fa";

const CreateAgentCashier = ({ type, onClose, isOpen, agentId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [agentCashierCreated, setAgentCashierCreated] = useState(false);
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [accountType, setAccountType] = useState("");

  async function getCurrencyData() {
    const res = await getCurrencies();
    setCurrencies(res.results);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let payload;
    if (accountType === "agent") {
      if (type === "indirect") {
        payload = {
          ...formData,
          currencyId: selectedCurrencyId,
          agentId: agentId,
        };
      } else {
        payload = {
          ...formData,
          currencyId: selectedCurrencyId,
        };
      }
    } else {
      payload = {
        ...formData,
        currencyId: selectedCurrencyId,
      };
    }
    try {
      setIsCreating(true);
      const res = await createAgentOrCashier(accountType, payload);
      setIsCreating(false);
      setAgentCashierCreated(true);
      setUserData(res.data);
    } catch (error) {
      setErrorMessage(error.data.message);
    }
  };

  useEffect(() => {
    getCurrencyData();
  }, []);

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
                <div className="flex flex-col items-center justify-center">
                  <FaCheckCircle className="text-5xl" />
                  <p>Success!</p>
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
          <ModalContent>
            <ModalHeader>
              <Text
                fontSize="20px"
                fontWeight="400"
                color="#293137"
                className="text-capitalize"
              >
                Create User
              </Text>
              <ModalCloseButton bg="unset" />
            </ModalHeader>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Account Type</FormLabel>
                <Select
                  name="type"
                  className="w-full pb-2"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  placeholder={"select a type"}
                >
                  <option value="agent">Agent</option>
                  <option value="cashier">Cashier</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  type="text"
                  placeholder="Name"
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
              {accountType === "agent" && (
                <FormControl mt={4}>
                  <FormLabel>Active Currency</FormLabel>
                  <Select
                    name="currencyId"
                    className="w-full pb-2"
                    value={selectedCurrencyId}
                    onChange={(e) => setSelectedCurrencyId(e.target.value)}
                    // placeholder={selectedCurrencyId}
                  >
                    <option>Select currency</option>
                    {currencies?.map((c, index) => (
                      <option value={c.id} key={index}>
                        {c.country[0].currencyCode}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}

              {errorMessage ? (
                <p className="text-red-500 my-2">{errorMessage}</p>
              ) : (
                ""
              )}
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
                disabled={isCreating}
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
