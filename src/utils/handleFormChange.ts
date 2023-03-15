import {
  LLMPromptNodeDataType,
  NodeTypesEnum,
  TextInputNodeDataType,
} from "../nodes/types/NodeTypes";

export function handleChange(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  nodeId: string,
  data: LLMPromptNodeDataType | TextInputNodeDataType,
  updateNode: (id: string, data: any) => void,
  type: NodeTypesEnum = NodeTypesEnum.llmPrompt
) {
  let name = e.target.name;
  // if there's a -slider at the end of name, remove it
  if (name.endsWith("-slider")) {
    name = name.slice(0, -7);
    const input = document.querySelector(
      `input[name=${name}]`
    ) as HTMLInputElement;
    input.value = e.target.value;
  }

  if (e.target.type === "number") {
    const range = document.querySelector(
      `input[name=${name}-slider]`
    ) as HTMLInputElement;
    range.value = e.target.value;
  }

  // get range value
  updateNode(nodeId, {
    ...data,
    [name]: e.target.value,
  });
}
