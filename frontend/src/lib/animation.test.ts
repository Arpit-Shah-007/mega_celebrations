import { describe, expect, it } from "vitest"
import { revealVariants, revealViewport } from "./animation"

const DIRECTIONS = ["fade-in", "pop-up", "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left"] as const

describe("revealVariants", () => {
  it("defines exactly the six expected direction keys", () => {
    expect(Object.keys(revealVariants).sort()).toEqual([...DIRECTIONS].sort())
  })

  it.each(DIRECTIONS)("'%s' has hidden and visible states", (direction) => {
    const variant = revealVariants[direction]
    expect(variant.hidden).toBeDefined()
    expect(variant.visible).toBeDefined()
  })

  it.each(DIRECTIONS)("'%s' visible state is fully opaque with a transition", (direction) => {
    const visible = revealVariants[direction].visible as { opacity: number; transition?: unknown }
    expect(visible.opacity).toBe(1)
    expect(visible.transition).toBeDefined()
  })

  it.each(DIRECTIONS)("'%s' hidden state starts less opaque than visible", (direction) => {
    const hidden = revealVariants[direction].hidden as { opacity: number }
    expect(hidden.opacity).toBeLessThan(1)
  })
})

describe("revealViewport", () => {
  it("triggers only once with a negative bottom margin", () => {
    expect(revealViewport.once).toBe(true)
    expect(revealViewport.margin).toBe("0px 0px -80px 0px")
  })
})
