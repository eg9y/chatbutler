import { Node } from "reactflow";
import { DocsLoaderDataType } from "../types/NodeTypes";

const docsLoader = async (node: Node<DocsLoaderDataType>) => {
  if (!node.data.askUser) {
    node.data.response = node.data.text;
  }
  node.data = {
    ...node.data,
  };
};

export default docsLoader;
