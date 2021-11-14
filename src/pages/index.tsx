import GifGrid from '@/components/gif-grid';
import { createGifAccount, getAccount, removeGif, sendLike } from '@/utils';
import { FaTwitterSquare } from 'react-icons/fa';
import { GiBrickWall } from 'react-icons/gi';

import classNames from 'classnames';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GifItem } from 'types/GifItem';

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

      if (solana?.isPhantom && typeof solana.connect === `function`) {
        console.log(`solana is phantom`, { solana });

        try {
          console.log(`try`);
          const response = await solana?.connect({ onlyIfTrusted: true });
          console.log({ response });
          setWalletAddress(response?.publicKey?.toString());
        } catch (error) {
          console.log({ error });
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

  const [gifList, setGifList] = useState<GifItem[] | null>(null);

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

  const handleRemoveGif = async (index: number) => {
    await removeGif(index);
    getGiftList();
  };

  const handleSendLikGif = async (index: number) => {
    console.log({ index });
    await sendLike(index);
    getGiftList();
  };

  return (
    <>
      <Head>
        <title>Solana GIF Wall</title>
        <meta
          name="description"
          content="Solana GIF wall for Buildspace Project"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col p-4">
        <main className="flex-1 flex flex-col space-y-4 justify-center items-center">
          <h1 className="text-lg font-bold flex items-center">
            <GiBrickWall size={30} />
            <span className="px-2">Solana GIF Wall</span>
            <GiBrickWall size={30} />
          </h1>
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

          {walletAddress ? (
            <div className="space-x-2  px-2 flex items-center">
              <p className="flex-1">Connected to</p>
              <p
                style={{ width: `10ch` }}
                className="bg-gray-400 border p-1 truncate ... "
              >
                {walletAddress}
              </p>
            </div>
          ) : null}

          {gifList === null ? (
            <button
              className="btn btn-primary"
              onClick={() => handleCreateGifAccount()}
            >
              Initiate GIF program account
            </button>
          ) : (
            <GifGrid
              giftList={gifList}
              getGifList={getGiftList}
              onRemoveGif={handleRemoveGif}
              onLikeGif={handleSendLikGif}
            />
          )}
        </main>

        <footer className="flex justify-center ">
          <a
            href="https://twitter.com/indluk"
            className="flex items-center space-x-2"
          >
            <p className="flex items-center ">Made by Indra</p>
            <FaTwitterSquare />
          </a>
        </footer>
      </div>
    </>
  );
}
