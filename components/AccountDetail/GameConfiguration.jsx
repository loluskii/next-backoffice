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

function Configuration({
  gameData,
  handleChangeForGameData,
  handleGameDataUpdate,
  authUser,
  loading,
}) {
  return (
    <>
      <TabPanel px={"0px"}>
        <div className="container">
          <h6 className="text-xl font-normal leading-normal mt-0 mb-3 text-blueGray-800">
            Game Configurations
          </h6>
          <form onSubmit={handleGameDataUpdate}>
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
              {authUser?.role === "super" && (
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
              )}
            </div>
            <Button
              type="submit"
              className="bg-black text-white"
              isLoading={loading}
            >
              Update
            </Button>
          </form>
        </div>
      </TabPanel>
    </>
  );
}

export default Configuration;
