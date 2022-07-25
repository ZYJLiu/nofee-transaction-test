import { Flex, Image, Text } from "@chakra-ui/react";
interface Attribute {
  trait_type: string;
  value: string;
}

const Coupon = ({ nft, json, setMint, onOpen }: any) => {
  const attributes = json.attributes ?? [];

  return (
    <Flex
      flexDirection="column"
      width="400px"
      height="550px"
      backgroundColor="gray.100"
      alignItems="center"
      borderRadius="20px"
      margin="20px"
      onClick={() => {
        setMint(nft.mint.toString());
        onOpen();
      }}
      textAlign="center"
      cursor="pointer"
    >
      <Text fontSize="32px" marginTop="20px">
        {json.name}
      </Text>
      <Image src={json.image} alt="image" height="300px" />
      <Text mt="5px">{json.description}</Text>

      {attributes.map((attribute: Attribute, ind: number) => (
        <Flex key={ind} flexDirection="column">
          <Text fontSize="20px" marginTop="15px">
            {attribute.trait_type}:
          </Text>
          <Text>{attribute.value}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Coupon;
