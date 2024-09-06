import React, { useEffect, useState } from "react";
import Admin from "layouts/Admin.jsx";
import {
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { getCurrencies } from "services/tickets.service";
import CreateCurrency from "components/Modals/CreateCurrency";
import EditCurrency from "components/Modals/EditCurrency";

const Currency = () => {
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [showCreateCurrency, setShowCreateCurrency] = useState(false);
  const [showEditCurrency, setShowEditCurrency] = useState(false);
  const [activeEditCurrency, setActiveEditCurrency] = useState({});

  async function getCurrencyData() {
    setLoading(true);
    const res = await getCurrencies();
    setCurrencies(res.results);
    setLoading(false);
  }

  useEffect(() => {
    getCurrencyData();
  }, []);

  return (
    <>
      <div className="h-screen">
        <CreateCurrency
          isOpen={showCreateCurrency}
          onClose={() => {
            setShowCreateCurrency(false);
            getCurrencyData();
          }}
        />

        <div className="title flex flex-row justify-between items-center mb-8">
          <h3 className="text-2xl">Currency Settings</h3>
          <button
            type="button"
            className="bg-black text-white rounded px-3 py-2"
            onClick={() => setShowCreateCurrency(true)}
          >
            Add Currency
          </button>
        </div>
        <div className="bg-white mt-3">
          <TableContainer>
            <Table className="table table-striped table-bordered">
              <Thead className="bg-gray-500">
                <Tr>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Country ID
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Currency
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Rate
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Decimals
                  </Th>
                  <Th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 border-blueGray-100">
                    Status
                  </Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <tr>
                    <td colspan="10" className="text-center">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {currencies?.length ? (
                      <>
                        {currencies.map((res, index) => (
                          <>
                            <Tr key={index}>
                              <Td className="text-center">{res.countryId}</Td>
                              <Td className="text-center">
                                {res.country[0].currencyCode}(
                                {res.country[0].currencySymbol})
                              </Td>
                              <Td className="text-center">
                                {res.exchangeRate}
                              </Td>
                              <Td className="text-center">{res.decimals}</Td>
                              <Td className="text-center">{res.status}</Td>
                              <Td className="text-center">
                                <button
                                  className="px-2  text-white py-1 bg-black rounded"
                                  onClick={() => {
                                    setActiveEditCurrency(res);
                                    setShowEditCurrency(true);
                                  }}
                                >
                                  Edit
                                </button>
                              </Td>
                            </Tr>
                          </>
                        ))}
                      </>
                    ) : (
                      <Tr>
                        <Td className="text-center" colSpan="10">
                          No Data Available.
                        </Td>
                      </Tr>
                    )}
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
        {showEditCurrency && (
          <EditCurrency
            isOpen={showEditCurrency}
            onClose={() => setShowEditCurrency(false)}
            currency={activeEditCurrency}
          ></EditCurrency>
        )}
      </div>
    </>
  );
};

export default Currency;
Currency.layout = Admin;
