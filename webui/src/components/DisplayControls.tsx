import { useUIStore } from '../store/uiStore'

export default function DisplayControls() {
  const spectrumVisible = useUIStore((state) => state.spectrumVisible)
  const setSpectrumVisible = useUIStore((state) => state.setSpectrumVisible)
  const bandplanVisible = useUIStore((state) => state.bandplanVisible)
  const setBandplanVisible = useUIStore((state) => state.setBandplanVisible)

  return (
    <>
      <div className="panel-control">
        <label>
          <input
            type="checkbox"
            checked={spectrumVisible}
            onChange={(e) => setSpectrumVisible(e.target.checked)}
          />
          Show Spectrum
        </label>
      </div>

      <div className="panel-control">
        <label>
          <input
            type="checkbox"
            checked={bandplanVisible}
            onChange={(e) => setBandplanVisible(e.target.checked)}
          />
          Show Bandplan
        </label>
      </div>
    </>
  )
}

