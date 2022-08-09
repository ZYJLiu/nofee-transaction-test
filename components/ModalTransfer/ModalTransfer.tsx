/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Flex } from "@chakra-ui/react"
import {
  createQR,
  encodeURL,
  findReference,
  FindReferenceError,
  TransactionRequestURLFields,
  validateTransfer,
  ValidateTransferError,
} from "@solana/pay"
import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js"
import { useEffect, useRef, useState } from "react"
import Confirmed from "../Confirmed"

const QrModalTransfer = ({ onClose, isOpen }: any) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const [reference, setReference] = useState(Keypair.generate().publicKey)
  const [confirmed, setConfirmed] = useState(false)
  console.log()

  useEffect(() => {
    // window.location is only available in the browser, so create the URL in here
    const { location } = window
    const params = new URLSearchParams()
    params.append("reference", reference.toString())
    const apiUrl = `${location.protocol}//${
      location.host
    }/api/solpaytransfer?${params.toString()}`

    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
      label: "Test",
      message: "Thanks for your order!",
    }

    const solanaUrl = encodeURL(urlParams)

    const qr = createQR(solanaUrl, 512, "transparent")
    if (qrRef.current) {
      qrRef.current.innerHTML = ""
      qr.append(qrRef.current)
    }
  }, [reference])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const connection = new Connection(clusterApiUrl("mainnet-beta"))

        if (!connection) return

        const signatureInfo = await findReference(connection, reference, {
          finality: "confirmed",
        })

        /* TODO: Confirm valid transaction here. Probably just fetch balance beforehand and afterhand of the NFT */

        setConfirmed(true)
        setReference(Keypair.generate().publicKey)
        console.log("Succeeded!")
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return
        }
        if (e instanceof ValidateTransferError) {
          // Transaction is invalid
          console.error("Transaction is invalid", e)
          return
        }
        console.error("Unknown error", e)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [reference.toString()])

  return (
    <>
      <Flex
        position="fixed"
        top="0px"
        left="0px"
        right="0px"
        bottom="0px"
        zIndex={1000}
        backgroundColor="rgba(0, 0, 0, 0.3)"
        display={isOpen ? "flex" : "none"}
      />
      <Flex
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="#FFF"
        padding="20px"
        zIndex={1000}
        display={isOpen ? "flex" : "none"}
        flexDirection="column"
      >
        {confirmed && <Confirmed />}
        <Flex display={confirmed ? "none" : "flex"} ref={qrRef} />
        <Button
          onClick={() => {
            setConfirmed(false)
            onClose()
          }}
        >
          Close
        </Button>
      </Flex>
    </>
  )
}

export default QrModalTransfer
