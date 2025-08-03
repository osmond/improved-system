import { createContext, useContext, useState, ReactNode } from 'react'

interface SelectionState {
  selected: string[]
  toggle: (key: string) => void
  clear: () => void
}

const SelectionContext = createContext<SelectionState | undefined>(undefined)

function useProvideSelection(): SelectionState {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  const clear = () => setSelected([])
  return { selected, toggle, clear }
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const value = useProvideSelection()
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export default function useSelection(): SelectionState {
  const ctx = useContext(SelectionContext)
  const fallback = useProvideSelection()
  return ctx || fallback
}

