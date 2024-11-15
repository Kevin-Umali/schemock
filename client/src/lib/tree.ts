// src/lib/tree.ts

import { TreeNode, DataType, PrimitiveNode, ArrayNode, ObjectNode } from "@/types/tree";

export const isObjectNode = (node: TreeNode): node is ObjectNode => {
  return node.type === "object";
};

export const isArrayNode = (node: TreeNode): node is ArrayNode => {
  return node.type === "array";
};

export const hasChildren = (node: TreeNode): node is ObjectNode | ArrayNode => {
  return isObjectNode(node) || (isArrayNode(node) && node.arrayItemType === "object");
};

export const createNode = (parentId: string | null, type: DataType = "string", isRoot = false): TreeNode => {
  const baseProps = {
    id: `${parentId ? parentId + "-" : ""}${Date.now()}`,
    name: "New Node",
    type,
    isRoot,
    ...(isRoot ? { locale: "en" as const } : {}),
  };

  switch (type) {
    case "object":
      return {
        ...baseProps,
        type: "object",
        children: [],
      };
    case "array":
      return {
        ...baseProps,
        type: "array",
        arrayItemType: "string",
        count: 1,
        children: [],
      };
    default:
      return {
        ...baseProps,
        type,
      } as PrimitiveNode;
  }
};

export const updateNodeInTree = (nodes: TreeNode[], nodeId: string, updater: (node: TreeNode) => TreeNode): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return updater(node);
    }
    if (hasChildren(node) && node.children) {
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updater),
      };
    }
    return node;
  });
};

export const cleanupNodeLocale = (node: TreeNode): TreeNode => {
  const cleanedNode = { ...node };
  if (!node.isRoot) {
    delete cleanedNode.locale;
  }
  if ("children" in cleanedNode && cleanedNode.children) {
    cleanedNode.children = cleanedNode.children.map(cleanupNodeLocale);
  }
  return cleanedNode;
};
