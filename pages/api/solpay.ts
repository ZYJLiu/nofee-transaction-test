// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js"
import type { NextApiRequest, NextApiResponse } from "next"
import * as spl from "@solana/spl-token"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import base58 from "bs58"

type MakeTransactionInputData = {
  account: string
}

type MakeTransactionGetResponse = {
  label: string
  icon: string
}

type MakeTransactionOutputData = {
  transaction: string
  message: string
}

type ErrorOutput = {
  error: string
}

function get(res: NextApiResponse<MakeTransactionGetResponse>) {
  res.status(200).json({
    label: "Get Promo",
    icon: "https://www.arweave.net/zdzBTTQW0V9jTyQWH_pE6D0xIKjnuxl9j9jtEs7Rk4g?ext=png",
  })
}

const network = "https://api.mainnet-beta.solana.com/"
const connection = new Connection(network)

async function post(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>
) {
  try {
    const { reference } = req.query

    if (!reference) {
      res.status(400).json({ error: "No reference provided" })
      return
    }

    const { account } = req.body as MakeTransactionInputData

    if (!account) {
      res.status(400).json({ error: "No account provided" })
      return
    }
    const payerPrivateKey = process.env.PAYER as string
    // if (!payerPrivateKey) {
    //   console.log("Returning 500: shop private key not available")
    //   res.status(500).json({ error: "Shop private key not available" })
    // }
    const payer = Keypair.fromSecretKey(base58.decode(payerPrivateKey))

    const buyerPK = new PublicKey(account)

    const mintPK = new PublicKey("6ua4nf27E9WkxNziaWWA2Do95BmtHzaWiXEoGnRevuQN")

    // Build a transaction that burns 1 of this NFT
    const { blockhash } = await connection.getLatestBlockhash("finalized")
    const transaction = new Transaction()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer.publicKey
    console.log(payer.publicKey.toString())

    const tokenAccountPK = await getAssociatedTokenAddress(mintPK, buyerPK)

    const burnIx = spl.createBurnCheckedInstruction(
      tokenAccountPK,
      mintPK,
      buyerPK,
      1,
      0
    )
    burnIx.keys.push({
      pubkey: new PublicKey(reference),
      isSigner: false,
      isWritable: false,
    })

    transaction.add(burnIx)
    transaction.partialSign(payer)

    console.log(
      "MintPK:",
      mintPK.toString(),
      "AccountPK:",
      account,
      "TokenAccountPK:",
      tokenAccountPK.toString()
    )

    const serializedTx = transaction.serialize({ requireAllSignatures: false })
    const base64 = serializedTx.toString("base64")

    res.status(200).json({
      transaction: base64,
      message: "Successfully used promo",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error creating the transaction" })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    MakeTransactionGetResponse | MakeTransactionOutputData | ErrorOutput
  >
) {
  if (req.method === "GET") {
    return get(res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
