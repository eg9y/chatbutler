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
import { Handle, Position, NodeProps } from 'reactflow';
import useUndo from 'use-undo';

import InputNodesList from './templates/InputNodesList';
import NodeTemplate from './templates/NodeTemplate';
import TextAreaTemplate from './templates/TextAreaTemplate';
import { $NEW_DATA_TYPE, TextNodeDataType } from '@chatbutler/shared';
import { conditionalClassNames } from '../utils/classNames';

const $1: FC<NodeProps<$NEW_DATA_TYPE>> = (props) => {
	const { data, selected, id, type } = props;
	const [textState, { set: setText }] = useUndo(data.text);
	const { present: presentText } = textState;

	const [showFullScreen, setShowFullScreen] = useState(false);

	return (
		<div className="">
			<div
				className={conditionalClassNames(
					data.isDetailMode && 'h-[40rem] w-[35rem]',
					`m-3 shadow-lg`
				)}
			>
				<NodeTemplate
					{...props}
					title="Text"
					fieldName="Text"
					color="emerald"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
					selected={selected}
				>
					{(updateNode: (id: string, data: TextNodeDataType) => void) => (
						<>
							<TextAreaTemplate
								{...props}
								presentText={presentText}
								setText={setText}
							/>
							<div className="flex flex-col gap-2 text-md ">
								<InputNodesList
									data={data}
									id={id}
									setText={setText}
									updateNode={updateNode}
									type={type}
								/>
							</div>
						</>
					)}
				</NodeTemplate>
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

    if [ -e "$new_tabs_file" ]; then
    echo "File or directory exists."
    else
    local new_tabs_file="src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs.tsx"
    touch $new_tabs_file
    echo "File created at src/windows/SettingsPanel/nodeSettings/${camel_case_node}Node/tabs.tsx"
    cat > "$new_tabs_file" <<- EOM
    import { Node } from 'reactflow';

    import { AllDataTypes, TextNodeDataType } from '@chatbutler/shared';
    import TabsTemplate from '../TabsTemplate';

    export default function $1Tabs({
        selectedNode,
        updateNode,
    }: {
        selectedNode: Node<$1NodeDataType>;
        updateNode: (id: string, data: AllDataTypes) => void;
    }) {
        return (
            <TabsTemplate selectedNode={selectedNode} updateNode={updateNode} tabs={[]}></TabsTemplate>
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