import { Flex, Image, Text } from "@chakra-ui/react";

const Coupon = ({ nft, json, setMint, onOpen }: any) => {
  const tos = json.attributes !== undefined ? json?.attributes[0]?.value : "";
  // console.log(nft, json);
  // console.log(json?.attributes[0]?.value);
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
      <Text>{json.description}</Text>

      <Text fontSize="20px" marginTop="15px">
        Restrictions:
      </Text>
      <Text>Limit 1 per customer etc.</Text>
      <Text fontSize="20px" marginTop="15px">
        Terms of Service:
      </Text>
      <Text>Example terms of service goes here.</Text>
    </Flex>
  );
};

export default Coupon;
