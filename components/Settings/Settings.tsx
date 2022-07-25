import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

const Settings = ({ isOpen, onClose, merchantAddr, setMerchantAddr }: any) => {
  const [addr, setAddr] = useState(merchantAddr);

  const close = () => {
    setAddr(merchantAddr);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex">
          <Text>Merchant Public Key: </Text>
          <Input value={addr} onChange={(e) => setAddr(e.target.value)} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={close}>
            Close
          </Button>
          <Button variant="ghost" onClick={() => setMerchantAddr(addr)}>
            Update Merchant Public Key
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Settings;
