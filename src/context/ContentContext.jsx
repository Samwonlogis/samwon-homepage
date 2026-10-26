import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { defaultContent } from '../data/defaultContent'
import { loadLocal, saveLocal, clearLocal, loadRemote, deepMerge } from '../utils/storage'

const Ctx = createContext(null)

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null)
  const [local, setLocal] = useState(() => loadLocal())
  const [ready, setReady] = useState(false)

  useEffect(() => { loadRemote().then(r => { setRemote(r); setReady(true) }) }, [])

  const content = deepMerge(deepMerge(defaultContent, remote), local)

  const updateContent = useCallback((next) => { setLocal(next); saveLocal(next) }, [])
  const resetLocal = useCallback(() => { clearLocal(); setLocal(null) }, [])

  return <Ctx.Provider value={{ content, updateContent, resetLocal, hasLocal: !!local, ready }}>{children}</Ctx.Provider>
}

export function useContent() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent must be used within ContentProvider')
  return c
}
