import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import Product from "../Product";
import Coupon from "../Coupon";
import { Metaplex, findMetadataPda } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWorkspace } from "../../contexts/workspace";
import BN from "bn.js";

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

    // Specify the merchants key
    const merchantKey = new PublicKey("EzEV6RerD5yTVSD8qAV4X3igfQwVYRYSYDFT3BPBwHDm");

    useEffect(() => {
        const fetchData = async () => {
            // filter for the merchant's key
            const merchants = await workspace.program?.account.merchant.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: merchantKey.toBase58(),
                    },
                },
            ]);

            if (!merchants || merchants.length == 0) return;

            // Grab the merchant data
            const merchant = merchants[0].publicKey;
            const promoCount = merchants[0].account.promoCount.toNumber();

            const promoAccounts = [];

            // Loop over all of the promos:
            for (let i = 0; i < promoCount; i++) {
                // Find the PDA associated with that promoCount:
                const key = new BN(i);
                const bytes = key.toArrayLike(Buffer, "be", 8);
                const [promoAddress, promoBump] = await PublicKey.findProgramAddress(
                    [merchant.toBuffer(), bytes],
                    workspace.program?.programId
                );

                // fetch the account data at that address
                const promoAccount = await workspace.program?.account.promo.fetch(promoAddress);

                // add the promo to our list of promoAccounts
                promoAccounts.push(promoAccount);
            }

            const promoMints = promoAccounts?.map((promoAccount) => promoAccount?.mint);

            // Fetch all of the NFT accounts
            const nftAccounts = await Promise.all(
                promoMints?.map(async (promoMint: PublicKey) => await metaplex.nfts().findByMint(promoMint))
            );

            // Filtering stupid NFTs I made, this can be deleted later...
            const validNFTs = nftAccounts.filter(
                (nftData) => nftData.name !== "name" && !nftData.uri.startsWith("https://jsonkeeper.com/b/VQVR")
            );

            // Retrieve the data stored in the NFT uri
            const responses = await Promise.all(validNFTs.map(async (nft) => await fetch(`${nft.uri}`)));

            // parse the data
            const jsons = await Promise.all(responses.map(async (response) => await response.json()));

            // join data into an object and then store it in the state
            const nftData = validNFTs.map((nft, ind) => ({ nft: nft, json: jsons[ind] }));
            setNFTs(nftData);
        };

        fetchData();
    }, [merchantKey]);

    return (
        <Flex width="100%" flexWrap="wrap">
            {NFTs.map((nft, ind) => (
                <Coupon key={ind} {...nft} />
            ))}
        </Flex>
    );
};

export default PointOfSale;