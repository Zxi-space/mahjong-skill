import type { ReactNode } from 'react'
import { EmptyState } from './empty-state'
export interface TableColumn<T> { key: string; title: string; render: (row:T)=>ReactNode }
export function DataTable<T>({columns, rows, rowKey, emptyMessage='暂无记录'}:{columns:TableColumn<T>[];rows:T[];rowKey:(row:T)=>string;emptyMessage?:string}) {return <div className='admin-table-wrap'><table className='admin-table'><thead><tr>{columns.map(c=><th key={c.key} scope='col'>{c.title}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={rowKey(row)}>{columns.map(c=><td key={c.key}>{c.render(row)}</td>)}</tr>)}{rows.length===0&&<tr><td colSpan={columns.length}><EmptyState title={emptyMessage} description='接入实际数据后在此显示列表。'/></td></tr>}</tbody></table></div>}
