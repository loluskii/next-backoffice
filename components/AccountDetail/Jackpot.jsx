import React, { useState, useEffect } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Divider,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { getJackpots, updateJackpot } from "services/jackpot.service";
import moment from "moment-timezone";

const Jackpot = ({ activeAgentId, selectedUser }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jackpot, setJackpot] = useState([]);
  const [gameType, setGameType] = useState("aviata");

  const fetchJackpot = async (gametype) => {
    setLoading(true);
    setGameType(gametype);
    let payload = {
      agentId: activeAgentId.id,
      gameType: gametype,
    };
    const res = await getJackpots(payload);
    setLoading(false);
    if (res) {
      setJackpot(res);
    } else {
      setJackpot([]);
    }
  };

  const submitJackpotUpdate = async (index) => {
    setSubmitting(true);
    let payload = jackpot[index];
    if (payload) {
      payload.jackpotId = jackpot[index]._id;
      delete payload._id;
      delete payload.__v;
      delete payload.agentId;
      delete payload.gameType;
      delete payload.jackpotName;
    }
    const res = await updateJackpot(payload);
    if (res.status) {
      alert("Jackpot updated successfully");
      jackpot[index] = { ...jackpot[index], ...res.data };
    } else {
      alert("An error occurred");
    }
    setSubmitting(false);
  };

  const handleChangeForJackpot = (e, index) => {
    const { name, value } = e.target;
    const newJackpot = [...jackpot];
    newJackpot[index][name] = value;
    setJackpot(newJackpot);
  };

  const handleChangeForJackpotPeriod = (date, name, index) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (date instanceof moment) {
      const localDate = moment(date).tz(tz).format();
      const newJackpot = [...jackpot];
      newJackpot[index][name] = localDate;
      setJackpot(newJackpot);
    }
  };

  useEffect(() => {
    fetchJackpot(gameType);
  }, [selectedUser]);

  return (
    <>
      {loading ? (
        <div className="p-4 flex flex-col items-center w-full h-full justify-center">
          <Spinner size="xl" />
        </div>
      ) : jackpot.length === 0 ? (
        <Center bg="gray" h="100px" color="white">
          No Jackpots Available
        </Center>
      ) : (
        <>
          <Stack direction="row" align="center">
            <Button
              size="xs"
              colorScheme={gameType === "aviata" ? "blue" : "gray"}
              onClick={() => fetchJackpot("aviata")}
            >
              Aviata
            </Button>
            <Button
              size="xs"
              colorScheme={gameType === "shootout" ? "blue" : "gray"}
              onClick={() => fetchJackpot("shootout")}
            >
              Shoot Out
            </Button>
          </Stack>

          <Divider className="my-4" />

          <Tabs>
            <TabList>
              {jackpot?.map((item, index) => (
                <Tab
                  key={index}
                  className="text-left focus:outline-none focus:border-none focus:ring-0"
                >
                  {item.jackpotName} Jackpot
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {jackpot?.map((item, index) => (
                <TabPanel key={index}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitJackpotUpdate(index);
                    }}
                    className="w-full"
                  >
                    <Stack direction="row" align="center" className="mb-5">
                      <FormControl>
                        <FormLabel>Low Limit Amount</FormLabel>
                        <Input
                          type="number"
                          name="lowLimitAmount"
                          value={item.lowLimitAmount}
                          onChange={(e) => handleChangeForJackpot(e, index)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>High Limit Amount</FormLabel>
                        <Input
                          type="number"
                          name="highLimitAmount"
                          value={item.highLimitAmount}
                          onChange={(e) => handleChangeForJackpot(e, index)}
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="row" align="center" className="mb-5">
                      <FormControl>
                        <FormLabel>Min. Shown Amount</FormLabel>
                        <Input
                          type="number"
                          name="minDisplayAmount"
                          value={item.minDisplayAmount}
                          onChange={(e) => handleChangeForJackpot(e, index)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Min. Stake to win</FormLabel>
                        <Input
                          type="number"
                          name="minStakeToWin"
                          value={item.minStakeToWin}
                          onChange={(e) => handleChangeForJackpot(e, index)}
                        />
                      </FormControl>
                    </Stack>
                    <FormControl className="mb-5">
                      <FormLabel>Percentage Contribution</FormLabel>
                      <NumberInput
                        defaultValue={item.percentageContributions}
                        min={0}
                        max={1}
                      >
                        <NumberInputField
                          name="percentageContributions"
                          type="number"
                          onChange={(e) => handleChangeForJackpot(e, index)}
                        />
                      </NumberInput>
                    </FormControl>
                    <Stack direction="row" align="center" className="mb-5">
                      <FormControl>
                        <FormLabel>Start Time</FormLabel>
                        <Datetime
                          value={moment(item.startTime).toDate()}
                          onChange={(date) =>
                            handleChangeForJackpotPeriod(
                              date,
                              "startTime",
                              index
                            )
                          }
                          dateFormat="MMMM D, YYYY" // Format for the date
                          timeFormat="hh:mm A" // Format for the time
                          inputProps={{
                            placeholder: "Select date and time",
                            className: "w-full focus:outline-none rounded",
                            name: "startTime",
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>End Time</FormLabel>
                        <Datetime
                          value={moment(item.endTime).toDate()}
                          onChange={(date) =>
                            handleChangeForJackpotPeriod(date, "endTime", index)
                          }
                          dateFormat="MMMM D, YYYY" // Format for the date
                          timeFormat="hh:mm A" // Format for the time
                          inputProps={{
                            placeholder: "Select date and time",
                            className: "w-full focus:outline-none rounded",
                            name: "endTime",
                          }}
                        />
                      </FormControl>
                    </Stack>
                    <Button
                      type="submit"
                      isLoading={submitting}
                      className="bg-black text-white"
                      colorScheme="blue"
                    >
                      Update
                    </Button>
                  </form>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </>
      )}
    </>
  );
};

export default Jackpot;
