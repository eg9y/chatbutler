import { CustomNode, LoopDataType } from "../types/NodeTypes";
import { parsePromptInputs } from "../utils/parsePromptInput";

function loop(nodes: CustomNode[], node: CustomNode) {
  const loopData = node.data as LoopDataType;
  loopData.loopCount += 1;
  const parsedText = parsePromptInputs(
    nodes,
    loopData.inputs.inputs,
    loopData.text
  );
  node.data = {
    ...node.data,
    response: parsedText,
    loopCount: loopData.loopCount,
  };
}

export default loop;
