import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import Product from "../Product";
import Coupon from "../Coupon";
import { Metaplex, findMetadataPda } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWorkspace } from "../../contexts/workspace";

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

const mint = new PublicKey("6tt9mDtF1gxfPU1qxqYSD6kVEpB3DVw3kkNXz1j5e3g4");

// metaplex
//     .nfts()
//     .findByMint(mint)
//     .then((data) => console.log(data));

// fetch("https://raw.githubusercontent.com/juniv/Point-Of-Sale/main/data/burger.json")
//     .then((res) => res.json())
//     .then((data) => console.log(data));

// fetch("https://jsonkeeper.com/b/VQVR")
//     .then((res) => res.json())
//     .then((data) => console.log(data));

const PointOfSale = () => {
    const [NFTs, setNFTs] = useState<any[]>([]);

    const workspace = useWorkspace();
    // console.log(
    //     workspace.program?.account.promo
    //         .all()
    //         .then((arr) => arr.map((tuple) => tuple.account.mint))
    //         .then((arr) =>
    //             arr.map((tuple: PublicKey) =>
    //                 metaplex
    //                     .nfts()
    //                     .findByMint(tuple)
    //                     .then((data) => console.log(data))
    //             )
    //         )
    // );

    // workspace.program?.account.promo
    //     .all()
    //     .then((arr) => arr.map((tuple) => console.log(tuple.account.mint.toString())));

    // metaplex
    //     .nfts()
    //     .findByMint(new PublicKey("BKoCgnwhfFk4uE8afgFXBVZmEbn4U5hsJKAkpGAzuDE2"))
    //     .then((data) => console.log(data));

    useEffect(() => {
        const fetchData = async () => {
            const promoAccounts = await workspace.program?.account.promo.all(); // TODO: change this to the merchants specific mint.
            const promoMints = promoAccounts?.map((promoAccount) => promoAccount.account.mint);
            console.log(promoMints);
            const nftAccounts = await Promise.all(
                promoMints?.map(async (promoMint: PublicKey) => await metaplex.nfts().findByMint(promoMint))
            );
            const validNFTs = nftAccounts.filter(
                (nftData) => nftData.name !== "name" && !nftData.uri.startsWith("https://jsonkeeper.com/b/VQVR")
            );

            const responses = await Promise.all(validNFTs.map(async (nft) => await fetch(`${nft.uri}`)));

            const jsons = await Promise.all(responses.map(async (response) => await response.json()));

            const nftData = validNFTs.map((nft, ind) => ({ nft: nft, json: jsons[ind] }));
            setNFTs(nftData);
            console.log(nftData);
        };

        fetchData();
    }, []);

    return (
        <Flex width="100%" flexWrap="wrap">
            {/* {NFTs.map((nft, ind) => (
                <Flex key={ind} flexDirection="column">
                    <Text>{nft.name}</Text>
                </Flex>
            ))} */}
            {NFTs.map((nft, ind) => (
                <Coupon key={ind} {...nft} />
            ))}
        </Flex>
    );
};

export default PointOfSale;
