import { Flex, Image, Text } from "@chakra-ui/react";

const Coupon = ({ nft, json }: any) => {
    const tos = json.attributes !== undefined ? json?.attributes[0]?.value : "";
    // console.log(nft, json);
    // console.log(json?.attributes[0]?.value);
    return (
        <Flex
            flexDirection="column"
            width="400px"
            backgroundColor="gray.100"
            alignItems="center"
            borderRadius="20px"
            margin="20px"
        >
            <Text fontSize="32px">{json.name}</Text>
            <Image src={json.image} alt="image" height="300px" />
            <Text>{json.description}</Text>

            <Text fontSize="20px">Terms of Service:</Text>
            <Text>{tos}</Text>
        </Flex>
    );
};

export default Coupon;
