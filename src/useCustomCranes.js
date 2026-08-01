import { useCallback, useEffect, useState } from 'react'

// Cranes the user adds in-app are stored on THIS device only (localStorage).
// They are merged with the built-in list from cranes.json at render time.
const STORAGE_KEY = 'kobelco.customCranes.v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Ignore write failures (private mode / quota exceeded).
  }
}

// Turn a model name into a stable, URL-safe id slug.
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useCustomCranes() {
  const [customCranes, setCustomCranes] = useState(load)

  useEffect(() => {
    persist(customCranes)
  }, [customCranes])

  // Generate an id unique against every id already in use (built-in + custom).
  const addCrane = useCallback((data, takenIds) => {
    const base = slugify(data.model) || 'crane'
    const taken = new Set(takenIds)
    let id = base
    let n = 2
    while (taken.has(id)) id = `${base}-${n++}`

    const crane = {
      id,
      series: data.series.trim(),
      model: data.model.trim(),
      specUrl: data.specUrl.trim(),
      custom: true,
    }
    setCustomCranes((prev) => [...prev, crane])
    return crane
  }, [])

  const updateCrane = useCallback((id, data) => {
    setCustomCranes((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              series: data.series.trim(),
              model: data.model.trim(),
              specUrl: data.specUrl.trim(),
            }
          : c,
      ),
    )
  }, [])

  const removeCrane = useCallback((id) => {
    setCustomCranes((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return { customCranes, addCrane, updateCrane, removeCrane }
}
