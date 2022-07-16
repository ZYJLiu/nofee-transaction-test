import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
} from "@chakra-ui/react";
import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay";
import { Keypair } from "@solana/web3.js";
import { useEffect, useMemo, useRef } from "react";

const QrModal = ({ onClose, isOpen, mint }: any) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  useEffect(() => {
    // window.location is only available in the browser, so create the URL in here
    const { location } = window;
    // const params = new URLSearchParams();
    // params.append("mint", mint);
    // params.append("reference", reference.toString());
    const apiUrl = `${location.protocol}//${location.host}/api/solpay`;
    console.log(apiUrl);

    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
      label: "Juniverse",
      message: "Thanks for your order!",
    };

    const solanaUrl = encodeURL(urlParams);
    console.log(solanaUrl);
    const qr = createQR(solanaUrl, 512, "transparent");
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [mint]);

  // return (
  //   <>
  //     <div ref={qrRef} />
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalOverlay />
  //       <ModalContent maxWidth="570px">
  //         <ModalHeader>Modal Title</ModalHeader>
  //         <ModalCloseButton />
  //         <ModalBody>
  //           {/* <Flex ref={qrRef} /> */}
  //           {/* <div ref={qrRef} /> */}
  //         </ModalBody>

  //         <ModalFooter>
  //           <Button colorScheme="blue" mr={3} onClick={onClose}>
  //             Close
  //           </Button>
  //         </ModalFooter>
  //       </ModalContent>
  //     </Modal>
  //   </>
  // );

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
        <div ref={qrRef} />
        <Button onClick={onClose}>Close</Button>
      </Flex>
    </>
  );
};

export default QrModal;
