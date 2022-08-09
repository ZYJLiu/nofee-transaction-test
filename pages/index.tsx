import { Flex, Switch, FormControl, FormLabel, Box } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import Burn from "../components/Burn"
import Transfer from "../components/Transfer"
import { useState } from "react"

const Home: NextPage = () => {
  const [toggle, setToggle] = useState(true)
  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      justifyContent="center"
    >
      <Head>
        <title>Test</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {toggle ? <Transfer /> : <Burn />}
      <FormControl display="center" alignItems="center">
        <FormLabel mt={2}>Select</FormLabel>
        <Switch
          id="Test"
          onChange={(event) => setToggle((prevCheck) => !prevCheck)}
        />
      </FormControl>
    </Box>
  )
}

export default Home
