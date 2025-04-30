import React, { useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState
} from 'reactflow';
import { create } from 'zustand';
import { FaWpforms, FaCogs, FaCheckCircle, FaGoogle, FaFileExcel } from 'react-icons/fa';
import 'reactflow/dist/style.css';

// Zustand store definition
const useStoreState = create((set) => ({
  nodes: [
    {
      id: '1',
      type: 'custom',
      data: {
        label: 'Contact Form',
        icon: <FaWpforms />,
        tooltip: 'User fills out the contact form',
        status: 'pending',
      },
      position: { x: 50, y: 100 },
    },
    {
      id: '2',
      type: 'custom',
      data: {
        label: 'Send to Backend',
        icon: <FaCogs />,
        tooltip: 'Form data sent to backend',
        status: 'pending',
      },
      position: { x: 250, y: 100 },
    },
    {
      id: '3',
      type: 'custom',
      data: {
        label: 'Process Data',
        icon: <FaCheckCircle />,
        tooltip: 'Backend processes the data',
        status: 'pending',
      },
      position: { x: 450, y: 100 },
    },
    {
      id: '4',
      type: 'custom',
      data: {
        label: 'Send to Google Sheets',
        icon: <FaGoogle />,
        tooltip: 'Processed data sent to Google Sheets',
        status: 'pending',
      },
      position: { x: 650, y: 100 },
    },
    {
      id: '5',
      type: 'custom',
      data: {
        label: 'Stored in Excel',
        icon: <FaFileExcel />,
        tooltip: 'Data saved in Google Sheet',
        status: 'pending',
      },
      position: { x: 850, y: 100 },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
  ],
  setNodeStatus: (id, status) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, status } } : node
      ),
    })),
}));

// Status-based color mapping
const statusColors = {
  pending: '#fff',
  success: '#d4edda',
  error: '#f8d7da',
};

// Custom Node Component
const CustomNode = ({ data }) => (
  <div
    style={{
      padding: 10,
      border: '1px solid #ccc',
      borderRadius: 8,
      background: statusColors[data.status] || '#fff',
      textAlign: 'center',
      minWidth: 160,
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      transition: 'background 0.3s ease',
    }}
    title={data.tooltip}
  >
    <div style={{ fontSize: 28 }}>{data.icon}</div>
    <div style={{ marginTop: 5, fontWeight: 'bold' }}>{data.label}</div>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);

// Node type registration
const nodeTypes = {
  custom: CustomNode,
};

function FlowDiagram() {
  const { nodes, edges, setNodeStatus } = useStoreState();
  const [localNodes, , onNodesChange] = useNodesState(nodes);
  const [localEdges, , onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    const timers = [
      setTimeout(() => setNodeStatus('1', 'success'), 1000),
      setTimeout(() => setNodeStatus('2', 'success'), 2000),
      setTimeout(() => setNodeStatus('3', 'success'), 3000),
      setTimeout(() => setNodeStatus('4', 'success'), 4000),
      setTimeout(() => setNodeStatus('5', 'success'), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [setNodeStatus]);

  return (
    <div style={{ height: '500px', backgroundColor: '#f0f4f8', borderRadius: 8, padding: 10 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={localNodes}
          edges={localEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default FlowDiagram;
