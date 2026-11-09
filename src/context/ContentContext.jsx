import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { defaultContent } from '../data/defaultContent'
import { loadLocal, saveLocal, clearLocal, loadRemote, deepMerge, diffDeep } from '../utils/storage'

const Ctx = createContext(null)

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null)
  const [local, setLocal] = useState(() => loadLocal())
  const [ready, setReady] = useState(false)

  useEffect(() => { loadRemote().then(r => { setRemote(r); setReady(true) }) }, [])

  const base = deepMerge(defaultContent, remote)
  const content = deepMerge(base, local)

  const updateContent = useCallback((next) => { const diff = diffDeep(base, next) || null; setLocal(diff); saveLocal(next, base) }, [base])
  const resetLocal = useCallback(() => { clearLocal(); setLocal(null) }, [])

  return <Ctx.Provider value={{ content, updateContent, resetLocal, hasLocal: !!local, ready }}>{children}</Ctx.Provider>
}

export function useContent() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent must be used within ContentProvider')
  return c
}
