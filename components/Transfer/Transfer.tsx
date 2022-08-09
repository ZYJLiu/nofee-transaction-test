/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, useDisclosure, Button, FormControl } from "@chakra-ui/react"
import QrModalTransfer from "../ModalTransfer"

const Transfer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex width="100%" height="100vh">
      <FormControl display="center" alignItems="center">
        <QrModalTransfer onClose={onClose} isOpen={isOpen} />
        <Button onClick={onOpen}>Get Promo</Button>
      </FormControl>
    </Flex>
  )
}

export default Transfer
