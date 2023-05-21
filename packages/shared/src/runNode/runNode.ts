import { Node } from "reactflow";

import docsLoader from "./docsLoader";
import {
  chatPrompt,
  classify,
  // combine,
  llmPrompt,
  loop,
  outputText,
  search,
  setVariable,
  singleChatPrompt,
  inputText,
  counter,
} from "./index";
import { getNodes } from "../getNodes";
import { TraversalStateType } from "../traversalStateType";
import {
  CustomNode,
  NodeTypesEnum,
  GlobalVariableDataType,
  SearchDataType,
  DocsLoaderDataType,
} from "../types/NodeTypes";
import { parsePromptInputs } from "../utils/parsePromptInput";

export async function runNode(
  state: TraversalStateType,
  chatbotId: string | undefined,
  nodes: CustomNode[],
  nodeId: string,
  openAiKey: string,
) {
  const node = getNodes(nodes, [nodeId])[0];

  switch (node.type) {
    case NodeTypesEnum.llmPrompt:
      await llmPrompt(nodes, node, openAiKey);
      break;
    case NodeTypesEnum.inputText:
      await inputText(state, nodes, node);
      break;
    case NodeTypesEnum.globalVariable:
      // set node.data.value to initialValue
      (node.data as GlobalVariableDataType).value = [
        ...((node.data as GlobalVariableDataType).initialValue as {
          id: string;
          value: string;
        }[]),
      ];
      break;
    case NodeTypesEnum.conditional:
      node.data = {
        ...node.data,
        response: node.data.text,
      };
      break;
    case NodeTypesEnum.setVariable:
      setVariable(nodes, node);
      break;
    case NodeTypesEnum.outputText:
      outputText(state, nodes, node);
      break;
    case NodeTypesEnum.search:
      await search(
        state,
        chatbotId,
        nodes,
        node as Node<SearchDataType>,
        openAiKey
      );
      break;
    case NodeTypesEnum.docsLoader:
      await docsLoader(node as Node<DocsLoaderDataType>);
      break;
    case NodeTypesEnum.counter:
      counter(node);
      break;
    // case NodeTypesEnum.combine:
    // 	combine(node, get);
    // 	break;
    case NodeTypesEnum.chatPrompt:
      await chatPrompt(nodes, node, openAiKey);
      break;
    case NodeTypesEnum.singleChatPrompt:
      await singleChatPrompt(nodes, node, openAiKey);
      break;
    case NodeTypesEnum.classify:
      await classify(nodes, node, openAiKey);
      break;
    case NodeTypesEnum.text:
      node.data.response = parsePromptInputs(
        nodes,
        node.data.inputs.inputs,
        node.data.text
      );
      break;
    case NodeTypesEnum.loop:
      loop(nodes, node);
      break;
    default:
    // do nothing
  }

  return node;
}
