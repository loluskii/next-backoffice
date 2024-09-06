import React, { useEffect, useState } from "react";
import {
  Stack,
  Spinner,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import { updateGameData, getGameSettings } from "services/settings.service";

function GameSettings({ selectedUser, authUser, loading }) {
  const [activeGame, setActiveGame] = useState("aviata");
  const [isLoading, setIsLoading] = useState(false);

  const [gameSettings, setGameSettings] = useState({
    ticketStakeMin: 100,
    ticketStakeMax: 10000,
    ticketSizeMin: 1,
    ticketSizeMax: 10,
    quickPick: [100, 300, 500, 1000],
    payoutMode: "manual",
  });

  const handleChangeForGameSettings = (e) => {
    const { name, value } = e.target;
    setGameSettings((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleGameSettingsUpdate = async (e) => {
    e.preventDefault();
    const res = await updateGameData(gameSettings, selectedUser, activeGame);
    if (res.status) {
      alert("Game settings updated successfully");
    } else {
      alert(res.data.message);
    }
  };

  const updateGameType = (type) => {
    setActiveGame(type);
    fetchGameData();
  };

  const fetchGameData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const [gameData] = await Promise.all([
        getGameSettings(selectedUser, activeGame),
      ]);
      setIsLoading(false);
      setGameSettings(gameData.data.gameConfig);
    } catch (error) {
      alert("An error occurred");
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  return (
    <>
      <TabPanel px={"0px"}>
        <div className="container">
          <Stack direction="row" align="center">
            <Button size="xs" onClick={() => updateGameType("aviata")}>
              Aviata
            </Button>
            <Button size="xs" onClick={() => updateGameType("shootout")}>
              Shoot Out
            </Button>
          </Stack>

          {isLoading ? (
            <div className="p-4 flex flex-col items-center w-full h-full justify-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <form className="mt-4" onSubmit={handleGameSettingsUpdate}>
              <div className="container">
                <div className="flex md:flex-row flex-col">
                  <div className="md:w-1/2">
                    <FormControl className="form-group mb-3">
                      <FormLabel htmlFor="ticketStakeMin">
                        Min Ticket Stake
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder=""
                        name="ticketStakeMin"
                        value={gameSettings?.ticketStakeMin}
                        onChange={handleChangeForGameSettings}
                        className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </FormControl>
                  </div>
                  <div className="md:w-1/2 md:px-2">
                    <FormControl className="form-group mb-3">
                      <FormLabel htmlFor="ticketStakeMax">
                        Max Ticket Stake
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder=""
                        name="ticketStakeMax"
                        value={gameSettings?.ticketStakeMax}
                        onChange={handleChangeForGameSettings}
                        className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </FormControl>
                  </div>
                </div>
                <div className="flex md:flex-row flex-col">
                  <div className="md:w-1/2">
                    <FormControl className="form-group mb-3">
                      <FormLabel htmlFor="ticketSizeMin">
                        Min Ticket Size
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder=""
                        name="ticketSizeMin"
                        value={gameSettings?.ticketSizeMin}
                        onChange={handleChangeForGameSettings}
                        className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </FormControl>
                  </div>
                  <div className="md:w-1/2 md:px-2">
                    <FormControl className="form-group mb-3">
                      <FormLabel htmlFor="ticketSizeMax">
                        Max Ticket Size
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder=""
                        name="ticketSizeMax"
                        value={gameSettings?.ticketSizeMax}
                        onChange={handleChangeForGameSettings}
                        className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                      />
                    </FormControl>
                  </div>
                </div>
                <div className="flex md:flex-row flex-col">
                  {gameSettings?.quickPick.length &&
                    gameSettings?.quickPick.map((q, index) => (
                      <div className="w-1/4" key={index}>
                        <FormControl className="form-group mb-3">
                          <FormLabel htmlFor={`quickPick-${index}`}>
                            Quick Stake {index + 1}
                          </FormLabel>
                          <Input
                            type="text"
                            placeholder=""
                            name={`quickPick-${index}`}
                            value={q}
                            onChange={(e) => {
                              const newQuickPick = [...gameSettings?.quickPick];
                              newQuickPick[index] = e.target.value;
                              setGameSettings((prev) => ({
                                ...prev,
                                quickPick: newQuickPick,
                              }));
                            }}
                            className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                          />
                        </FormControl>
                      </div>
                    ))}
                </div>
                <FormControl className="form-group mb-3">
                  <FormLabel htmlFor="payoutMode">Payout Mode</FormLabel>
                  <Select
                    name="payoutMode"
                    value={gameSettings.payoutMode}
                    onChange={handleChangeForGameSettings}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </Select>
                </FormControl>
              </div>
              <Button
                type="submit"
                isLoading={loading}
                className="bg-black text-white"
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </TabPanel>
    </>
  );
}

export default GameSettings;
