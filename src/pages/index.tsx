import GifGrid from '@/components/gif-grid';
import { createGifAccount, getAccount } from '@/utils';

import classNames from 'classnames';
import Head from 'next/head';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    solana: any;
  }
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // check solana wallet connected
  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log(`solana is phantom`);

          const response = await solana.connect({ onlyIfTrusted: true });

          setWalletAddress(response?.publicKey?.toString());
        }
      } else {
        alert(`solana is not connected`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      setIsConnectingWallet(true);
      const { solana } = window;

      if (solana) {
        const response = await solana.connect();
        console.log(`Connected with public key`, response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.log(`error`, error);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  useEffect(() => {
    window.addEventListener(`load`, async () => {
      await checkIfWalletConnected();
    });
  }, []);

  const [gifList, setGifList] = useState<{ gifLink: string }[] | null>(null);

  const getGiftList = async () => {
    try {
      console.log(`fetching gif list`);

      const account = await getAccount();

      console.log(`got account`, account);

      setGifList(account.gifList);
    } catch (error) {
      console.log({ error });
      setGifList(null);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      getGiftList();
    }
  }, [walletAddress]);

  const handleCreateGifAccount = async () => {
    await createGifAccount();
    getGiftList();
  };

  return (
    <>
      <Head>
        <title>TypeScript starter for Next.js</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col space-y-4 justify-center items-center">
          <h1>Gif Explorer</h1>
          {!walletAddress ? (
            <button
              className={classNames(`btn btn-primary`, {
                loading: isConnectingWallet,
              })}
              onClick={() => handleConnectWallet()}
            >
              {isConnectingWallet ? `Connecting...` : `Connect Wallet`}
            </button>
          ) : null}

          {walletAddress ? <p>Connected to {walletAddress}</p> : null}

          {gifList === null ? (
            <button
              className="btn btn-primary"
              onClick={() => handleCreateGifAccount()}
            >
              Initiate GIF program account
            </button>
          ) : (
            <GifGrid giftList={gifList} getGifList={getGiftList} />
          )}
        </main>

        <footer className="flex justify-center p-10">
          <p className="">Made by Indra</p>
        </footer>
      </div>
    </>
  );
}
