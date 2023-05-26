toCamelCase() {
  input="$1"
  output="$(tr '[:upper:]' '[:lower:]' <<< "${input:0:1}")${input:1}"
  echo $output
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
        import {${1}NodeDataType } from '@chatbutler/shared';

        export default function $1Tab({
            selectedNode,
            handleChange,
        }: {
            selectedNode: Node<${1}NodeDataType> | null;
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
    import { $1NodeDataType } from '@chatbutler/shared';
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
    echo "import ${camel_case_node}Tabs from './nodeSettings/${camel_case_node}Node/tabs';\n$(cat $panels_file)" > $panels_file
}


create_node_settings_folder "$1"