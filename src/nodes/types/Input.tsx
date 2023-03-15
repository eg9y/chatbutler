import { InputNode } from "./NodeTypes";

export class Inputs {
  inputs: Set<string> = new Set([]);
  inputNodes: InputNode[] = [];
  inputExamples: { [key: string]: string }[] = [{}];

  addInput(input: string, nodes: InputNode[]) {
    this.inputs.add(input);
    const inputNode = nodes.find((node) => node.id === input);
    if (inputNode) {
      this.inputNodes.push(inputNode);
      this.inputExamples = this.inputExamples.map((example, index) => {
        return {
          ...example,
          [`${inputNode.data.name}`]: "",
        };
      });
    }

    return this;
  }

  updateInput(input: string, nodes: InputNode[]) {
    const inputNode = nodes.find((node) => node.id === input);
    if (inputNode) {
      this.inputNodes = this.inputNodes.map((node) => {
        if (node.id === input) {
          return inputNode;
        }
        return node;
      });
    }

    return this;
  }

  deleteInputs(edgesToDelete: string[]) {
    edgesToDelete.forEach((edge) => {
      this.inputs.delete(edge);
      this.inputNodes = this.inputNodes.filter((node) => node.id !== edge);
      this.inputExamples = this.inputExamples.map((example) => {
        const { [edge]: _, ...rest } = example;
        return rest;
      });
    });

    return this;
  }

  handleInputExampleChange(name: string, value: string, index: number) {
    this.inputExamples[index] = {
      ...this.inputExamples[index],
      [name]: value,
    };

    console.log(this.inputExamples);
  }
}
