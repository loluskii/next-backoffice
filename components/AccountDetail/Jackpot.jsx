import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { getJackpots, updateJackpot } from "services/jackpot.service";

const Jackpot = ({ activeAgentId }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jackpot, setJackpot] = useState([
    {
      percentageContributions: 1,
      lowLimitAmount: 1000,
      highLimitAmount: 2000,
      minDisplayAmount: 800,
      minStakeToWin: 100,
      gameType: "aviata",
      _id: "66dae598ccdab3cae738c94b",
      agentId: "665bc43de04161df7a9c27ca",
      jackpotName: "Silver",
      __v: 0,
    },
    {
      percentageContributions: 1,
      lowLimitAmount: 1000,
      highLimitAmount: 2000,
      minDisplayAmount: 800,
      minStakeToWin: 100,
      gameType: "aviata",
      _id: "66dae5a3ccdab3cae738c94c",
      agentId: "665bc43de04161df7a9c27ca",
      jackpotName: "Gold",
      __v: 0,
    },
    {
      percentageContributions: 1,
      lowLimitAmount: 1000,
      highLimitAmount: 2000,
      minDisplayAmount: 800,
      minStakeToWin: 100,
      gameType: "aviata",
      _id: "66daed7cccdab3cae738c952",
      agentId: "665bc43de04161df7a9c27ca",
      jackpotName: "Bronze",
      __v: 0,
    },
  ]);
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
    }
    const res = await updateJackpot(payload);
    if (res.status) {
      alert("Jackpot updated successfully");
      jackpot[index] = { ...jackpot[index], ...res.data };
    } else {
      alert("An error occured");
    }
    setSubmitting(false);
  };

  const handleChangeForJackpot = (e, index) => {
    const { name, value } = e.target;
    const newJackpot = [...jackpot];
    newJackpot[index][name] = value;
    setJackpot(newJackpot);
  };

  useEffect(() => {
    fetchJackpot(gameType);
  }, []);
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
                      <Input
                        type="number"
                        name="percentageContributions"
                        value={item.percentageContributions}
                        onChange={(e) => handleChangeForJackpot(e, index)}
                      />
                    </FormControl>
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
