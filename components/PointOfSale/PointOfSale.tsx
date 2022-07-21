/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import Coupon from "../Coupon";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
import { useWorkspace } from "../../contexts/workspace";
import BN from "bn.js";
import {
  createQR,
  encodeURL,
  TransferRequestURLFields,
  findReference,
  validateTransfer,
  FindReferenceError,
  ValidateTransferError,
  TransactionRequestURLFields,
} from "@solana/pay";
import QrModal from "../Modal";

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

const mint = new PublicKey("6tt9mDtF1gxfPU1qxqYSD6kVEpB3DVw3kkNXz1j5e3g4");

const PointOfSale = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [NFTs, setNFTs] = useState<any[]>([]);
  const [mint, setMint] = useState("");
  const workspace = useWorkspace();

  // Specify the merchants key
  const merchantKey = new PublicKey("EK8cufTtDZEBUEKQPNELo8P9uM8Fi3FbmUjbt7kjjNPm");
  // const merchantKey = new PublicKey("EzEV6RerD5yTVSD8qAV4X3igfQwVYRYSYDFT3BPBwHDm"); This one was for the old idl
  // const merchantKey = new PublicKey("DuvMcXUBThbWRPmVhnpTsUU9jgh2rBk1EySdM2rsBP5U");
  // const merchantKey = new PublicKey("2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs");

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

      const programId = workspace.program?.programId;
      const program = workspace.program;

      if (!merchants || merchants.length == 0 || !programId || !program) return;

      // Grab the merchant data
      const merchant = merchants[0].publicKey;
      const promoCount = merchants[0].account.promoCount.toNumber();

      const promoAccounts = [];

      // Loop over all of the promos:
      for (let i = 0; i < promoCount; i++) {
        // Find the PDA associated with that promoCount:
        const key = new BN(i);
        const bytes = key.toArrayLike(Buffer, "be", 8);
        const [promoAddress, promoBump] = await PublicKey.findProgramAddress([merchant.toBuffer(), bytes], programId);

        // fetch the account data at that address
        const promoAccount = await program.account.promo.fetch(promoAddress);

        // add the promo to our list of promoAccounts
        promoAccounts.push(promoAccount);
      }

      const promoMints = promoAccounts.map((promoAccount) => promoAccount?.mint);

      // Fetch all of the NFT accounts

      const nftAccounts = await Promise.all(
        promoMints.map(async (promoMint: PublicKey) => await metaplex.nfts().findByMint(promoMint))
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
  }, [merchantKey.toString()]);

  return (
    <Flex width="100%" height="100vh">
      <QrModal onClose={onClose} isOpen={isOpen} mint={mint} />

      <Flex flexWrap="wrap">
        {NFTs.map((nft, ind) => (
          <Coupon key={ind} {...nft} setMint={setMint} onOpen={onOpen} />
        ))}
      </Flex>
    </Flex>
  );
};

export default PointOfSale;
