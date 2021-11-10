/* eslint-disable @next/next/no-img-element */
import { sendGif } from '@/utils';
import React, { useState } from 'react';

const GifGrid = ({
  giftList,
  getGifList,
}: {
  giftList: { gifLink: string }[];
  getGifList: () => Promise<void>;
}) => {
  const [inputValue, setInputValue] = useState(``);

  const onInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleSendGif = async () => {
    console.log({ inputValue });

    if (inputValue.length === 0) {
      return;
    }

    await sendGif({ gifUrl: inputValue, getGifList });
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="form-control max-w-lg space-y-2">
        <label className="label sr-only">
          <span className="label-text">Gif Link</span>
        </label>
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
          className="input input-bordered"
        />
        <button onClick={() => handleSendGif()} className="btn btn-primary">
          Send Gif
        </button>
      </div>
      <div className="p-8 grid grid-cols-4 gap-4">
        {giftList.map((gif, index) => {
          return (
            <div key={gif.gifLink + index} className="">
              <img src={gif.gifLink} alt="gif" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GifGrid;
