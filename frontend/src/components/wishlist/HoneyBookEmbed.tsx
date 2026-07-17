import { useEffect } from "react"

const HONEYBOOK_PLACEMENT_ID = "5de351586567280cf9f3b1e7"
const HONEYBOOK_SCRIPT_SRC =
  "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js"

type HoneyBookWindow = typeof window & { _HB_?: { pid?: string } }

/**
 * HoneyBook's widget script only scans the DOM and mounts its form once, on
 * the script's own load — it does not notice this div reappearing after a
 * client-side route change. FloatingWishlistWidget links here with a plain
 * <a> (full page load) rather than React Router's Link, so this component
 * never needs to remount without a fresh script run.
 */
export function HoneyBookEmbed() {
  useEffect(() => {
    const win = window as HoneyBookWindow
    win._HB_ = win._HB_ || {}
    win._HB_.pid = HONEYBOOK_PLACEMENT_ID

    if (document.querySelector(`script[src="${HONEYBOOK_SCRIPT_SRC}"]`)) return

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.src = HONEYBOOK_SCRIPT_SRC
    document.head.appendChild(script)
  }, [])

  return (
    <div>
      <div className={`hb-p-${HONEYBOOK_PLACEMENT_ID}-1`} />
      <img
        height={1}
        width={1}
        style={{ display: "none" }}
        src={`https://www.honeybook.com/p.png?pid=${HONEYBOOK_PLACEMENT_ID}`}
        alt=""
      />
    </div>
  )
}
