import { Button, Flex, Text } from "@chakra-ui/react";

interface ProductType {
    sku: number;
    name: string;
    price: number; // $1.33 => 133
    productCnts: any;
    setProductCnts: any;
    productInd: number;
}

const Product = ({ sku, name, price, productCnts, setProductCnts, productInd }: ProductType) => {
    const addToCart = () => {
        const productCntsCopy = [...productCnts];
        productCntsCopy[productInd]++;
        setProductCnts(productCntsCopy);
    };

    return (
        <Flex
            width="400px"
            backgroundColor="gray.200"
            borderRadius="12px"
            padding="10px"
            margin="10px"
            alignItems="center"
            justifyContent="space-between"
        >
            <Flex flexDirection="column">
                <Text>
                    {name}: ${price / 100}
                </Text>
                <Text>SKU: {sku}</Text>
            </Flex>
            <Button onClick={addToCart}>Add to cart</Button>
        </Flex>
    );
};

export type { ProductType };
export default Product;
