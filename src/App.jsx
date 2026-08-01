import { useMemo, useState } from 'react'
import cranes from './data/cranes.json'
import './App.css'

function openSpec(url, onError) {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    // If the browser blocked the popup, window.open returns null.
    if (!win) {
      onError('Spec sheet unavailable — try again later')
    }
  } catch {
    onError('Spec sheet unavailable — try again later')
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cranes
    return cranes.filter(
      (c) =>
        c.model.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q),
    )
  }, [query])

  // Group the filtered list by series, preserving first-seen order.
  const groups = useMemo(() => {
    const map = new Map()
    for (const c of filtered) {
      if (!map.has(c.series)) map.set(c.series, [])
      map.get(c.series).push(c)
    }
    return [...map.entries()]
  }, [filtered])

  const handleOpen = (crane) => {
    setError('')
    openSpec(crane.specUrl, setError)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
            alt="Kobelco"
          />
          <div className="brand-text">
            <span className="brand-title">Kobelco</span>
            <span className="brand-subtitle">Crane Specs</span>
          </div>
        </div>
        <input
          className="search"
          type="search"
          inputMode="search"
          placeholder="Search model or series…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search cranes"
        />
      </header>

      <main className="content">
        {error && <div className="banner banner-error">{error}</div>}

        {filtered.length === 0 ? (
          <div className="empty">No cranes match “{query}”.</div>
        ) : (
          groups.map(([series, items]) => (
            <section key={series} className="group">
              <h2 className="group-title">{series}</h2>
              <ul className="list">
                {items.map((crane) => (
                  <li key={crane.id}>
                    <button
                      type="button"
                      className="row"
                      onClick={() => handleOpen(crane)}
                    >
                      <span className="row-model">{crane.model}</span>
                      <span className="row-series">{crane.series}</span>
                      <span className="row-chevron" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <footer className="app-footer">
        Tap a model to open its spec sheet.
      </footer>
    </div>
  )
}
