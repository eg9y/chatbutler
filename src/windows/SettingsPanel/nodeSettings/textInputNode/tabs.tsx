import { useState } from "react";
import { Node } from "reactflow";
import { PencilIcon } from "@heroicons/react/20/solid";

import TabsNavigator from "../../TabsNavigator";
import TextInputTab from "./tabs/TextInputTab";
import {
  NodeTypesEnum,
  TextInputNodeDataType,
} from "../../../../nodes/types/NodeTypes";
import { handleChange } from "../../../../utils/handleFormChange";

const tabs = [{ name: "Text Input", icon: PencilIcon }];

export default function TextInputTabs({
  selectedNode,
  updateNode,
}: {
  selectedNode: Node<TextInputNodeDataType>;
  updateNode: (id: string, data: any) => void;
}) {
  const [selected, setSelected] = useState(tabs[0].name);

  return (
    <div className="pr-4">
      <div className="overflow-y-auto hide-scrollbar pb-40 pt-4">
        <TabsNavigator
          tabs={tabs}
          selected={selected}
          setSelected={setSelected}
        />
        <div className="pt-2">
          {selected === "Text Input" && (
            <TextInputTab
              selectedNode={selectedNode}
              handleChange={(e) => {
                handleChange(
                  e,
                  selectedNode.id,
                  selectedNode.data,
                  updateNode,
                  NodeTypesEnum.textInput
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
