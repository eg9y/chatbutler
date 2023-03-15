import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  MarkerType,
} from "reactflow";

import "reactflow/dist/base.css";

import { Child, Resizeable } from "react-resizeable";

import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/20/solid";

import { shallow } from "zustand/shallow";

import useStore, { selector } from "./store/useStore";

import LeftSidePanel from "./windows/LeftSidePanel";
import SettingsPanel from "./windows/SettingsPanel/panel";
import LLMPromptNode from "./nodes/LLMPromptNode";
import TextInputNode from "./nodes/TextInputNode";
import ConnectionLine from "./connection/ConnectionLine";
import { useState } from "react";

const nodeTypes = { llmPrompt: LLMPromptNode, textInput: TextInputNode };

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onAdd,
    onNodeDragStop,
    onEdgesDelete,
  } = useStore(selector, shallow);

  const [settingsView, setSettingsView] = useState(true);
  const [nodeView, setNodeView] = useState(true);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "0.5fr 3fr 1fr",
        height: "100vh",
        width: "100vw",
      }}
    >
      {nodeView && (
        <div className="">
          <LeftSidePanel onAdd={onAdd} />
        </div>
      )}
      <div
        style={{
          gridColumnStart: nodeView ? "2" : "1",
          gridColumnEnd: settingsView ? "3" : "4",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineComponent={ConnectionLine}
          onNodeDragStart={onNodeDragStop}
          onNodeClick={onNodeDragStop}
          onEdgesDelete={onEdgesDelete}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: {
              strokeWidth: 2,
              // stroke: '#FF0072',
              stroke: "#002",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 25,
              height: 25,
              // color: "#FF0072",
              color: "#002",
            },
          }}
        >
          <Controls
          // shift right enough to not be overlapped by LeftSidePanel
          />
          <MiniMap
          // shift left enough to not be overlapped by SettingsPanel
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel
            position="top-right"
            className="m-0 cursor-pointer shadow-lg bg-slate-50 ring-2 ring-slate-400 rounded-bl-xl z-10"
            onClick={() => setSettingsView(!settingsView)}
          >
            {settingsView ? (
              <ChevronDoubleRightIcon
                style={{
                  height: "30px",
                  width: "50px",
                }}
                className={
                  "text-slate-400 group-hover:text-gray-500 h-full mx-auto"
                }
                aria-hidden="true"
              />
            ) : (
              <div className="flex items-center px-4">
                {
                  <ChevronDoubleLeftIcon
                    style={{
                      height: "30px",
                    }}
                    className={
                      "text-gray-400 group-hover:text-gray-500 flex-shrink-0"
                    }
                    aria-hidden="true"
                  />
                }
                <span className="text-slate-500 font-semibold">Settings</span>
              </div>
            )}
          </Panel>

          {/* TODO: Toggling will move the entire graph, need to figure out a way to make it constant */}
          <Panel
            position="top-left"
            className="m-0 cursor-pointer shadow-lg bg-slate-50 ring-2 ring-slate-300 rounded-br-xl"
            onClick={() => {
              setNodeView(!nodeView);
            }}
          >
            {nodeView ? (
              <ChevronDoubleLeftIcon
                style={{
                  height: "30px",
                  width: "50px",
                }}
                className={
                  "text-slate-400 group-hover:text-gray-500 h-full mx-auto"
                }
                aria-hidden="true"
              />
            ) : (
              <div className="flex items-center px-4">
                {
                  <ChevronDoubleRightIcon
                    style={{
                      height: "30px",
                    }}
                    className={
                      "text-gray-400 group-hover:text-gray-500 flex-shrink-0"
                    }
                    aria-hidden="true"
                  />
                }
                <span className="text-slate-500 font-semibold">Nodes</span>
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>

      {settingsView && <SettingsPanel />}
    </div>
  );
}
