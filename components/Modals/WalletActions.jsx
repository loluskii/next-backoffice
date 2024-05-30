import React, { useEffect, useState } from "react";
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
import { getCurrencies } from "services/tickets.service";
import { performWalletAction } from "services/settings.service";

const WalletActions = ({ action, currency, onClose, isOpen, agentId }) => {
  const [formData, setFormData] = useState({
    fromCurrencyId: currency.id,
    toCurrencyId: currency.id,
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

    try {
      setIsCreating(true);
      const res = await performWalletAction(formData);
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
              {action === "add"
                ? `Fund ${currency.currencyId.countryId} Wallet`
                : action === "deduct" ? `Deduct From ${currency.currencyId.countryId} Wallet`: "Transfer Funds"}
              
            </Text>
            <ModalCloseButton bg="unset" />
          </ModalHeader>
          <ModalBody>
            {action === "deduct" && (
              <>
                <FormControl mb={4}>
                  <FormLabel>From</FormLabel>
                  <Input
                    name="currency"
                    type="text"
                    placeholder={currency.currencyId.countryId}
                    value={currency.currencyId.countryId}
                    readOnly
                  />
                </FormControl>
              </>
            )}

            {action === "add" && (
              <>
                <FormControl mb={4}>
                  <FormLabel>To</FormLabel>
                  <Input
                    name="currency"
                    type="text"
                    placeholder={currency.currencyId.countryId}
                    value={currency.currencyId.countryId}
                    readOnly
                  />
                </FormControl>
              </>
            )}

            {action === "transfer" && (
              <>
                <FormControl mb={4}>
                  <FormLabel>From</FormLabel>
                  <Select
                    name="toCurrencyId"
                    className="w-full pb-2"
                    onChange={(e) => handleChange(e)}
                    placeholder="Select a currency"
                    required
                  >
                    <option>Select a currency</option>
                    {currencies?.map((c, index) => (
                      <option value={c.id} key={index}>
                        {c.country[0].currencyCode}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>To</FormLabel>
                  <Select
                    name="toCurrencyId"
                    className="w-full pb-2"
                    onChange={(e) => handleChange(e)}
                    placeholder="Select a currency"
                    required
                  >
                    <option>Select a currency</option>
                    {currencies?.map((c, index) => (
                      <option value={c.id} key={index}>
                        {c.country[0].currencyCode}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <FormControl mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                name="amount"
                type="text"
                placeholder="12345"
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
