import { useMemo, useState } from 'react'
import builtInCranes from './data/cranes.json'
import { useCustomCranes } from './useCustomCranes'
import CraneForm from './CraneForm'
import './App.css'

function openSpec(url, onError) {
  // Use a synthetic anchor click rather than window.open(...): it opens a new
  // tab reliably without tripping popup blockers, and applies noopener via the
  // rel attribute. (Passing 'noopener' to window.open makes it return null,
  // which previously made this look like a failure on every tap.)
  try {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch {
    onError('Spec sheet unavailable — try again later')
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  // form: null (closed) | { editing: crane|null }
  const [form, setForm] = useState(null)

  const { customCranes, addCrane, updateCrane, removeCrane } = useCustomCranes()

  // Built-in list first, then the user's device-local additions.
  const allCranes = useMemo(
    () => [...builtInCranes, ...customCranes],
    [customCranes],
  )

  const seriesOptions = useMemo(
    () => [...new Set(allCranes.map((c) => c.series))].sort(),
    [allCranes],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allCranes
    return allCranes.filter(
      (c) =>
        c.model.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q),
    )
  }, [allCranes, query])

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

  const handleSubmit = (data) => {
    if (form?.editing) {
      updateCrane(form.editing.id, data)
    } else {
      const takenIds = allCranes.map((c) => c.id)
      addCrane(data, takenIds)
    }
    setForm(null)
  }

  const handleDelete = (crane) => {
    if (window.confirm(`Remove “${crane.model}” from this device?`)) {
      removeCrane(crane.id)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}kobelco-logo-white.png`}
            alt="Kobelco"
          />
          <span className="brand-tag">Crane Specs</span>
          <button
            type="button"
            className="btn btn-add"
            onClick={() => setForm({ editing: null })}
          >
            + Add
          </button>
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
                  <li key={crane.id} className="row">
                    <button
                      type="button"
                      className="row-open"
                      onClick={() => handleOpen(crane)}
                    >
                      <span className="row-model">
                        {crane.model}
                        {crane.custom && (
                          <span className="badge" title="Added on this device">
                            Added
                          </span>
                        )}
                      </span>
                      <span className="row-series">{crane.series}</span>
                      <span className="row-chevron" aria-hidden="true">
                        ›
                      </span>
                    </button>

                    {crane.custom && (
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Edit ${crane.model}`}
                          onClick={() => setForm({ editing: crane })}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          aria-label={`Delete ${crane.model}`}
                          onClick={() => handleDelete(crane)}
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <footer className="app-footer">
        <span className="footer-hint">Tap a model to open its spec sheet.</span>
        <span className="footer-credit">
          Developed by Murphree Information Software
        </span>
      </footer>

      {form && (
        <CraneForm
          initial={form.editing}
          seriesOptions={seriesOptions}
          onSubmit={handleSubmit}
          onCancel={() => setForm(null)}
        />
      )}
    </div>
  )
}
