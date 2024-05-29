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

const WalletActions = ({ type, onClose, isOpen, agentId }) => {
  const [formData, setFormData] = useState({
    fromCurrencyId: "",
    toCurrencyId: "",
    userId: agentId,
    amount: "",
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
    const payload =
      accountType === "agent"
        ? { ...formData, currencyId: selectedCurrencyId }
        : formData;
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
    <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>
            <Text
              fontSize="20px"
              fontWeight="400"
              color="#293137"
              className="text-capitalize"
            >
              Fund Wallet
            </Text>
            <ModalCloseButton bg="unset" />
          </ModalHeader>
          <ModalBody>
            <FormControl mt={4}>
              <FormLabel>From</FormLabel>
              <Select
                name="fromCurrencyId"
                className="w-full pb-2"
                value={formData.fromCurrencyId}
                onChange={(e) => handleChange(e)}
                placeholder={formData.fromCurrencyId}
              >
                {currencies?.map((c, index) => (
                  <option value={c.id} key={index}>
                    {c.country[0].currencyCode}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>To</FormLabel>
              <Select
                name="toCurrencyId"
                className="w-full pb-2"
                value={formData.toCurrencyId}
                onChange={(e) => handleChange(e)}
                placeholder={formData.toCurrencyId}
              >
                {currencies?.map((c, index) => (
                  <option value={c.id} key={index}>
                    {c.country[0].currencyCode}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                name="mobile"
                type="number"
                placeholder="12345"
                value={formData.amount}
                onChange={handleChange}
              />
            </FormControl>

            {errorMessage ? (
              <p className="text-red-500 my-2">{errorMessage}</p>
            ) : (
              ""
            )}
          </ModalBody>

          <ModalFooter borderTop="1px solid #f1f1f1" justifyContent="flex-end">
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
    </Modal>
  );
};

export default WalletActions;
