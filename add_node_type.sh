#!/bin/bash

# Exit on error
set -e

# Check if the argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <NewNode>"
    exit 1
fi

# Set the project file path and new node name
NODE_TYPES_FILE="src/nodes/types/NodeTypes.tsx"
NEW_NODE="$1"
NEW_DATA_TYPE="${NEW_NODE}DataType"

# Add the new data type
echo "export type ${NEW_DATA_TYPE} = DefaultNodeDataType;" >> $NODE_TYPES_FILE

# Update the CustomNode type
# For macOS, add an empty string after -i
sed -i "" "s/CustomNode = Node</CustomNode = Node<$NEW_DATA_TYPE | /" $NODE_TYPES_FILE

# For Linux, keep the -i without any argument
# sed -i "s/CustomNode = Node</CustomNode = Node<$NEW_DATA_TYPE | /" $NODE_TYPES_FILE

# Function to create the new node file
create_new_node_file() {
    local new_node_file="src/nodes/$1Node.tsx"

    if [ -e "$new_node_file" ]; then
    echo "File or directory exists."
    else
    echo "File or directory does not exist."
        cat > "$new_node_file" <<- EOM
    import { memo, FC, useState } from 'react';
    import { Handle, Position, NodeProps } from 'react-flow';
    import { shallow } from 'zustand/shallow';
    import useUndo from 'use-undo';

    import useStore, { selector } from '../store/useStore';
    import { ${NEW_DATA_TYPE} } from './types/NodeTypes';
    import TextAreaTemplate from './templates/TextAreaTemplate';
    import InputNodesList from './templates/InputNodesList';

    const $1: FC<NodeProps<${NEW_DATA_TYPE}>> = (props) => {
        const { data, selected, id } = props;
        const [textState, { set: setText }] = useUndo(data.text);
        const { present: presentText } = textState;

        const { updateNode } = useStore(selector, shallow);
        const [showPrompt, setshowPrompt] = useState(true);

        return (
            <div className="">
                <div
                    style={{
                        height: showPrompt ? '40rem' : '5rem',
                        width: '35rem',
                    }}
                    className={\`m-3 bg-slate-100 shadow-lg border-2  \${selected ? 'border-emerald-600' : 'border-slate-300'} flex flex-col \`}
                >
                    {/* how to spread  */}
                    <TextAreaTemplate
                        {...props}
                        title="Text"
                        fieldName="Text"
                        bgColor="bg-emerald-200"
                        show={showPrompt}
                        setShow={setshowPrompt}
                        presentText={presentText}
                        setText={setText}
                    >
                        <div className="flex flex-col gap-2 text-md ">
                            <InputNodesList
                                data={data}
                                id={id}
                                setText={setText}
                                updateNode={updateNode}
                            />
                        </div>
                    </TextAreaTemplate>
                </div>
                <Handle
                    type="target"
                    position={Position.Left}
                    id="text-input"
                    className="w-4 h-4"
                ></Handle>
                <Handle type="source" position={Position.Right} id="text-output" className="w-4 h-4" />
            </div>
        );
    };

    export default memo($1);
EOM
    fi
}

toCamelCase() {
  input="$1"
  output="$(tr '[:upper:]' '[:lower:]' <<< "${input:0:1}")${input:1}"
  echo $output
}

update_app_tsx() {
    local app_tsx_file="src/App.tsx"
    local import_statement="import $1Node from './nodes/$1Node';"
    local camel_case_node=$(toCamelCase "$1")
    local node_types_entry="$camel_case_node: $1Node,"

    if ! grep -q "$import_statement" "$app_tsx_file"; then
        sed -i "" "1i\\
$import_statement
" "$app_tsx_file"
    fi

    if ! grep -q "$node_types_entry" "$app_tsx_file"; then
        sed -i "" "/const nodeTypes = {/a\\
$node_types_entry
" "$app_tsx_file"
    fi
}

convertCamelCaseToWords() {
    # Replace uppercase letters with a space followed by the lowercase letter
    echo "$1" | sed 's/\([A-Z]\)/ \1/g'
}

create_node_settings_folder() {
    local camel_case_node=$(toCamelCase "$1")

    local new_tabs_folder="src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs"
    if [ -e "$new_tabs_folder" ]; then
        echo "File or directory exists."
    else
        mkdir -p "src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs"
        echo "Folder created at src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs"
    fi

    local new_tab_file="src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs/$1Tab.tsx"
    if [ -e "$new_tab_file" ]; then
        echo "File or directory exists."
        else
        echo "File or directory does not exist."
        touch $new_tab_file
        echo "File created at src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs/$1Tab.tsx"
        cat > "$new_tab_file" <<- EOM
        import { Node } from 'reactflow';
        import {${NEW_NODE}NodeDataType } from '../../../../../nodes/types/NodeTypes';

        export default function $1Tab({
            selectedNode,
            handleChange,
        }: {
            selectedNode: Node<${NEW_NODE}NodeDataType> | null;
            handleChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
            ) => void;
        }) {
            function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
                e.preventDefault();
            }

            return (
                <>
                    {selectedNode && (
                        <div className="text-sm font-medium leading-6 text-slate-900">
                            {/* form div scrollable using tailwind */}
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="">
                                    <div className="">
                                        <label htmlFor="name" className="block">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="block w-full rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                            value={selectedNode.data.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <label htmlFor="response" className="block">
                                        Value
                                    </label>
                                    <input
                                        type="text"
                                        name="response"
                                        id="response"
                                        className="block w-full rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                        value={selectedNode.data.response}
                                        onChange={handleChange}
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </>
            );
        }
EOM
    fi
    
    if [ -e "$new_tabs_file" ]; then
    echo "File or directory exists."
    else
    local new_tabs_file="src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs.tsx"
    touch $new_tabs_file
    echo "File created at src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs.tsx"
    cat > "$new_tabs_file" <<- EOM
    import { useState } from 'react';
    import { Node } from 'reactflow';
    import { PencilIcon } from '@heroicons/react/20/solid';

    import TabsNavigator from '../../TabsNavigator';
    import $1Tab from './tabs/$1Tab';
    import { $1NodeDataType } from '../../../../nodes/types/NodeTypes';
    import { handleChange } from '../../../../utils/handleFormChange';

    const tabs = [{ name: '$(convertCamelCaseToWords $1)', icon: PencilIcon }];

    export default function $1Tabs({
        selectedNode,
        updateNode,
    }: {
        selectedNode: Node<$1NodeDataType>;
        updateNode: (id: string, data: any) => void;
    }) {
        const [selected, setSelected] = useState(tabs[0].name);

        return (
            <div className="pr-4">
                <div className="overflow-y-auto hide-scrollbar pb-40 pt-4">
                    <TabsNavigator tabs={tabs} selected={selected} setSelected={setSelected} />
                    <div className="pt-2">
                        {selected === '$(convertCamelCaseToWords $1)' && (
                            <$1Tab
                                selectedNode={selectedNode}
                                handleChange={(e) => {
                                    handleChange(e, selectedNode.id, selectedNode.data, updateNode);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
EOM
    fi
    local panels_file="src/windows/SettingsPanel/panel.tsx"
    echo -e "import ${camel_case_node}Tabs from './nodeSettings/${camel_case_node}Node/tabs';\n$(cat $panels_file)" > $panels_file
}
if [ -e "src/nodes/$NEW_NODENode.tsx" ]; then
    echo "File or directory exists."
    else
    echo "File or directory does not exist."
    create_new_node_file "$NEW_NODE"
    echo "New node file 'src/nodes/$NEW_NODENode.tsx created"
fi

# Update src/App.tsx with the new node type
update_app_tsx "$NEW_NODE"
echo "Updated 'src/App.tsx' with the new node type"


create_node_settings_folder "$NEW_NODE"