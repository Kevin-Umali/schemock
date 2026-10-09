/** Compatibility shape for schema links created by the original editor. */
export interface TreeDataNode {
  id: string
  label: string
  dataType: string
  fakerFunction?: string
  isRootNode?: boolean
  locale?: string
  children?: TreeDataNode[]
  itemDataType?: string
  count?: number
}
