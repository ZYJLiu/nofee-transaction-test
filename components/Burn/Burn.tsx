/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, useDisclosure, Button, FormControl } from "@chakra-ui/react"
import QrModal from "../Modal"

const Burn = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex width="100%" height="100vh">
      <FormControl display="center" alignItems="center">
        <QrModal onClose={onClose} isOpen={isOpen} />
        <Button display="center" alignItems="center" onClick={onOpen}>
          Burn
        </Button>
      </FormControl>
    </Flex>
  )
}

export default Burn
