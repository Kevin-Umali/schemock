// src/components/TreeNodeComponent.tsx

import React, { useState, memo, useId, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon, PlusIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeNode, TreeViewProps } from "@/types/tree";

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  isLast: boolean;
  handleNameChange: (id: string, name: string) => void;
  handleAddChild: (parentId: string) => void;
  handleDelete: (id: string) => void;
  renderNode?: TreeViewProps["renderNode"];
  allowAdd?: boolean;
  allowDelete?: boolean;
  defaultExpanded?: boolean;

  onNodeSelect?: TreeViewProps["onNodeSelect"];
  onNodeExpand?: TreeViewProps["onNodeExpand"];
  onNodeAdd?: TreeViewProps["onNodeAdd"];
  onNodeDelete?: TreeViewProps["onNodeDelete"];
  onNodeRename?: TreeViewProps["onNodeRename"];

  canAddNode?: TreeViewProps["canAddNode"];
  canDeleteNode?: TreeViewProps["canDeleteNode"];
  canRenameNode?: TreeViewProps["canRenameNode"];
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = memo(
  ({
    node,
    level,
    isLast,
    handleNameChange,
    handleAddChild,
    handleDelete,
    renderNode,
    allowAdd,
    allowDelete,
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
    const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
    const nodeId = useId();
    const hasChildren = node.children && node.children.length > 0;

    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => {
        const newState = !prev;
        if (onNodeExpand) onNodeExpand(node, newState);
        return newState;
      });
    }, [node, onNodeExpand]);

    const handleSelect = useCallback(() => {
      if (onNodeSelect) onNodeSelect(node);
    }, [node, onNodeSelect]);

    const handleNodeNameChange = useCallback(
      (id: string, newName: string) => {
        if (canRenameNode && !canRenameNode(node, newName)) {
          return;
        }
        handleNameChange(id, newName);
        onNodeRename?.(node, newName);
      },
      [node, handleNameChange, onNodeRename, canRenameNode]
    );

    const handleNodeDelete = useCallback(() => {
      if (canDeleteNode && !canDeleteNode(node)) {
        return;
      }
      handleDelete(node.id);
      onNodeDelete?.(node);
    }, [node, handleDelete, onNodeDelete, canDeleteNode]);

    const handleNodeAdd = useCallback(() => {
      if (canAddNode && !canAddNode(node)) {
        return;
      }
      handleAddChild(node.id);
      const newNode: TreeNode = {
        id: `${node.id}-${Date.now()}`,
        name: "New Node",
      };
      onNodeAdd?.(node, newNode);
    }, [node, handleAddChild, onNodeAdd, canAddNode]);

    return (
      <li
        className={cn(
          "relative",
          level > 0 && "ml-5 border-l border-gray-200",
          isLast && level > 0 && "border-l-0",
          level > 0 && "before:absolute before:top-[16px] before:left-0 before:w-5 before:h-px before:bg-gray-200",
          !isLast && level > 0 && "after:absolute after:top-[16px] after:left-[-1px] after:w-px after:h-full after:bg-gray-200"
        )}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        id={nodeId}
      >
        <div className="flex items-center py-1 group">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={toggleExpand}
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded-md transition-colors",
                hasChildren ? "hover:bg-gray-100" : "invisible",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {hasChildren && (
                <div className={cn("transition-transform duration-200", isExpanded ? "rotate-90" : "rotate-0")}>
                  <ChevronRightIcon className="w-4 h-4" />
                </div>
              )}
            </button>

            <div onClick={handleSelect} className="flex-1 min-w-0 px-2" role="presentation">
              {renderNode ? (
                renderNode(node, handleNodeNameChange)
              ) : (
                <Input
                  value={node.name}
                  onChange={(e) => handleNodeNameChange(node.id, e.target.value)}
                  className={cn("h-8", "transition-colors", "hover:border-gray-400", "focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}
                  aria-label={`Node name: ${node.name}`}
                />
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {allowAdd && (!canAddNode || canAddNode(node)) && (
                <button
                  onClick={handleNodeAdd}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-md",
                    "text-green-600 hover:bg-green-50",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  )}
                  aria-label={`Add child to ${node.name}`}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              )}

              {allowDelete && (!canDeleteNode || canDeleteNode(node)) && (
                <button
                  onClick={handleNodeDelete}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-md",
                    "text-red-600 hover:bg-red-50",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  )}
                  aria-label={`Delete ${node.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <ul role="group" aria-labelledby={nodeId}>
            {node.children!.map((child, index) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={index === node.children!.length - 1}
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
        )}
      </li>
    );
  }
);

TreeNodeComponent.displayName = "TreeNodeComponent";

export default TreeNodeComponent;
