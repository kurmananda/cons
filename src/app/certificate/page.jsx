'use client'

import { useState, useMemo } from 'react'
import Hyperspeed from '../components/Hyperspeed'

export default function PhoneCertificateGenerator() {
  const [phone, setPhone] = useState('')
  const [felt, setFelt] = useState('')
  const [status, setStatus] = useState('')
  const [results, setResults] = useState([])

  // Sample participant dictionary. Replace or extend this with real data.
  const participants = {
    '9491978534': {
      name: 'Kurmananda Pavan Sai Buragana',
      workshops: ['Cube sat', 'agentic AI', 'Python ML']
    },
    '8888888888': {
      name: 'Bob Smith',
      workshops: ['Cube sat', 'Python ML']
    },
    '7777777777': {
      name: 'Chitra Rao',
      workshops: ['Cube sat', 'agentic AI', 'Python ML']
    }
  }

  // Map workshop names to certificate image files (place these images in /public)
  const workshopImages = {
    'Cube sat': '/1.png',
    'agentic AI': '/2.png',
    'Python ML': '/3.png'
  }

  // Background image provided by user
  const bgImageUrl = 'https://imgs.search.brave.com/KKb4y2i0yngGN6PEI3xbBevGanU4KSyfho_iEGHi298/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzcxLzYyLzI4/LzM2MF9GXzU3MTYy/Mjg4OF9yTXo1U1B2/aU9sTTBydzZvVm5Q/S3VnSTVLYkM4cU5L/bi5qcGc'

const HYPERSPEED_OPTIONS = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 20,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 80,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [120, 160],
  movingCloserSpeed: [-160, -200],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
}

  const hyperspeedEffectOptions = useMemo(() => HYPERSPEED_OPTIONS, [])

  const loadImage = (src) =>
    new Promise((res, rej) => {
      const img = new Image()
      img.src = src
      img.onload = () => res(img)
      img.onerror = rej
    })

  const generateCertificates = async () => {
    setStatus('')
    setResults([])

    const trimmedPhone = phone.trim()
    if (!trimmedPhone) {
      setStatus('Please enter a phone number')
      return
    }

    const participant = participants[trimmedPhone]
    if (!participant) {
      setStatus('Number not found')
      return
    }

    // no minimum word requirement for 'felt'

    setStatus('Generating...')

    try {
      const generated = []

      // determine font to match the textarea
      const sampleEl = document.querySelector('textarea')
      const fontFamily = sampleEl ? window.getComputedStyle(sampleEl).fontFamily : 'sans-serif'

      for (const workshop of participant.workshops) {
        // choose image per workshop; fallback to a default certificate image
        const imgSrc = workshopImages[workshop] 
        const wkBase = await loadImage(imgSrc)

        const canvas = document.createElement('canvas')
        canvas.width = wkBase.width
        canvas.height = wkBase.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(wkBase, 0, 0)

        // center coordinates
        const centerX = canvas.width / 2
        const centerY = canvas.height *0.564

        // Draw only the participant name (centered both axes) using textarea font
        ctx.font = `700 48px ${fontFamily}`
        ctx.fillStyle = '#0b2447'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'
        ctx.shadowColor = 'rgba(0,0,0,0.25)'
        ctx.shadowBlur = 6
        ctx.strokeText(participant.name, centerX, centerY)
        ctx.fillText(participant.name, centerX, centerY)

        const dataUrl = canvas.toDataURL('image/png')
        const safeWorkshop = workshop.replace(/\s+/g, '_')
        const filename = `${trimmedPhone}_${safeWorkshop}.png`
        generated.push({ workshop, dataUrl, filename })

        // save response metadata to Supabase (name, phone, workshop, felt)
        try {
          await fetch('/api/save-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: trimmedPhone, name: participant.name, workshop, felt })
          })
        } catch (err) {
          console.warn('Failed to save response to server', err)
        }
      }

      setResults(generated)
      setStatus(`Generated ${generated.length} certificate(s)`)
    } catch (err) {
      setStatus('Error generating certificates')
      console.error(err)
    }
  }

  const download = (dataUrl, filename) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  return (
    
    <>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0">
          <Hyperspeed effectOptions={hyperspeedEffectOptions} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#050505]/45 to-[#050505]" aria-hidden />
      </div>

      <div id="about" className="font-sans-header min-h-screen page-background flex justify-center items-start pt-16 pb-16 relative z-10">
      <div className="w-full max-w-7xl p-6 md:p-12 shadow-2xl rounded-lg">
        <div className="p-4 md:p-10 font-sans">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div
                className="relative p-8 md:p-12 text-white overflow-hidden"
                style={{ backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
                <div className="relative z-10 space-y-5">
                  <h2 className="text-3xl font-bold text-white mb-6">Certificates for workshops</h2>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-100 mb-1">Phone Number</label>
                    <input
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none transition-all bg-white/95 text-gray-900 placeholder-gray-500 shadow"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-yellow-100 mb-1">How you felt</label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none transition-all bg-white/95 text-gray-900 placeholder-gray-500 shadow"
                      placeholder="Describe briefly how you felt at the workshop..."
                      rows="4"
                      value={felt}
                      onChange={(e) => setFelt(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg ${phone ? 'bg-amber-400 hover:bg-amber-500 text-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      onClick={generateCertificates}
                      disabled={!phone}
                    >
                      Generate Certificates
                    </button>
                  </div>
                  {status && <p className="text-sm pt-2 text-yellow-100">{status}</p>}
                </div>
              </div>
              <div className="p-8 bg-gradient-to-tl from-gray-50 to-gray-100 flex flex-col items-center justify-start">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Preview & Downloads</p>
                <div className="w-full bg-white shadow-2xl rounded border border-gray-200 overflow-hidden p-6 flex flex-col items-center">
                  {results.length === 0 && (
                    <div className="aspect-[4/3] flex items-center justify-center text-gray-400 italic p-10 text-center">
                      Enter phone and click Generate to preview certificates here.
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {results.map((r, i) => (
                        <div key={i} className="border rounded p-3 flex flex-col items-center bg-white">
                          <img src={r.dataUrl} alt={`cert-${i}`} className="max-w-[640px] w-full h-auto mb-3 rounded shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer" />
                          <div className="w-full flex gap-2">
                            <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded flex items-center justify-center gap-2" onClick={() => download(r.dataUrl, r.filename)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 3v10.586l3.293-3.293 1.414 1.414L12 17.414l-4.707-4.707 1.414-1.414L11 13.586V3h1z" />
                                <path d="M5 19h14v2H5z" />
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
