// src/App.tsx
import { useState } from "react";
import TreeView from "./components/custom/tree-view";
import "./index.css";
import { TreeNode } from "./types/tree";

const App = () => {
  const [nodes, setNodes] = useState<TreeNode[]>([
    {
      id: "1",
      name: "Root 1",
      children: [
        { id: "1-1", name: "Child 1-1" },
        { id: "1-2", name: "Child 1-2" },
      ],
    },
    {
      id: "2",
      name: "Root 2",
      children: [
        {
          id: "2-1",
          name: "Child 2-1",
          children: [{ id: "2-1-1", name: "Grandchild 2-1-1" }],
        },
      ],
    },
  ]);

  return (
    <TreeView
      nodes={nodes}
      onChange={setNodes}
      allowAdd
      allowDelete
      onNodeSelect={(node) => console.log("Selected:", node)}
      onNodeExpand={(node, isExpanded) => console.log("Expanded:", node, isExpanded)}
      onNodeAdd={(parentNode, newNode) => console.log("Added:", newNode, "to:", parentNode)}
      onNodeDelete={(node) => console.log("Deleted:", node)}
      onNodeRename={(node, newName) => console.log("Renamed:", node, "to:", newName)}
    />
  );
};

export default App;
