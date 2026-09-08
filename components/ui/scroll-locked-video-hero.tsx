"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// ─────────────────────────────────────────────────────────────
// WHEREVER YOU RUN
// A looping running video sits inside a square, floating "screen"
// that tilts toward the cursor. Behind it, a real immersive
// background image (not CSS blobs) sets the palette — deep navy,
// bright cyan glow, warm amber accent — sampled directly from
// that image and reused across every UI color. The track list has
// real momentum physics (flick-and-settle, not 1:1 drag) and a
// wide-angle "coverflow" lean. Prev/play/next controls are real
// and functional. On touch devices the whole composition changes:
// no background, no card chrome — just the video filling a
// phone-shaped frame with the player overlaid directly on it, like
// a native mobile app. Zero dependencies, synthesized sound only.
// ─────────────────────────────────────────────────────────────

export interface Track {
  id: string
  title: string
  artist: string
  colorA: string
  colorB: string
}

const REPO = "https://raw.githubusercontent.com/gughigug/run-hero-assets/main"
const DEFAULT_VIDEO = `${REPO}/Legs_sprinting_on_pavement_1080p_202608312152.mp4`
const DEFAULT_BG = `${REPO}/bg-immersive.jpg`

const DEFAULT_TRACKS: Track[] = [
  { id: "t1", title: "Night Drift", artist: "Halcyon Bloom", colorA: "#5db8ff", colorB: "#0b407d" },
  { id: "t2", title: "Low Static", artist: "Marbled Glass", colorA: "#ff8a5c", colorB: "#7a3418" },
  { id: "t3", title: "Concrete Bloom", artist: "Faded Radio", colorA: "#4fd8e0", colorB: "#0e4a4c" },
  { id: "t4", title: "Second Wind", artist: "Pale Signal", colorA: "#ffb35c", colorB: "#7a4a10" },
  { id: "t5", title: "Empty Streets", artist: "Nocturne Coast", colorA: "#6c9fff", colorB: "#132248" },
  { id: "t6", title: "Salt & Static", artist: "Tidal Grey", colorA: "#5ce0c6", colorB: "#0e4a3c" },
  { id: "t7", title: "Amber Hours", artist: "Loose Gravity", colorA: "#ffcc66", colorB: "#7a5410" },
  { id: "t8", title: "Half Light", artist: "Faded Radio", colorA: "#8ab8ff", colorB: "#1a2a5c" },
  { id: "t9", title: "Runner's High", artist: "Pale Signal", colorA: "#ff7a6c", colorB: "#5c1818" },
  { id: "t10", title: "Glass Horizon", artist: "Marbled Glass", colorA: "#5cd0ff", colorB: "#0e3a56" },
  { id: "t11", title: "Warm Static", artist: "Halcyon Bloom", colorA: "#ff9a5c", colorB: "#5c2a10" },
  { id: "t12", title: "Farther Still", artist: "Nocturne Coast", colorA: "#8fa8ff", colorB: "#2c1a5c" },
]

export interface MusicHeroProps {
  title?: string
  videoSrc?: string
  backgroundSrc?: string
  tracks?: Track[]
  signature?: { name: string; url: string } | false
  sound?: boolean
  fullBleed?: boolean
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SIGNATURE = { name: "by guglielmogiannattasio.exe", url: "https://www.guglielmogiannattasio.it" }
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const CYAN = "#74b9f1"
const AMBER = "#f3724c"
const bgVar = "hsl(var(--background, 220 25% 4%))"
const fgVar = "hsl(var(--foreground, 210 40% 98%))"
const fgMutedVar = (a: number) => `hsl(var(--foreground, 210 40% 98%) / ${a})`
const cardVar = (a = 1) => `hsl(var(--card, 220 20% 10%) / ${a})`
const ROW_HEIGHT = 60
const MAX_VIDEO_VOLUME = 0.32

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

function playWheelClick(ctx: AudioContext, velocity: number) {
  const now = ctx.currentTime
  const strength = clamp(velocity, 0, 1)

  function tick(at: number, vol: number) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.012)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.6)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 4200 + strength * 700
    bp.Q.value = 3
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(vol, at)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.018)
    noise.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)
    noise.start(at)
  }
  tick(now, 0.11 + strength * 0.07)
}

export default function MusicHero({
  title = "THE SOUNDTRACK TO EVERY STEP",
  videoSrc = DEFAULT_VIDEO,
  backgroundSrc = DEFAULT_BG,
  tracks = DEFAULT_TRACKS,
  signature = DEFAULT_SIGNATURE,
  sound = true,
  fullBleed = true,
  className,
  style,
}: MusicHeroProps) {
  const listViewportRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const snapTargetRef = useRef<number | null>(null)
  const lastDetentRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastDragYRef = useRef(0)
  const lastDragTRef = useRef(0)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [videoSoundOn, setVideoSoundOn] = useState(false)
  const [videoVolume, setVideoVolume] = useState(0.16)
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState("")
  const announceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [theme, setTheme] = useState<"video" | "minimal">("video")
  const effectiveFullscreen = isFullscreen
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  const n = tracks.length

  useEffect(() => {
    const check = () => {
      const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches
      const narrow = typeof window !== "undefined" && window.innerWidth < 700
      setIsCoarsePointer(Boolean(coarse || narrow))
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    announceTimerRef.current = setTimeout(() => {
      const t = tracks[activeIndex]
      if (t) setAnnouncement(`Now showing ${t.title} by ${t.artist}`)
    }, 400)
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    }
  }, [activeIndex, tracks])

  useEffect(() => {
    setAnnouncement(isPlaying ? "Playing" : "Paused")
  }, [isPlaying])

  function getCtx(): AudioContext | null {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new Ctx()
      }
      return audioCtxRef.current
    } catch {
      return null
    }
  }
  function fireClick(velocity: number) {
    const ctx = getCtx()
    if (!ctx) return
    if (ctx.state === "suspended") ctx.resume().then(() => playWheelClick(ctx, velocity)).catch(() => {})
    else playWheelClick(ctx, velocity)
  }

  useEffect(() => {
    const unlock = () => {
      const ctx = getCtx()
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {})
      if (sound) setVideoSoundOn(true)
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("touchstart", unlock)
      window.removeEventListener("keydown", unlock)
      window.removeEventListener("wheel", unlock)
    }
    window.addEventListener("pointerdown", unlock, { once: true })
    window.addEventListener("touchstart", unlock, { once: true })
    window.addEventListener("keydown", unlock, { once: true })
    window.addEventListener("wheel", unlock, { once: true, passive: true })
    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("touchstart", unlock)
      window.removeEventListener("keydown", unlock)
      window.removeEventListener("wheel", unlock)
    }
  }, [sound])

  useEffect(() => {
    let rafId = 0
    function render() {
      const offset = offsetRef.current
      const centerIndexFloat = offset / ROW_HEIGHT

      rowRefs.current.forEach((el, i) => {
        if (!el) return
        let d = i - centerIndexFloat
        d = mod(d + n / 2, n) - n / 2
        const absD = Math.abs(d)
        const rotate = clamp(d * 9, -22, 22)
        const scale = clamp(1 - absD * 0.1, 0.72, 1)
        const opacity = clamp(1 - absD * 0.4, 0, 1)
        const z = -absD * 18
        const y = d * ROW_HEIGHT
        el.style.transform = `translateY(${y}px) translateZ(${z}px) rotateX(${rotate}deg) scale(${scale})`
        el.style.opacity = String(opacity)
        el.style.pointerEvents = absD < 0.5 ? "auto" : "none"
        el.style.zIndex = String(1000 - Math.round(absD * 10))
      })

      const nearest = mod(Math.round(centerIndexFloat), n)
      setActiveIndex((prev) => (prev === nearest ? prev : nearest))
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafId)
  }, [n])

  useEffect(() => {
    let rafId = 0
    function physics() {
      if (snapTargetRef.current !== null) {
        const target = snapTargetRef.current
        offsetRef.current += (target - offsetRef.current) * 0.22
        if (Math.abs(target - offsetRef.current) < 0.4) {
          offsetRef.current = target
          snapTargetRef.current = null
        }
      } else if (!isDraggingRef.current) {
        offsetRef.current += velocityRef.current
        velocityRef.current *= 0.93
        if (Math.abs(velocityRef.current) < 0.02) velocityRef.current = 0
      }

      const detent = Math.round(offsetRef.current / ROW_HEIGHT)
      if (detent !== lastDetentRef.current) {
        lastDetentRef.current = detent
        fireClick(clamp(Math.abs(velocityRef.current) / ROW_HEIGHT, 0.15, 1))
      }
      rafId = requestAnimationFrame(physics)
    }
    rafId = requestAnimationFrame(physics)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      snapTargetRef.current = null
      velocityRef.current += e.deltaY * 0.045
      velocityRef.current = clamp(velocityRef.current, -14, 14)
      const ctx = getCtx()
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {})
    }
    const onTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true
      snapTargetRef.current = null
      velocityRef.current = 0
      lastDragYRef.current = e.touches[0]?.clientY ?? 0
      lastDragTRef.current = performance.now()
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return
      e.preventDefault()
      const y = e.touches[0]?.clientY ?? lastDragYRef.current
      const dy = lastDragYRef.current - y
      offsetRef.current += dy
      const t = performance.now()
      const dt = Math.max(1, t - lastDragTRef.current)
      velocityRef.current = (dy / dt) * 16
      lastDragYRef.current = y
      lastDragTRef.current = t
    }
    const onTouchEnd = () => {
      isDraggingRef.current = false
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  const BASE_ROTATE_Y = -13
  const BASE_ROTATE_X = 5

  const onCardMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isCoarsePointer || theme === "minimal") return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5

    if (effectiveFullscreen) {
      const el = videoWrapRef.current
      if (!el) return
      el.style.transition = "transform 0.05s linear"
      el.style.transform = `scale(1.45) rotateY(${px * 26}deg) rotateX(${-py * 20}deg)`
    } else {
      const el = cardRef.current
      if (!el) return
      el.style.transition = "width 0.5s cubic-bezier(.2,.8,.2,1), height 0.5s cubic-bezier(.2,.8,.2,1), transform 0.05s linear"
      el.style.transform = `rotateY(${px * 46}deg) rotateX(${-py * 38}deg) scale(1.03)`
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${-px * 34}px, ${-py * 24}px) scale(1.06)`
      }
    }
  }, [isCoarsePointer, theme, effectiveFullscreen])

  const onCardLeave = useCallback(() => {
    if (theme === "minimal") return
    if (effectiveFullscreen) {
      const el = videoWrapRef.current
      if (el) {
        el.style.transition = "transform 0.6s cubic-bezier(.2,.8,.2,1)"
        el.style.transform = "scale(1.45) rotateY(0deg) rotateX(0deg)"
      }
      return
    }
    const el = cardRef.current
    if (el) {
      el.style.transition = "width 0.5s cubic-bezier(.2,.8,.2,1), height 0.5s cubic-bezier(.2,.8,.2,1), transform 0.6s cubic-bezier(.2,.8,.2,1)"
      el.style.transform = `rotateY(${BASE_ROTATE_Y}deg) rotateX(${BASE_ROTATE_X}deg) scale(1)`
    }
    if (bgRef.current) {
      bgRef.current.style.transition = "transform 0.6s cubic-bezier(.2,.8,.2,1)"
      bgRef.current.style.transform = "translate(0px, 0px) scale(1.06)"
    }
  }, [theme, effectiveFullscreen])

  const setRowRef = useCallback((i: number) => (el: HTMLDivElement | null) => {
    rowRefs.current[i] = el
  }, [])

  function goStep(dir: 1 | -1) {
    const current = Math.round(offsetRef.current / ROW_HEIGHT)
    snapTargetRef.current = (current + dir) * ROW_HEIGHT
    velocityRef.current = 0
    fireClick(0.5)
  }
  function togglePlay() {
    setIsPlaying((p) => !p)
  }
  function handlePlayerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault()
      goStep(1)
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault()
      goStep(-1)
    } else if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
      e.preventDefault()
      togglePlay()
    }
  }

  const activeTrack = tracks[activeIndex]

  if (isCoarsePointer) {
    return (
      <div
        className={`mh-focusable${className ? ` ${className}` : ""}`}
        onKeyDown={handlePlayerKeyDown}
        tabIndex={0}
        role="application"
        aria-label={`Music player. Currently showing ${activeTrack.title} by ${activeTrack.artist}. Use up and down arrow keys to change track, space to play or pause.`}
        style={{
          position: "fixed",
          inset: 0,
          height: "100dvh",
          width: "100vw",
          background: bgVar,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          ...style,
        }}
      >
        <style>{`.mh-focusable:focus-visible { outline: 3px solid ${CYAN}; outline-offset: -3px; }`}</style>
        <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
          {announcement}
        </span>
        <div style={{ position: "relative", width: "100%", height: "100%", background: bgVar, overflow: "hidden" }}>
          {theme === "video" ? (
            <>
              <SeamlessLoopVideo src={videoSrc} muted={!videoSoundOn} volume={videoVolume} playing={isPlaying} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,3,10,0.25) 0%, rgba(0,3,10,0) 22%, rgba(0,3,10,0.4) 55%, rgba(0,3,10,0.88) 100%)",
                }}
              />
            </>
          ) : (
            <MinimalBackdrop />
          )}
          <div
            style={{
              position: "absolute",
              top: "clamp(14px, 4vh, 26px)",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "0 16px",
            }}
          >
            <button
              onClick={() => setTheme((t) => (t === "video" ? "minimal" : "video"))}
              aria-label={theme === "video" ? "Switch to minimal theme" : "Switch to video theme"}
              style={{
                background: "rgba(10,14,26,0.55)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${fgMutedVar(0.35)}`,
                borderRadius: 999,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: fgMutedVar(0.75),
                cursor: "pointer",
                marginBottom: 4,
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9c-2.5 0-4.7-1-6.3-2.7M3 12a9 9 0 0 1 9-9c2.5 0 4.7 1 6.3 2.7M3 8v4h4M21 16v-4h-4" />
              </svg>
            </button>
            <span
              style={{
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: "clamp(17px, 5.4vw, 24px)",
                lineHeight: 1.15,
                color: "#fff",
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              }}
            >
              {title}
            </span>
            {signature && (
              <a
                href={signature.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  color: fgMutedVar(0.5),
                  textDecoration: "none",
                }}
              >
                {signature.name}
              </a>
            )}
          </div>

          <MobileTrackList
            listViewportRef={listViewportRef}
            rowRefs={rowRefs}
            setRowRef={setRowRef}
            tracks={tracks}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
          />

          <PlayerControls
            onPrev={() => goStep(-1)}
            onNext={() => goStep(1)}
            onPlay={togglePlay}
            isPlaying={isPlaying}
            track={activeTrack}
            videoSoundOn={videoSoundOn}
            onToggleVideoSound={() => setVideoSoundOn((s) => !s)}
            videoVolume={videoVolume}
            onVideoVolumeChange={setVideoVolume}
            showVideoControls={theme === "video"}
            compact
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        height: fullBleed ? "100dvh" : undefined,
        width: "100%",
        background: bgVar,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 3vw, 48px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <style>{`
        @keyframes mh-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @keyframes mh-drift {
          0%, 100% { transform: translate(0,0) scale(1.06); }
          50%      { transform: translate(1.5%, -1%) scale(1.1); }
        }
        @keyframes mh-eq1 { 0%,100% { height: 4px; } 50% { height: 14px; } }
        @keyframes mh-eq2 { 0%,100% { height: 13px; } 50% { height: 5px; } }
        @keyframes mh-eq3 { 0%,100% { height: 7px; } 50% { height: 15px; } }
        * { box-sizing: border-box; }
        .mh-focusable:focus-visible {
          outline: 3px solid ${CYAN};
          outline-offset: 3px;
        }
        .mh-list-fade {
          mask-image: linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%);
        }
      `}</style>

      {theme === "video" ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 30% 25%, ${CYAN}44, transparent 55%), radial-gradient(circle at 75% 70%, ${AMBER}33, transparent 55%), #05060a`,
            }}
          />
          <div
            ref={bgRef}
            style={{
              position: "absolute",
              inset: "-6%",
              backgroundImage: `url(${backgroundSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.06)",
              animation: "mh-drift 16s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgba(2,3,10,0.7) 100%)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <MinimalBackdrop />
      )}

      <div
        style={{
          position: "absolute",
          top: "clamp(12px, 2.5vw, 24px)",
          right: "clamp(12px, 2.5vw, 24px)",
          zIndex: 21,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={() => setTheme((t) => (t === "video" ? "minimal" : "video"))}
          aria-label={theme === "video" ? "Switch to minimal theme" : "Switch to video theme"}
          title="Switch theme"
          style={{
            background: "rgba(10,14,26,0.55)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${fgMutedVar(0.35)}`,
            borderRadius: 999,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: fgMutedVar(0.75),
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 1-9 9c-2.5 0-4.7-1-6.3-2.7M3 12a9 9 0 0 1 9-9c2.5 0 4.7 1 6.3 2.7M3 8v4h4M21 16v-4h-4" />
          </svg>
        </button>

        {theme === "video" && (
          <button
            onClick={() => setVideoSoundOn((s) => !s)}
            aria-label={videoSoundOn ? "Mute video ambience" : "Unmute video ambience"}
            title="Video ambience (the scroll click always stays on)"
            style={{
              background: "rgba(10,14,26,0.55)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${CYAN}55`,
              boxShadow: videoSoundOn ? `0 0 14px ${CYAN}44` : "none",
              borderRadius: 999,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: videoSoundOn ? CYAN : fgMutedVar(0.55),
              cursor: "pointer",
              transition: "box-shadow 0.25s ease, color 0.25s ease",
            }}
          >
            {videoSoundOn ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        )}

        <button
          onClick={() => setIsFullscreen((f) => !f)}
          aria-label={isFullscreen ? "Exit wide view" : "Expand to wide view"}
          style={{
            background: "rgba(10,14,26,0.55)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${AMBER}55`,
            boxShadow: isFullscreen ? `0 0 14px ${AMBER}44` : "none",
            borderRadius: 999,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isFullscreen ? AMBER : fgMutedVar(0.55),
            cursor: "pointer",
            transition: "box-shadow 0.25s ease, color 0.25s ease",
          }}
        >
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3v4a1 1 0 0 1-1 1H4M15 3v4a1 1 0 0 0 1 1h4M9 21v-4a1 1 0 0 0-1-1H4M15 21v-4a1 1 0 0 1 1-1h4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" />
            </svg>
          )}
        </button>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(16px, 2.6vh, 28px)",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: "clamp(20px, 3vw, 32px)",
            letterSpacing: "-0.01em",
            color: fgVar,
            textAlign: "center",
            textShadow: "0 4px 30px rgba(0,10,40,0.6)",
            position: effectiveFullscreen ? "fixed" : "static",
            top: effectiveFullscreen ? "clamp(16px, 4vh, 28px)" : undefined,
            left: effectiveFullscreen ? 0 : undefined,
            right: effectiveFullscreen ? 0 : undefined,
            zIndex: effectiveFullscreen ? 20 : undefined,
          }}
        >
          {title}
        </span>
        {signature && (
          <a
            href={signature.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: effectiveFullscreen ? "fixed" : "static",
              top: effectiveFullscreen ? "calc(clamp(16px, 4vh, 28px) + 36px)" : undefined,
              left: effectiveFullscreen ? 0 : undefined,
              right: effectiveFullscreen ? 0 : undefined,
              display: "block",
              textAlign: "center",
              fontFamily: SANS,
              fontSize: 11,
              color: fgMutedVar(0.6),
              textDecoration: "none",
              zIndex: effectiveFullscreen ? 20 : undefined,
              marginTop: effectiveFullscreen ? undefined : -8,
            }}
          >
            {signature.name}
          </a>
        )}

        <div style={{ position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "128%",
              height: "118%",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(ellipse, ${CYAN}55, transparent 68%)`,
              filter: "blur(40px)",
              mixBlendMode: "screen",
              animation: "mh-pulse 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            ref={cardRef}
            onPointerMove={onCardMove}
            onPointerLeave={onCardLeave}
            onKeyDown={handlePlayerKeyDown}
            tabIndex={0}
            role="application"
            aria-label={`Music player. Currently showing ${activeTrack.title} by ${activeTrack.artist}. Use up and down arrow keys to change track, space to play or pause.`}
            className="mh-focusable"
            style={{
              position: effectiveFullscreen ? "fixed" : "relative",
              inset: effectiveFullscreen ? 0 : undefined,
              width: effectiveFullscreen ? "100vw" : "min(58dvh, 460px)",
              height: effectiveFullscreen ? "100dvh" : "min(58dvh, 460px)",
              borderRadius: effectiveFullscreen ? 0 : 30,
              overflow: "hidden",
              background: bgVar,
              boxShadow: effectiveFullscreen ? "none" : `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${CYAN}2b, inset 0 0 60px rgba(0,0,0,0.25)`,
              transformStyle: "preserve-3d",
              perspective: "1700px",
              transform: effectiveFullscreen ? "none" : "rotateY(-13deg) rotateX(5deg)",
              transition: "width 0.5s cubic-bezier(.2,.8,.2,1), height 0.5s cubic-bezier(.2,.8,.2,1), transform 0.5s cubic-bezier(.2,.8,.2,1)",
              zIndex: effectiveFullscreen ? 10 : undefined,
            }}
          >
            <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
              {announcement}
            </span>
            {theme === "video" ? (
              <>
                <div
                  ref={videoWrapRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: bgVar,
                    transformStyle: "preserve-3d",
                    transform: effectiveFullscreen ? "scale(1.45) rotateY(0deg) rotateX(0deg)" : "none",
                    transition: "transform 0.5s cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  <SeamlessLoopVideo src={videoSrc} muted={!videoSoundOn} volume={videoVolume} playing={isPlaying} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,4,14,0.55) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(3,5,14,0.1) 0%, rgba(3,5,14,0) 26%, rgba(3,5,14,0.3) 55%, rgba(3,5,14,0.86) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              <MinimalBackdrop />
            )}

            <div
              ref={listViewportRef}
              className="mh-list-fade"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 118,
                height: "48%",
                overflow: "hidden",
                perspective: "1500px",
                perspectiveOrigin: "50% 30%",
                touchAction: "none",
                background: "linear-gradient(180deg, rgba(4,6,14,0) 0%, rgba(4,6,14,0) 55%, rgba(4,6,14,0.35) 100%)",
              }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, top: "30%", height: 0, transformStyle: "preserve-3d" }}>
                {tracks.map((t, i) => (
                  <TrackRow key={t.id} t={t} i={i} isActive={i === activeIndex} isPlaying={isPlaying} setRowRef={setRowRef} />
                ))}
              </div>
            </div>

            <PlayerControls
              onPrev={() => goStep(-1)}
              onNext={() => goStep(1)}
              onPlay={togglePlay}
              isPlaying={isPlaying}
              track={activeTrack}
              videoSoundOn={videoSoundOn}
              onToggleVideoSound={() => setVideoSoundOn((s) => !s)}
              videoVolume={videoVolume}
              onVideoVolumeChange={setVideoVolume}
              showVideoControls={theme === "video"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const CROSSFADE_S = 1
function SeamlessLoopVideo({
  src,
  muted,
  volume,
  playing,
  style,
}: {
  src: string
  muted: boolean
  volume: number
  playing: boolean
  style?: React.CSSProperties
}) {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const activeRef = useRef<"a" | "b">("a")
  const crossfadingRef = useRef(false)
  const [aOpacity, setAOpacity] = useState(1)
  const [bOpacity, setBOpacity] = useState(0)

  useEffect(() => {
    ;[aRef.current, bRef.current].forEach((v) => {
      if (!v) return
      v.muted = muted
      v.volume = volume
    })
  }, [muted, volume])

  useEffect(() => {
    const active = activeRef.current === "a" ? aRef.current : bRef.current
    if (!active) return
    if (playing) active.play().catch(() => {})
    else active.pause()
  }, [playing])

  useEffect(() => {
    const a = aRef.current
    const b = bRef.current
    if (!a || !b) return
    a.play().catch(() => {})
    let rafId = 0
    const tick = () => {
      const active = activeRef.current === "a" ? a : b
      const inactive = activeRef.current === "a" ? b : a
      if (active.duration) {
        const remaining = active.duration - active.currentTime
        if (!crossfadingRef.current && remaining <= CROSSFADE_S) {
          crossfadingRef.current = true
          inactive.currentTime = 0
          inactive.play().catch(() => {})
        }
        if (crossfadingRef.current) {
          const t = Math.min(1, Math.max(0, 1 - remaining / CROSSFADE_S))
          if (activeRef.current === "a") {
            setAOpacity(1 - t)
            setBOpacity(t)
          } else {
            setBOpacity(1 - t)
            setAOpacity(t)
          }
          if (remaining <= 0.03) {
            active.pause()
            crossfadingRef.current = false
            activeRef.current = activeRef.current === "a" ? "b" : "a"
          }
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const base: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
  return (
    <>
      <video ref={aRef} src={src} playsInline preload="auto" style={{ ...base, ...style, opacity: aOpacity }} />
      <video ref={bRef} src={src} playsInline preload="auto" style={{ ...base, ...style, opacity: bOpacity }} />
    </>
  )
}

function MinimalBackdrop() {
  return (
    <div style={{ position: "absolute", inset: 0, background: bgVar, overflow: "hidden" }}>
      <style>{`
        @keyframes mh-geo-drift-a {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50%      { transform: translate(6%, 5%) scale(1.12); }
        }
        @keyframes mh-geo-drift-b {
          0%, 100% { transform: translate(0%, 0%) scale(1.05); }
          50%      { transform: translate(-7%, -4%) scale(0.95); }
        }
        @keyframes mh-geo-spin-cw {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes mh-geo-spin-ccw {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes mh-geo-float-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50%      { transform: translate(-14px, 18px); opacity: 0.9; }
        }
        @keyframes mh-geo-float-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50%      { transform: translate(16px, -12px); opacity: 0.8; }
        }
        @keyframes mh-geo-float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.45; }
          50%      { transform: translate(10px, 14px) rotate(40deg); opacity: 0.85; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          width: "56%",
          height: "56%",
          left: "-12%",
          top: "-14%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}38, transparent 72%)`,
          filter: "blur(50px)",
          animation: "mh-geo-drift-a 14s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "48%",
          height: "48%",
          right: "-10%",
          bottom: "-12%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AMBER}30, transparent 72%)`,
          filter: "blur(55px)",
          animation: "mh-geo-drift-b 18s ease-in-out infinite 1s",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "62%",
          aspectRatio: "1 / 1",
          left: "50%",
          top: "48%",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.09)",
          borderTopColor: `${CYAN}44`,
          animation: "mh-geo-spin-cw 40s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "38%",
          aspectRatio: "1 / 1",
          left: "50%",
          top: "48%",
          borderRadius: "50%",
          border: `1px solid ${CYAN}22`,
          borderBottomColor: `${AMBER}44`,
          animation: "mh-geo-spin-ccw 28s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 46,
          height: 46,
          left: "22%",
          top: "68%",
          borderRadius: "50%",
          border: `1.5px solid ${AMBER}55`,
          animation: "mh-geo-float-1 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 14,
          height: 14,
          left: "78%",
          top: "24%",
          borderRadius: "50%",
          background: `${CYAN}66`,
          filter: "blur(1px)",
          animation: "mh-geo-float-2 6.5s ease-in-out infinite 0.4s",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 26,
          height: 26,
          left: "68%",
          top: "78%",
          borderRadius: "50%",
          border: `1.5px solid ${CYAN}44`,
          animation: "mh-geo-float-3 9.5s ease-in-out infinite 0.8s",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 8,
          height: 8,
          left: "12%",
          top: "30%",
          borderRadius: "50%",
          background: `${AMBER}77`,
          animation: "mh-geo-float-2 7.5s ease-in-out infinite 1.2s",
        }}
      />
    </div>
  )
}

function TrackRow({
  t,
  i,
  isActive,
  isPlaying,
  setRowRef,
}: {
  t: Track
  i: number
  isActive: boolean
  isPlaying: boolean
  setRowRef: (i: number) => (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={setRowRef(i)}
      style={{
        position: "absolute",
        left: "6%",
        right: "6%",
        top: -ROW_HEIGHT / 2,
        height: ROW_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 10px",
        borderRadius: 14,
        background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
        backdropFilter: isActive ? "blur(14px)" : "none",
        WebkitBackdropFilter: isActive ? "blur(14px)" : "none",
        boxShadow: isActive ? `inset 0 0 0 1px ${t.colorA}55, 0 0 26px ${t.colorA}33` : "none",
        transformOrigin: "center center",
        willChange: "transform, opacity",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 40,
          height: 40,
          borderRadius: 9,
          flexShrink: 0,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${t.colorA}, ${t.colorB})`,
          boxShadow: isActive ? `0 0 20px ${t.colorA}55, 0 2px 6px rgba(0,0,0,0.4)` : "0 2px 8px rgba(0,0,0,0.55)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)" }} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: isActive ? 700 : 500,
            fontSize: isActive ? 15 : 13,
            color: isActive ? fgVar : fgMutedVar(0.68),
            textShadow: isActive ? "0 2px 12px rgba(0,0,0,0.5)" : "0 1px 6px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {t.title}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11.5,
            color: isActive ? fgMutedVar(0.7) : fgMutedVar(0.4),
            textShadow: "0 1px 6px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {t.artist}
        </div>
      </div>
      {isActive && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 15, flexShrink: 0 }}>
          <span style={{ width: 3, borderRadius: 2, background: t.colorA, animation: isPlaying ? "mh-eq1 0.9s ease-in-out infinite" : "none", height: isPlaying ? undefined : 4 }} />
          <span style={{ width: 3, borderRadius: 2, background: t.colorA, animation: isPlaying ? "mh-eq2 0.75s ease-in-out infinite" : "none", height: isPlaying ? undefined : 4 }} />
          <span style={{ width: 3, borderRadius: 2, background: t.colorA, animation: isPlaying ? "mh-eq3 1.05s ease-in-out infinite" : "none", height: isPlaying ? undefined : 4 }} />
        </div>
      )}
    </div>
  )
}

function MobileTrackList({
  listViewportRef,
  rowRefs,
  setRowRef,
  tracks,
  activeIndex,
  isPlaying,
}: {
  listViewportRef: React.RefObject<HTMLDivElement | null>
  rowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  setRowRef: (i: number) => (el: HTMLDivElement | null) => void
  tracks: Track[]
  activeIndex: number
  isPlaying: boolean
}) {
  return (
    <div
      ref={listViewportRef}
      className="mh-list-fade"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 128,
        height: "34%",
        overflow: "hidden",
        perspective: "1200px",
        perspectiveOrigin: "50% 30%",
        touchAction: "none",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: "30%", height: 0, transformStyle: "preserve-3d" }}>
        {tracks.map((t, i) => (
          <TrackRow key={t.id} t={t} i={i} isActive={i === activeIndex} isPlaying={isPlaying} setRowRef={setRowRef} />
        ))}
      </div>
    </div>
  )
}

function PlayerControls({
  onPrev,
  onNext,
  onPlay,
  isPlaying,
  track,
  videoSoundOn,
  onToggleVideoSound,
  videoVolume,
  onVideoVolumeChange,
  showVideoControls = true,
  compact,
}: {
  onPrev: () => void
  onNext: () => void
  onPlay: () => void
  isPlaying: boolean
  track: Track
  videoSoundOn: boolean
  onToggleVideoSound: () => void
  videoVolume: number
  onVideoVolumeChange: (v: number) => void
  showVideoControls?: boolean
  compact?: boolean
}) {
  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    color: fgMutedVar(0.65),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 6,
  }
  return (
    <div
      style={{
        position: "absolute",
        left: compact ? 10 : 14,
        right: compact ? 10 : 14,
        bottom: compact ? 12 : 14,
        zIndex: 4,
        borderRadius: 16,
        background: cardVar(0.55),
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        boxShadow: `inset 0 0 0 1px ${CYAN}2a`,
        padding: compact ? "8px 12px 10px" : "10px 16px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: compact ? 34 : 44,
            height: compact ? 34 : 44,
            borderRadius: 8,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${track.colorA}, ${track.colorB})`,
            boxShadow: `0 0 16px ${track.colorA}55`,
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: compact ? 12.5 : 13.5, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {track.title}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: fgMutedVar(0.55), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {track.artist}
          </div>
        </div>
        <button aria-label="Shuffle" style={iconBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
        </button>
        <button onClick={onPrev} aria-label="Previous track" style={iconBtn}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zM20 6 10 12l10 6z" />
          </svg>
        </button>
        <button
          onClick={onPlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{ ...iconBtn, width: compact ? 38 : 44, height: compact ? 38 : 44, borderRadius: 999, background: track.colorA, boxShadow: `0 0 18px ${track.colorA}66` }}
        >
          {isPlaying ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#05060a">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#05060a">
              <path d="M7 5v14l12-7z" />
            </svg>
          )}
        </button>
        <button onClick={onNext} aria-label="Next track" style={iconBtn}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6h2v12h-2zM4 6l10 6-10 6z" />
          </svg>
        </button>
        <button aria-label="Repeat" style={iconBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>

      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <style>{`
          @keyframes mh-progress { 0% { width: 0%; } 100% { width: 100%; } }
          .mh-vol-slider {
            -webkit-appearance: none;
            appearance: none;
            width: ${compact ? 46 : 60}px;
            height: 3px;
            border-radius: 2px;
            background: rgba(255,255,255,0.18);
            outline: none;
          }
          .mh-vol-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: ${CYAN};
            box-shadow: 0 0 6px ${CYAN}aa;
            cursor: pointer;
          }
          .mh-vol-slider::-moz-range-thumb {
            width: 11px;
            height: 11px;
            border: none;
            border-radius: 50%;
            background: ${CYAN};
            box-shadow: 0 0 6px ${CYAN}aa;
            cursor: pointer;
          }
        `}</style>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
          <div
            key={track.id}
            style={{ height: "100%", background: track.colorA, animation: isPlaying ? "mh-progress 28s linear infinite" : "none", width: isPlaying ? undefined : "22%" }}
          />
        </div>
        {showVideoControls && (
          <>
            <button
              onClick={onToggleVideoSound}
              aria-label={videoSoundOn ? "Mute video ambience" : "Unmute video ambience"}
              style={{ background: "none", border: "none", padding: 2, display: "flex", cursor: "pointer", color: videoSoundOn ? CYAN : fgMutedVar(0.5) }}
            >
              {videoSoundOn ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <line x1="21" y1="9" x2="16" y2="14" />
                  <line x1="16" y1="9" x2="21" y2="14" />
                </svg>
              )}
            </button>
            <input
              className="mh-vol-slider"
              type="range"
              min={0}
              max={MAX_VIDEO_VOLUME}
              step={0.01}
              value={videoVolume}
              onChange={(e) => onVideoVolumeChange(Number(e.target.value))}
              aria-label="Video ambience volume"
            />
          </>
        )}
      </div>
    </div>
  )
}
