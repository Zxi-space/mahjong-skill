'use client'
import * as React from 'react'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Table,TableHeader,TableBody,TableRow,TableHead,TableCell } from './table'
import { Button } from './button'
import { EmptyState } from './empty-state'
export interface TableColumn<T> {key:string;title:string;render:(row:T)=>React.ReactNode;sortable?:boolean}
export function DataTable<T>({columns,rows,rowKey,emptyMessage='暂无记录',loading=false}:{columns:TableColumn<T>[];rows:T[];rowKey:(row:T)=>string;emptyMessage?:string;loading?:boolean}){
 const [sorting,setSorting]=React.useState<SortingState>([])
 const tableColumns=React.useMemo<ColumnDef<T>[]>(()=>columns.map(col=>({
  id:col.key,accessorFn:row=>col.render(row),enableSorting:col.sortable??false,
  header:({column})=>col.sortable?<Button variant='ghost' size='sm' onClick={()=>column.toggleSorting(column.getIsSorted()==='asc')}>{col.title}{column.getIsSorted()==='asc'?<ArrowUp/>:column.getIsSorted()==='desc'?<ArrowDown/>:<ArrowUpDown/>}</Button>:col.title,
  cell:({row})=>col.render(row.original),
 })),[columns])
 const table=useReactTable({data:rows,columns:tableColumns,state:{sorting},onSortingChange:setSorting,getCoreRowModel:getCoreRowModel(),getSortedRowModel:getSortedRowModel(),getRowId:rowKey})
 return <div className='w-full overflow-x-auto rounded-xl border border-[var(--qb-border-subtle)]'><Table className='min-w-[420px]'><TableHeader>{table.getHeaderGroups().map(group=><TableRow key={group.id}>{group.headers.map(header=><TableHead key={header.id}>{header.isPlaceholder?null:flexRender(header.column.columnDef.header,header.getContext())}</TableHead>)}</TableRow>)}</TableHeader><TableBody>{loading?<TableRow><TableCell colSpan={columns.length} className='py-9 text-center text-[var(--qb-text-secondary)]'>数据加载中…</TableCell></TableRow>:table.getRowModel().rows.length?table.getRowModel().rows.map(row=><TableRow key={row.id}>{row.getVisibleCells().map(cell=><TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell,cell.getContext())}</TableCell>)}</TableRow>):<TableRow><TableCell colSpan={Math.max(columns.length,1)}><EmptyState title={emptyMessage} description='接入实际数据后在此显示列表。'/></TableCell></TableRow>}</TableBody></Table></div>
}
