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
import { updateGameConfig, getGameSettings } from "services/settings.service";

function Configuration({ selectedUser, authUser, loading }) {
  const [activeGame, setActiveGame] = useState("aviata");
  const [isLoading, setIsLoading] = useState(false);

  const [gameData, setGameData] = useState({
    roundWaitTimeValue: 0,
    timerCountdownValue: 0,
    roundBetsLimit: 0,
    rtp: 0,
  });

  const handleChangeForGameData = (e) => {
    const { name, value } = e.target;
    setGameData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleGameDataUpdate = async (e) => {
    e.preventDefault();
    gameData.rtp = Number(gameData.rtp);
    const res = await updateGameConfig(gameData, selectedUser, activeGame);
    if (res.status) {
      alert("Game data updated successfully");
    } else {
      alert(res.data.message);
    }
  };

  const fetchGameData = async (gametype) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setActiveGame(gametype);
      const [gameData] = await Promise.all([
        getGameSettings(selectedUser, gametype),
      ]);
      setIsLoading(false);
      if (gameData.data.game) {
        setGameData(gameData.data?.game);
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  useEffect(() => {
    fetchGameData("aviata");
  }, [selectedUser]);

  return (
    <div className="container">
      <Stack direction="row" align="center">
        <Button
          size="xs"
          colorScheme={activeGame === "aviata" ? "blue" : "gray"}
          onClick={() => fetchGameData("aviata")}
        >
          Aviata
        </Button>
        <Button
          size="xs"
          colorScheme={activeGame === "shootout" ? "blue" : "gray"}
          onClick={() => fetchGameData("shootout")}
        >
          Shoot Out
        </Button>
      </Stack>

      {isLoading ? (
        <div className="p-4 flex flex-col items-center w-full h-full justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="mt-4" onSubmit={handleGameDataUpdate}>
          <div className="container">
            <div className="flex md:flex-row flex-col">
              <div className="md:w-1/3 w-full">
                <FormControl className="form-group mb-3">
                  <FormLabel htmlFor="roundWaitTimeValue">
                    Round Wait Time
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    name="roundWaitTimeValue"
                    value={gameData?.roundWaitTimeValue}
                    onChange={handleChangeForGameData}
                    className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                  />
                </FormControl>
              </div>
              <div className="md:w-1/3 w-full px-2">
                <FormControl className="form-group mb-3">
                  <FormLabel htmlFor="timerCountdownValue">
                    Timer Countdown
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    name="timerCountdownValue"
                    value={gameData?.timerCountdownValue}
                    onChange={handleChangeForGameData}
                    className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                  />
                </FormControl>
              </div>
              <div className="md:w-1/3 w-full">
                <FormControl className="form-group mb-3">
                  <FormLabel htmlFor="roundBetsLimit">
                    Round Bets Limit
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    name="roundBetsLimit"
                    value={gameData?.roundBetsLimit}
                    onChange={handleChangeForGameData}
                    className=" placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                  />
                </FormControl>
              </div>
            </div>

            <div className="w-full">
              <FormControl className="form-group mb-3">
                <FormLabel htmlFor="roundBetsLimit">RTP</FormLabel>
                <Select
                  name="rtp"
                  value={gameData.rtp}
                  onChange={handleChangeForGameData}
                >
                  <option value="90">90</option>
                  <option value="95">95</option>
                  <option value="80">80</option>
                  <option value="65">65</option>
                </Select>
              </FormControl>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-black text-white"
            isLoading={loading}
          >
            Update
          </Button>
        </form>
      )}
    </div>
  );
}

export default Configuration;
