import { Idl, Program, Provider, web3 } from '@project-serum/anchor';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Commitment,
} from '@solana/web3.js';

import idl from 'src/idl/solana_program.json';

const { SystemProgram, Keypair } = web3;

export const baseAccount = () => {
  const localStorageBaseAccount = localStorage.getItem(`baseAccount`);

  console.log({ localStorageBaseAccount });

  if (localStorageBaseAccount) {
    const parsed = JSON.parse(localStorageBaseAccount);
    const arr = Object.values(parsed._keypair.secretKey) as any[];
    const secret = new Uint8Array(arr);

    console.log({ parsed });
    return Keypair.fromSecretKey(secret);
  } else {
    const generatedBaseAccount = Keypair.generate();

    localStorage.setItem(`baseAccount`, JSON.stringify(generatedBaseAccount));
    return generatedBaseAccount;
  }
};

export const programId = new PublicKey(idl.metadata.address);

const network = clusterApiUrl(`devnet`);

const opts = {
  preflightCommitment: `processed` as Commitment,
};

export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(connection, window.solana, opts);

  return provider;
};

export const getAccount = async () => {
  const provider = getProvider();

  const program = new Program(idl as Idl, programId, provider);

  const account = await program.account.baseAccount.fetch(
    baseAccount().publicKey,
  );

  return account;
};

export const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl as Idl, programId, provider);

    console.log(`ping`);

    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount().publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount()],
    });

    console.log(`Created a new base account`);
  } catch (error) {
    console.log({ error });
  }
};

export const sendGif = async ({
  gifUrl,
  getGifList,
}: {
  gifUrl: string;
  getGifList: () => Promise<void>;
}) => {
  try {
    const provider = getProvider();
    const program = new Program(idl as Idl, programId, provider);

    console.log(`Gif link`, gifUrl);

    await program.rpc.addGif(gifUrl, {
      accounts: {
        baseAccount: baseAccount().publicKey,
        user: provider.wallet.publicKey,
      },
    });

    console.log(`GIF successfully sent to program`, gifUrl);

    await getGifList();
  } catch (error) {
    console.log({ error });
  }
};
