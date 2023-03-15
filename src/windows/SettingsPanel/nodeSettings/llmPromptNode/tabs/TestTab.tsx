import { Node } from "reactflow";
import useStore, { selector } from "../../../../../store/useStore";
import { shallow } from "zustand/shallow";
import { PlayIcon } from "@heroicons/react/20/solid";
import { getOpenAIResponse } from "../../../../../openai/openai";
import { LLMPromptNodeDataType } from "../../../../../nodes/types/NodeTypes";

export default function TestTab({
  selectedNode,
  updateNode,
}: {
  selectedNode: Node<LLMPromptNodeDataType>;
  updateNode: (id: string, data: any) => void;
}) {
  const { openAIKey, updateInputExample } = useStore(selector, shallow);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      {selectedNode && (
        <div className="text-sm font-medium leading-6 text-gray-900">
          {/* form div scrollable using tailwind */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="">
              <p className="">Current inputs</p>
            </div>
            <div className="flex flex-col gap-2">
              {selectedNode.data.inputs.inputNodes.map((inputNode) => (
                <div key={inputNode.id} className="text-xs text-justify">
                  <p>{inputNode.data.name}</p>
                  <div
                    className="block w-full rounded-md border-0 bg-emerald-200 text-emerald-800 px-2 
                  shadow-sm ring-1 ring-inset ring-emerald-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:py-1.5"
                  >
                    <p className="trunscate">
                      {inputNode.data?.prompt}

                      {/* highlight below with span */}
                      <span className="bg-emerald-300">
                        {inputNode.data.response}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </form>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-2 my-2 rounded flex items-center"
            onClick={async () => {
              // const response = await getOpenAIResponse(
              //   selectedNode.data,
              //   selectedNode.data.inputs.inputNodes
              // );
              // console.log(JSON.stringify(response, null, 2));
              // const completion = response.data.choices[0].text;
              // if (completion) {
              //   selectedNode.data.response = completion;
              // }
              selectedNode.data.response = "test output";
              console.log(selectedNode.data.response);
              updateNode(selectedNode.id, selectedNode.data);
              console.log(selectedNode);
            }}
          >
            <PlayIcon
              className={"text-blue-300 -ml-1 mr-1 h-5 w-5 flex-shrink-0"}
              aria-hidden="true"
            />
            <span>Run</span>
          </button>
          <div className="pt-2 ">
            <p className="">Test inputs</p>
            {selectedNode.data.inputs.inputExamples.map(
              (inputExample, index) => {
                return (
                  <div
                    key={`${inputExample.name}-${index}`}
                    className="flex flex-col text-xs gap-1"
                  >
                    <form className="flex flex-col gap-2">
                      {Object.keys(inputExample).map((inputName) => {
                        return (
                          <div key={inputName} className="">
                            <label htmlFor={inputName}>{inputName}</label>
                            <input
                              type="text"
                              name={inputName}
                              id={`${inputName}-${index}`}
                              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
                              value={inputExample[inputName]}
                              onChange={(e) => {
                                updateInputExample(
                                  selectedNode.id,
                                  inputName,
                                  e.target.value,
                                  index
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                    </form>
                  </div>
                );
              }
            )}
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-2 my-2 rounded flex items-center">
              <PlayIcon
                className={"text-blue-300 -ml-1 mr-1 h-5 w-5 flex-shrink-0"}
                aria-hidden="true"
              />
              <span>Run</span>
            </button>
            {/* add test button */}
          </div>
        </div>
      )}
    </>
  );
}
