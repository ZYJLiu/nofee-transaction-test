// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";
import * as spl from "@solana/spl-token";

type Data = {
  name: string;
};

type MakeTransactionInputData = {
  account: string;
};

type MakeTransactionGetResponse = {
  label: string;
  icon: string;
};

type MakeTransactionOutputData = {
  transaction: string;
  message: string;
};

type ErrorOutput = {
  error: string;
};

function get(res: NextApiResponse<MakeTransactionGetResponse>) {
  res.status(200).json({
    label: "Juniverse",
    icon: "https://freesvg.org/img/1370962427.png",
  });
}

const network = "https://api.devnet.solana.com/";
const connection = new Connection(network);

async function post(req: NextApiRequest, res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>) {
  try {
    const { reference } = req.query;

    if (!reference) {
      res.status(400).json({ error: "No reference provided" });
      return;
    }

    const { account } = req.body as MakeTransactionInputData;

    if (!account) {
      res.status(400).json({ error: "No account provided" });
      return;
    }

    const buyerPK = new PublicKey(account);

    /* Using dummy tx for now
    const mint = {req.query}

    // Build a transaction that burns 1 of this NFT
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPK;

    const burnIx = spl.createBurnCheckedInstruction(buyerPK, mint, buyerPK, 1, 0);
    burnIx.keys.push({
      pubkey: new PublicKey(reference),
      isSigner: false,
      isWritable: false,
    });

    transaction.add(burnIx);
    */

    const { blockhash } = await connection.getLatestBlockhash("finalized");
    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPK;
    const transferIx = SystemProgram.transfer({
      fromPubkey: buyerPK,
      lamports: 5_000_000,
      toPubkey: Keypair.generate().publicKey,
    });
    transferIx.keys.push({
      pubkey: new PublicKey(reference),
      isSigner: false,
      isWritable: false,
    });

    transaction.add(transferIx);

    const serializedTx = transaction.serialize({ requireAllSignatures: false });
    const base64 = serializedTx.toString("base64");

    res.status(200).json({
      transaction: base64,
      message: "Successfully used coupon",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating the transaction" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionGetResponse | MakeTransactionOutputData | ErrorOutput>
) {
  if (req.method === "GET") {
    return get(res);
  } else if (req.method === "POST") {
    return await post(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
