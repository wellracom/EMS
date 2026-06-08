'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/apiclient/apiClient'
type Props = {
  onChangeSelected: (data: any[]) => void
}
type TreeNode = {
  id: string
  label: string
  checked?: boolean
  expanded?: boolean
  children?: TreeNode[]
}
const getCheckedLeafIds = (nodes: TreeNode[]): any[] => {
  const result: any[] = []

  const walk = (items: TreeNode[]) => {
    for (const node of items) {
      const isLeaf = !node.children || node.children.length === 0

      if (isLeaf && node.checked) {
        result.push({ ids: node.id, name: node.label })
      }

      if (node.children && node.children.length > 0) {
        walk(node.children)
      }
    }
  }

  walk(nodes)

  return result
}
export default function TreeCheckbox({ onChangeSelected }: Props) {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const load = async () => {
    try {
      setLoading(true)

      const req = await apiClient('/api_local/componet/tags/selectag')

      const addExpanded = (nodes: TreeNode[]): TreeNode[] =>
        nodes.map((node) => ({
          ...node,
          expanded: true,
          children: node.children ? addExpanded(node.children) : undefined,
        }))

      setTree(addExpanded(req))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useEffect(() => {
    setSelected(getCheckedLeafIds(tree))
    onChangeSelected(getCheckedLeafIds(tree))
  }, [tree])

  const updateNode = (
    nodes: TreeNode[],
    id: string,
    checked: boolean
  ): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          checked,
          children: node.children
            ? node.children.map((child) => ({
                ...child,
                checked,
              }))
            : undefined,
        }
      }

      return {
        ...node,
        children: node.children
          ? updateNode(node.children, id, checked)
          : undefined,
      }
    })
  }

  const toggleExpand = (nodes: TreeNode[], id: string): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          expanded: !node.expanded,
        }
      }

      return {
        ...node,
        children: node.children ? toggleExpand(node.children, id) : undefined,
      }
    })
  }

  const handleCheck = (id: string, checked: boolean) => {
    setTree((prev) => updateNode(prev, id, checked))
  }

  const handleExpand = (id: string) => {
    setTree((prev) => toggleExpand(prev, id))
  }

  const renderTree = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0

      return (
        <div key={node.id}>
          <div
            style={{ paddingLeft: `${level * 20}px` }}
            className="flex items-center gap-2 py-1"
          >
            {hasChildren ? (
              <button
                type="button"
                className="w-5 cursor-pointer text-center"
                onClick={() => handleExpand(node.id)}
              >
                {node.expanded ? '▼' : '▶'}
              </button>
            ) : (
              <span className="w-5" />
            )}

            <input
              type="checkbox"
              checked={node.checked ?? false}
              onChange={(e) => handleCheck(node.id, e.target.checked)}
            />

            <span>{node.label}</span>
          </div>

          {hasChildren &&
            node.expanded &&
            renderTree(node.children!, level + 1)}
        </div>
      )
    })
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="ml-5 h-4 w-40 rounded bg-gray-200" />
          <div className="ml-10 h-4 w-36 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  return <div className="rounded-lg border p-3">{renderTree(tree)}</div>
}
