// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js"
import type { NextApiRequest, NextApiResponse } from "next"
import {
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Account,
  createTransferInstruction,
  createTransferCheckedInstruction,
} from "@solana/spl-token"
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
    label: "Test",
    icon: "https://freesvg.org/img/1370962427.png",
  })
}

const network = "https://api.devnet.solana.com/"
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

    const mintPK = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")

    // Build a transaction that burns 1 of this NFT
    const { blockhash } = await connection.getLatestBlockhash("finalized")
    const transaction = new Transaction()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer.publicKey
    console.log(payer.publicKey.toString())

    const receiverTokenAddress = await getAssociatedTokenAddress(
      mintPK,
      buyerPK
    )

    const senderTokenAddress = await getAssociatedTokenAddress(
      mintPK,
      payer.publicKey
    )

    const createAccountInstruction = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      receiverTokenAddress,
      buyerPK,
      mintPK,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    let buyer: Account
    try {
      buyer = await getAccount(
        connection,
        receiverTokenAddress,
        "confirmed",
        TOKEN_PROGRAM_ID
      )
    } catch (error: unknown) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        try {
          transaction.add(createAccountInstruction)
        } catch (error: unknown) {}
      } else {
        throw error
      }
    }

    const sendTokenInstruction = createTransferCheckedInstruction(
      senderTokenAddress, // source
      mintPK,
      receiverTokenAddress, // dest
      payer.publicKey,
      1000000,
      6,
      [payer],
      TOKEN_PROGRAM_ID
    )

    sendTokenInstruction.keys.push(
      {
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: buyerPK,
        isSigner: true,
        isWritable: false,
      }
    )

    transaction.add(sendTokenInstruction)
    transaction.partialSign(payer)

    const serializedTx = transaction.serialize({ requireAllSignatures: false })
    const base64 = serializedTx.toString("base64")

    res.status(200).json({
      transaction: base64,
      message: "Successfully used coupon",
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
