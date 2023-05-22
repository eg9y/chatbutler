import { CustomNode } from "../types/NodeTypes";

function counter(node: CustomNode) {
  node.data.response = (parseInt(node.data.response) + 1).toString();
  node.data = { ...node.data };
}

export default counter;
