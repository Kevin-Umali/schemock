// src/components/custom/tree-node.tsx

import React, { useState, memo, useId, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRightIcon, PlusIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeNode, TreeViewProps, DataType, FakerMethod } from "@/types/tree";
import { DATA_TYPES, FAKER_METHODS } from "@/constants";
import { hasChildren } from "@/lib/tree";

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  isLast: boolean;
  handleNameChange: (id: string, name: string) => void;
  handleTypeChange: (id: string, type: DataType) => void;
  handleFakerMethodChange: (id: string, method: FakerMethod) => void;
  handleArrayItemTypeChange: (id: string, type: DataType) => void;
  handleCountChange: (id: string, count: number) => void;
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
    handleTypeChange,
    handleFakerMethodChange,
    handleArrayItemTypeChange,
    handleCountChange,
    handleAddChild,
    handleDelete,
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
    const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
    const nodeId = useId();

    const showChildren = hasChildren(node) && isExpanded && node.children && node.children.length > 0;
    const canShowAddButton = node.type === "object" || (node.type === "array" && node.arrayItemType === "object");
    const canShowDeleteButton = !node.isRoot;

    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => {
        const newState = !prev;
        onNodeExpand?.(node, newState);
        return newState;
      });
    }, [node, onNodeExpand]);

    const handleSelect = useCallback(() => {
      onNodeSelect?.(node);
    }, [node, onNodeSelect]);

    const handleNodeNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        if (canRenameNode && !canRenameNode(node, newName)) return;
        handleNameChange(node.id, newName);
        onNodeRename?.(node, newName);
      },
      [node, handleNameChange, onNodeRename, canRenameNode]
    );

    const handleNodeDelete = useCallback(() => {
      if (canDeleteNode && !canDeleteNode(node)) return;
      handleDelete(node.id);
      onNodeDelete?.(node);
    }, [node, handleDelete, onNodeDelete, canDeleteNode]);

    const handleNodeAdd = useCallback(() => {
      if (canAddNode && !canAddNode(node)) return;
      handleAddChild(node.id);
      onNodeAdd?.(node, {
        id: `${node.id}-${Date.now()}`,
        name: "New Node",
        type: "string",
      });
    }, [node, handleAddChild, onNodeAdd, canAddNode]);

    const renderControls = () => (
      <div className="flex items-center space-x-2">
        <Input value={node.name} onChange={handleNodeNameChange} className="h-8" placeholder="Property Name" />

        <Select value={node.type} onValueChange={(value) => handleTypeChange(node.id, value as DataType)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              {DATA_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {node.type === "array" && (
          <Select value={node.arrayItemType} onValueChange={(value) => handleArrayItemTypeChange(node.id, value as DataType)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Item Types</SelectLabel>
                {DATA_TYPES.filter((type) => type !== "array").map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {(["string", "number", "boolean", "date"].includes(node.type) ||
          (node.type === "array" && ["string", "number", "boolean", "date"].includes(node.arrayItemType))) && (
          <Select value={node.fakerMethod ?? ""} onValueChange={(value) => handleFakerMethodChange(node.id, value as FakerMethod)}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select Faker Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Faker Methods</SelectLabel>
                {FAKER_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {node.type === "array" && (
          <Input
            type="number"
            min={1}
            max={100}
            value={node.count}
            onChange={(e) => handleCountChange(node.id, parseInt(e.target.value) ?? 1)}
            className="w-20 h-8"
            placeholder="Count"
          />
        )}
      </div>
    );

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
        aria-expanded={hasChildren(node) ? isExpanded : undefined}
        id={nodeId}
      >
        <div className="flex items-center py-1 group">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={toggleExpand}
              className={cn("w-6 h-6 flex items-center justify-center rounded-md transition-colors", hasChildren(node) ? "hover:bg-gray-100" : "invisible")}
            >
              {hasChildren(node) && (
                <ChevronRightIcon
                  className={cn("w-4 h-4 transition-transform duration-200", {
                    "rotate-90": isExpanded,
                  })}
                />
              )}
            </button>

            <div className="flex-1 min-w-0 px-2" onClick={handleSelect}>
              {renderNode ? renderNode(node, handleNameChange) : renderControls()}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {allowAdd && canShowAddButton && (!canAddNode || canAddNode(node)) && (
                <button onClick={handleNodeAdd} className="w-6 h-6 text-green-600 hover:bg-green-50 rounded-md">
                  <PlusIcon className="w-4 h-4" />
                </button>
              )}
              {allowDelete && canShowDeleteButton && (!canDeleteNode || canDeleteNode(node)) && (
                <button onClick={handleNodeDelete} className="w-6 h-6 text-red-600 hover:bg-red-50 rounded-md">
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {hasChildren(node) && node.children && showChildren && (
          <ul role="group" aria-labelledby={nodeId}>
            {node.children.map((child, index) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={index === node.children!.length - 1}
                handleNameChange={handleNameChange}
                handleTypeChange={handleTypeChange}
                handleFakerMethodChange={handleFakerMethodChange}
                handleArrayItemTypeChange={handleArrayItemTypeChange}
                handleCountChange={handleCountChange}
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
