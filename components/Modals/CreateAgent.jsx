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
  Flex,
} from "@chakra-ui/react";
import { createCurrency, getCurrencies } from "services/tickets.service";
import { createAgentOrCashier, getUser } from "services/account.service";
import { FaCheckCircle } from "react-icons/fa";

const CreateAgentCashier = ({ type, onClose, isOpen, agentId }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [agentCashierCreated, setAgentCashierCreated] = useState(false);
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [userWallets, setUserWallets] = useState([]);

  async function getCurrencyData() {
    const res = await getCurrencies();
    setCurrencies(res.results);
  }

  async function getWallets() {
    const currentUser = localStorage.getItem("currentUser");
    let storedUser = currentUser ? JSON.parse(currentUser) : null;
    const res = await getUser(storedUser.id);
    setUserWallets(res.wallets);
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
      if (type === "indirect") {
        payload = {
          ...formData,
          agentId: agentId,
        };
      } else {
        payload = {
          ...formData,
        };
      }
      // payload = formData
    }
    try {
      setIsCreating(true);
      const res = await createAgentOrCashier(accountType, payload);
      setIsCreating(false);
      setAgentCashierCreated(true);
      setUserData(res.data);
    } catch (error) {
      setErrorMessage(error.data.message);
      setIsCreating(false);
    }
  };

  useEffect(() => {
    getCurrencyData();
    getWallets();
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
                  <b>{userData.username}</b>
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
                  placeholder={"Select a type"}
                >
                  <option value="agent">Agent</option>
                  <option value="cashier">Cashier</option>
                </Select>
              </FormControl>

              <Flex>
                <FormControl flex={1} mr={2}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl flex={1} ml={2}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </FormControl>
              </Flex>

              <Flex mt={4}>
                <FormControl flex={1} mr={2}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl flex={1} ml={2}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    placeholder="****"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
              </Flex>

              <FormControl my={3}>
                <FormLabel>Mobile</FormLabel>
                <Input
                  name="mobile"
                  type="number"
                  placeholder="1234"
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
                  >
                    <option>Select a currency</option>
                    {userWallets?.map(
                      (c, index) =>
                        c.currencyId && (
                          <option value={c?.currencyId?.id} key={index}>
                            {`${c?.currencyId?.countryId} (${c?.currencyId?.exchangeRate})`}
                          </option>
                        )
                    )}
                  </Select>
                </FormControl>
              )}

              {errorMessage && (
                <p className="text-red-500 my-2">{errorMessage}</p>
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
                isLoading={isCreating}
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
