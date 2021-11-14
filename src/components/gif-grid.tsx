/* eslint-disable @next/next/no-img-element */
import { sendGif } from '@/utils';
import classNames from 'classnames';
import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { GifItem } from 'types/GifItem';

const ErrorComponent = ({ errorText }: { errorText?: string }) => {
  if (!errorText) return null;

  return (
    <div className="alert alert-error">
      <div className="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 mx-2 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <label>{errorText}</label>
      </div>
    </div>
  );
};

const GifGrid = ({
  giftList,
  getGifList,
  onRemoveGif,
  onLikeGif,
}: {
  giftList: GifItem[];
  getGifList: () => Promise<void>;
  onRemoveGif: (index: number) => Promise<void>;
  onLikeGif: (index: number) => Promise<void>;
}) => {
  const [gifLinkValue, setGifLinkValue] = useState(``);
  const [gifDescriptionValue, setGifDescriptionValue] = useState(``);

  const [errors, setErrors] = useState({ gifLink: ``, gifDescription: `` });

  const [isSendingGIF, setIsSendingGIF] = useState(false);

  const handleSendGif = async () => {
    setErrors({
      gifDescription:
        gifDescriptionValue.length === 0 ? `Description is required` : ``,
      gifLink: gifLinkValue.length === 0 ? `Link is required` : ``,
    });

    if (gifLinkValue.length === 0 || gifDescriptionValue.length === 0) {
      return;
    }

    setIsSendingGIF(true);

    await sendGif({
      gifUrl: gifLinkValue,
      gifDescription: gifDescriptionValue,
      getGifList,
    });
    setIsSendingGIF(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="form-control max-w-lg w-full space-y-2">
        <label className="">
          <span className="label sr-only label-text">Gif Link</span>
          <input
            type="text"
            placeholder="Enter GIF link!"
            value={gifLinkValue}
            onChange={(event) => setGifLinkValue(event.target.value)}
            className="input input-bordered w-full"
            disabled={isSendingGIF}
          />
          <ErrorComponent errorText={errors.gifLink} />
        </label>
        <label className="">
          <span className="label sr-only label-text">GIF description</span>
          <input
            type="text"
            placeholder="Enter description"
            value={gifDescriptionValue}
            onChange={(event) => setGifDescriptionValue(event.target.value)}
            className="input input-bordered w-full"
            disabled={isSendingGIF}
          />
          <ErrorComponent errorText={errors.gifDescription} />
        </label>

        <button
          onClick={() => handleSendGif()}
          className={classNames(`btn btn-primary`, { loading: isSendingGIF })}
          disabled={isSendingGIF}
        >
          Send GIF
        </button>
      </div>
      <div className="py-2 md:py-8 grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4">
        {giftList.map((gif, index) => {
          return (
            <div key={gif.gifLink + index} className="w-full">
              <img src={gif.gifLink} alt="gif" />
              <div className="border border-b-0 text-center">
                <p>{gif?.gifDescription}</p>
              </div>
              <div className="border border-b-0 flex flex-col text-center">
                <p>User Address</p>
                <p>{gif.userAddress?.toString()}</p>
              </div>
              <button
                className="flex items-center w-full border justify-center"
                onClick={() => onLikeGif(index)}
              >
                <span className="px-2">{gif?.gifLikes}</span>
                <FaThumbsUp />
              </button>
              <button
                className="flex items-center w-full border justify-center"
                onClick={() => onRemoveGif(index)}
              >
                delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GifGrid;
