import { useState } from 'react'

// Modal form for adding or editing a custom crane.
// `initial` present => edit mode; absent/null => add mode.
export default function CraneForm({ initial, seriesOptions, onSubmit, onCancel }) {
  const [model, setModel] = useState(initial?.model ?? '')
  const [series, setSeries] = useState(initial?.series ?? '')
  const [specUrl, setSpecUrl] = useState(initial?.specUrl ?? '')
  const [error, setError] = useState('')

  const isEdit = Boolean(initial)

  const submit = (e) => {
    e.preventDefault()

    if (!model.trim() || !series.trim() || !specUrl.trim()) {
      setError('All three fields are required.')
      return
    }

    // Be forgiving: prepend https:// if the user omitted the scheme.
    let url = specUrl.trim()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    try {
      new URL(url)
    } catch {
      setError('Enter a valid spec URL.')
      return
    }

    onSubmit({ model: model.trim(), series: series.trim(), specUrl: url })
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit crane' : 'Add crane'}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">{isEdit ? 'Edit crane' : 'Add a crane'}</h2>

        <form onSubmit={submit} noValidate>
          <label className="field">
            <span>Model</span>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="CK 3000G-3"
              autoFocus
            />
          </label>

          <label className="field">
            <span>Series</span>
            <input
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="CK-G3 Series"
              list="series-options"
            />
          </label>
          <datalist id="series-options">
            {seriesOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          <label className="field">
            <span>Spec URL</span>
            <input
              value={specUrl}
              onChange={(e) => setSpecUrl(e.target.value)}
              placeholder="https://…/spec.pdf"
              inputMode="url"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <p className="modal-note">
            Saved on this device only. To publish for everyone, add it to
            <code> cranes.json</code> and redeploy.
          </p>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save changes' : 'Add crane'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
