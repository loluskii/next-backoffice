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
import { updateCurrency } from "services/tickets.service";

const EditCurrency = ({ currency, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    decimals: currency.decimals,
    exchangeRate: currency.exchangeRate,
    updateType: currency.updateType,
    status: currency.status,
    countryId: currency.countryId,
    country: currency.country,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const res = await updateCurrency(currency.id, formData);
    setLoading(false);
    onClose();
    // Handle form submission here
    console.log("Form submitted with data:", res);
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrencyId = parseInt(e.target.value);
    const selectedCurrency = currency_list.find(
      (currency) => currency.id === selectedCurrencyId
    );

    if (selectedCurrency) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        countryId: selectedCurrency.code,
        country: {
          name: selectedCurrency.name,
          currencyCode: selectedCurrency.code,
          currencySymbol: selectedCurrency.symbol,
        },
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent fontFamily="PolySans">
          <ModalHeader>
            <Text fontSize="20px" fontWeight="400" color="#293137">
              Edit Currency
            </Text>
            <ModalCloseButton bg="unset" />
          </ModalHeader>
          <ModalBody p="23px 26px">
            <FormControl>
              <FormLabel>Decimals</FormLabel>
              <Input
                name="decimals"
                type="number"
                placeholder="Decimals"
                value={formData.decimals}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Exchange Rate</FormLabel>
              <Input
                name="exchangeRate"
                type="number"
                placeholder="Exchange Rate"
                value={formData.exchangeRate}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Update Type</FormLabel>
              <Select
                name="updateType"
                className="w-full"
                value={formData.updateType}
                onChange={handleChange}
              >
                <option value="manual">Manual</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                className="w-full"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter borderTop="1px solid #f1f1f1" justifyContent="flex-end">
            <Button
              type="submit"
              h="35px"
              w="95px"
              bg="#2942FF"
              color="#fff"
              fontWeight="400"
              isLoading={loading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EditCurrency;
