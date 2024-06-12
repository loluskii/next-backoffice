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
import { createWallet, fundOrDeductWallet } from "services/settings.service";
import { FaCheckCircle } from "react-icons/fa";

const WalletActions = ({ action, currency, onClose, isOpen, agentId }) => {
  const [walletActionPerformed, setWalletActionPerformed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [fromCurrencyId, setFromCurrencyId] = useState("");
  const [toCurrencyId, setToCurrencyId] = useState("");
  const [conversionRate, setConversionRate] = useState("0");
  const [fromC, setFromC] = useState("");
  const [amount, setAmount] = useState("");

  function handleToCurrency(id) {
    setToCurrencyId(id);
    const fromCurrency = currencies.find(
      (currency) => currency.id === fromCurrencyId
    );
    const toCurrency = currencies.find((currency) => currency.id === id);
    const rate = fromCurrency.exchangeRate / toCurrency.exchangeRate;
    setFromC(fromCurrency.countryId);
    setConversionRate(`${toCurrency.countryId} ${rate.toFixed(4)}`);
  }

  async function getCurrencyData() {
    const res = await getCurrencies();
    setCurrencies(res.results);
  }

  const createWalletAction = async (e) => {
    e.preventDefault();
    let payload = {
      fromCurrencyId: fromCurrencyId,
      toCurrencyId: toCurrencyId,
      userId: agentId,
      amount: amount,
    };
    try {
      setIsCreating(true);
      await createWallet(payload);
      setIsCreating(false);
      setWalletActionPerformed(true);
    } catch (error) {
      setErrorMessage(error.data.message);
    }
  };

  const performWalletAction = async (event) => {
    event.preventDefault();
    let payload = {
      currencyId: currency.currencyId.id,
      userId: agentId,
      amount: action === "add" ? amount : `-${amount}`,
    };
    try {
      setIsCreating(true);
      await fundOrDeductWallet(payload);
      setIsCreating(false);
      setWalletActionPerformed(true);
    } catch (error) {
      setErrorMessage(error.data.message);
    }
  };

  const handleSubmit = (e) => {
    return action === "transfer"
      ? createWalletAction(e)
      : performWalletAction(e);
  };

  useEffect(() => {
    getCurrencyData();
  }, []);

  return (
    <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
      <ModalOverlay />
      {walletActionPerformed ? (
        <>
          <ModalContent fontFamily="PolySans">
            <ModalBody p="23px 26px">
              <div className="text-center">
                <div className="flex flex-col items-center justify-center">
                  <FaCheckCircle className="text-5xl" />
                  <p>Success!</p>
                </div>
                <p className="font-bold text-xl">Action Successful!</p>
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
                {action === "add"
                  ? `Fund ${currency.currencyId.countryId} Wallet`
                  : action === "deduct"
                  ? `Deduct From ${currency.currencyId.countryId} Wallet`
                  : "Transfer Funds"}
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
                      name="fromCurrencyId"
                      className="w-full pb-2"
                      onChange={(e) => setFromCurrencyId(e.target.value)}
                      required
                    >
                      <option>Select a currency</option>
                      {currencies?.map((c, index) => (
                        <option value={c.id} key={index}>
                          {`${c.country[0].currencyCode}(${c.exchangeRate})`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>To</FormLabel>
                    <Select
                      name="toCurrencyId"
                      className="w-full pb-2"
                      onChange={(e) => {
                        handleToCurrency(e.target.value);
                      }}
                      required
                    >
                      <option>Select a currency</option>
                      {currencies?.map((c, index) => (
                        <option value={c.id} key={index}>
                          {`${c.country[0].currencyCode}(${c.exchangeRate})`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {toCurrencyId && (
                    <FormControl mb={4}>
                      <FormLabel>Currency Rate {`(1 ${fromC})`}</FormLabel>
                      <Input
                        name="amount"
                        type="text"
                        readOnly
                        value={conversionRate}
                      />
                    </FormControl>
                  )}
                </>
              )}

              <FormControl mb={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  type="text"
                  placeholder="12345"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>

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

export default WalletActions;
