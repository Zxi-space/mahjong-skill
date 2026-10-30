import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
export function Dialog({open,title,description,children,onClose}:{open:boolean;title:string;description?:string;children?:ReactNode;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{const dialog=ref.current;if(!dialog)return;if(open&&!dialog.open)dialog.showModal();if(!open&&dialog.open)dialog.close()},[open])
  return <dialog ref={ref} className='admin-dialog' onClose={onClose} onCancel={onClose} aria-label={title}><header><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><button aria-label='关闭弹窗' type='button' className='admin-icon-button' onClick={onClose}><X size={18}/></button></header><div className='admin-dialog-body'>{children}</div></dialog>
}
