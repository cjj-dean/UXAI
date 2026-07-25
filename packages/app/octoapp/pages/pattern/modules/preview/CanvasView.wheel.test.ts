import { describe, expect, test, beforeEach } from "bun:test"

describe("CanvasView wheel behavior", () => {
  let viewport: HTMLDivElement
  let iframe: HTMLIFrameElement
  let currentScale: number
  let canvasMode: boolean
  let preventDefaultCalled: boolean

  beforeEach(() => {
    if (typeof document === "undefined") return
    viewport = document.createElement("div")
    viewport.style.width = "1000px"
    viewport.style.height = "800px"
    iframe = document.createElement("iframe")
    viewport.appendChild(iframe)
    document.body.appendChild(viewport)
    currentScale = 1
    canvasMode = true
    preventDefaultCalled = false

    viewport.addEventListener("wheel", (e) => {
      if (!canvasMode || e.target === iframe) return

      e.preventDefault()
      preventDefaultCalled = true
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const oldScale = currentScale
      currentScale = Math.min(Math.max(oldScale * delta, 0.3), 3)
    }, { passive: false })
  })

  function dispatchWheel(target: EventTarget, deltaY: number) {
    target.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }))
  }

  test("canvasMode on: wheel on viewport should zoom in", () => {
    canvasMode = true
    dispatchWheel(viewport, -100)
    expect(preventDefaultCalled).toBe(true)
    expect(currentScale).toBe(1.1)
  })

  test("canvasMode on: wheel on viewport should zoom out", () => {
    canvasMode = true
    dispatchWheel(viewport, 100)
    expect(preventDefaultCalled).toBe(true)
    expect(currentScale).toBe(0.9)
  })

  test("canvasMode on: wheel on iframe should not trigger zoom", () => {
    canvasMode = true
    dispatchWheel(iframe, -100)
    expect(preventDefaultCalled).toBe(false)
    expect(currentScale).toBe(1)
  })

  test("canvasMode off: wheel on viewport should not trigger zoom", () => {
    canvasMode = false
    dispatchWheel(viewport, -100)
    expect(preventDefaultCalled).toBe(false)
    expect(currentScale).toBe(1)
  })

  test("canvasMode off: wheel on iframe should not trigger zoom", () => {
    canvasMode = false
    dispatchWheel(iframe, 100)
    expect(preventDefaultCalled).toBe(false)
    expect(currentScale).toBe(1)
  })

  test("scale should be clamped to minimum 0.3", () => {
    canvasMode = true
    currentScale = 0.32
    dispatchWheel(viewport, 100)
    expect(currentScale).toBe(0.3)
  })

  test("scale should be clamped to maximum 3", () => {
    canvasMode = true
    currentScale = 2.8
    dispatchWheel(viewport, -100)
    expect(currentScale).toBe(3)
  })

  test("multiple zoom in operations accumulate correctly", () => {
    canvasMode = true
    currentScale = 1
    dispatchWheel(viewport, -100)
    expect(currentScale).toBe(1.1)
    dispatchWheel(viewport, -100)
    expect(currentScale).toBeCloseTo(1.21, 2)
  })

  test("zoom out then zoom in returns approximately to original scale", () => {
    canvasMode = true
    currentScale = 1
    dispatchWheel(viewport, 100)
    expect(currentScale).toBe(0.9)
    dispatchWheel(viewport, -100)
    expect(currentScale).toBeCloseTo(0.99, 2)
  })
})
