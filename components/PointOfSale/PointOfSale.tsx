/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react"
import { Flex, useDisclosure, Button } from "@chakra-ui/react"
import { Metaplex } from "@metaplex-foundation/js"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import BN from "bn.js"
import QrModal from "../Modal"
import QrModalTransfer from "../ModalTransfer"
import { QuestionIcon } from "@chakra-ui/icons"
import Settings from "../Settings"

const connection = new Connection(clusterApiUrl("devnet"))
const metaplex = new Metaplex(connection)

const PointOfSale = () => {
  const {
    isOpen: isTransferOpen,
    onOpen: onTransferOpen,
    onClose: onTransferClose,
  } = useDisclosure()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure()

  return (
    <Flex width="100%" height="100vh">
      <Flex position="absolute" right={25} top={25}>
        <QuestionIcon onClick={onTransferOpen} cursor="pointer" />
      </Flex>
      <Settings isOpen={isSettingsOpen} onClose={onSettingsClose} />
      {/* <QrModal onClose={onClose} isOpen={isOpen} />
      <Button position="absolute" left={25} top={25} onClick={onOpen}>
        Burn
      </Button> */}
      <QrModalTransfer onClose={onTransferClose} isOpen={isTransferOpen} />
      <Button position="absolute" left={25} top={100} onClick={onTransferOpen}>
        Transfer
      </Button>
    </Flex>
  )
}

export default PointOfSale
