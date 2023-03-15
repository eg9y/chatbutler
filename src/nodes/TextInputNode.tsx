import { memo, FC } from "react";
import { Handle, Position, NodeProps, Connection, Edge } from "reactflow";
import { TextInputNodeDataType } from "./types/NodeTypes";

const TextInput: FC<NodeProps<TextInputNodeDataType>> = ({
  data,
  selected,
}) => {
  return (
    <div
      className={`m-3 bg-slate-200 w-40 shadow-lg ${
        selected && "border-2 border-slate-400"
      }`}
    >
      <div className="bg-green-200 mb-4">
        <div className="py-1">
          <h1 className="text-center">
            <span className="font-semibold">Text:</span>{" "}
            {data.name ? `${data.name}` : "Text Input"}
          </h1>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div>
          {/* tailwind add ellipsis if text is too long */}

          <p className="truncate">{data.response}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="text-output"
        className="w-4 h-4"
      />
    </div>
  );
};

export default memo(TextInput);
