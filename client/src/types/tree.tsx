export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  onChange: (nodes: TreeNode[]) => void;
  renderNode?: (node: TreeNode, handleChange: (id: string, name: string) => void) => React.ReactNode;
  allowAdd?: boolean;
  allowDelete?: boolean;
  defaultExpanded?: boolean;

  onNodeSelect?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode, isExpanded: boolean) => void;
  onNodeAdd?: (parentNode: TreeNode | null, newNode: TreeNode) => void;
  onNodeDelete?: (node: TreeNode) => void;
  onNodeRename?: (node: TreeNode, newName: string) => void;

  canAddNode?: (parentNode: TreeNode | null) => boolean;
  canDeleteNode?: (node: TreeNode) => boolean;
  canRenameNode?: (node: TreeNode, newName: string) => boolean;
}
