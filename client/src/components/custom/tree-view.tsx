// src/components/TreeView.tsx

import React, { useCallback, memo, useId } from "react";
import TreeNodeComponent from "./tree-node";
import { TreeNode, TreeViewProps } from "@/types/tree"; // Adjust the import path as needed

const TreeView: React.FC<TreeViewProps> = ({
  nodes,
  onChange,
  renderNode,
  allowAdd = false,
  allowDelete = false,
  defaultExpanded = true,
  onNodeSelect,
  onNodeExpand,
  onNodeAdd,
  onNodeDelete,
  onNodeRename,
  canAddNode,
  canDeleteNode,
  canRenameNode,
}) => {
  const treeId = useId();

  const handleNameChange = useCallback(
    (id: string, newName: string) => {
      const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, name: newName };
          }
          if (node.children) {
            return { ...node, children: updateNodes(node.children) };
          }
          return node;
        });
      };
      onChange(updateNodes(nodes));
    },
    [nodes, onChange]
  );

  const handleAddChild = useCallback(
    (parentId: string) => {
      const addChild = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            const newChild: TreeNode = {
              id: `${parentId}-${Date.now()}`,
              name: "New Node",
            };
            return {
              ...node,
              children: node.children ? [...node.children, newChild] : [newChild],
            };
          }
          if (node.children) {
            return { ...node, children: addChild(node.children) };
          }
          return node;
        });
      };
      onChange(addChild(nodes));
    },
    [nodes, onChange]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const deleteNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes
          .filter((node) => node.id !== id)
          .map((node) => ({
            ...node,
            children: node.children ? deleteNode(node.children) : undefined,
          }));
      };
      onChange(deleteNode(nodes));
    },
    [nodes, onChange]
  );

  return (
    <ul className="pl-4" role="tree" aria-label="Tree View" id={treeId}>
      {nodes.map((node, index) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          isLast={index === nodes.length - 1}
          handleNameChange={handleNameChange}
          handleAddChild={handleAddChild}
          handleDelete={handleDelete}
          renderNode={renderNode}
          allowAdd={allowAdd}
          allowDelete={allowDelete}
          defaultExpanded={defaultExpanded}
          onNodeSelect={onNodeSelect}
          onNodeExpand={onNodeExpand}
          onNodeAdd={onNodeAdd}
          onNodeDelete={onNodeDelete}
          onNodeRename={onNodeRename}
          canAddNode={canAddNode}
          canDeleteNode={canDeleteNode}
          canRenameNode={canRenameNode}
        />
      ))}
    </ul>
  );
};

export default memo(TreeView);
