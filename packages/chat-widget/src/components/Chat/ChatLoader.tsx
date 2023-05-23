import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { FC } from "react";


export const ChatLoader: FC = () => {
  return (
    <div className="flex flex-col flex-start">
      <div
        className={`flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-4 py-2 w-fit`}
        style={{ overflowWrap: "anywhere" }}
      >
        <EllipsisHorizontalIcon className="animate-pulse animate- w-10 h-10" />
      </div>
    </div>
  );
};
