"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Controls,
  useEdgesState,
  useNodesState,
  addEdge,
  MiniMap,
  Panel,
  useReactFlow,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import customNode from "./custom-node";
import Dagre from "@dagrejs/dagre";

const getLayoutedElements = (nodes: any, edges: any, options: any) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: any) =>
    g.setNode(node.id, {
      ...node,
      width: 150, // Approximate width of your custom node
      height: 100, // Approximate height of your custom node
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: any) => {
      const position = g.node(node.id);
      const x = position.x - 75; // Half of the node width
      const y = position.y - 50; // Half of the node height
      const isHorizontal = options.direction === "LR";

      return {
        ...node,
        position: { x, y },
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
      };
    }),
    edges,
  };
};

const nodeTypes = {
  custom: customNode,
};

const Flow = ({ evts }: { evts: any[] }) => {
  const newNodes: any[] = [];
  const newEdges: any[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(newNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(newEdges);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onLayout = useCallback(
    (direction: any) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      fitView();
    },
    [nodes, edges, fitView],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-teal-50"
    >
      <Panel position="top-right">
        <button
          onClick={() => onLayout("TB")}
          className="px-3 py-1 bg-white border rounded-md shadow-sm hover:bg-gray-50 mr-2"
        >
          Vertical Layout
        </button>
        <button
          onClick={() => onLayout("LR")}
          className="px-3 py-1 bg-white border rounded-md shadow-sm hover:bg-gray-50"
        >
          Horizontal Layout
        </button>
      </Panel>
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
