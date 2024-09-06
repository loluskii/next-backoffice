import React from "react";
import {
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";

function GameSettings({
  gameSettings,
  setGameSettings,
  handleChangeForGameSettings,
  handleGameSettingsUpdate,
  loading,
}) {
  return (
    <TabPanel px={"0px"}>
      <div className="container">
        <form onSubmit={handleGameSettingsUpdate}>
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
                  <FormLabel htmlFor="ticketSizeMin">Min Ticket Size</FormLabel>
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
                  <FormLabel htmlFor="ticketSizeMax">Max Ticket Size</FormLabel>
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
      </div>
    </TabPanel>
  );
}

export default GameSettings;
