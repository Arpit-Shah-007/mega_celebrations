import { useState, useEffect } from "react"
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { primaryNav } from "@/data/nav"
import { Button } from "@/components/ui/Button"
import logo from "@/assets/brand/mega-celebrations-logo.png"

const PACKAGES_DROPDOWN = [
  { label: "Full Service Packages", to: "/packages/full-services-packages" },
  { label: "A La Carte", to: "/packages/a-la-carte" },
  { label: "Add-Ons", to: "/packages/add-ons" },
]

const NAV_LINK_BASE = "group relative py-2 text-[16px] font-semibold text-ui-gray transition-colors"

/**
 * Blue line above each nav item. Grows from the center outward on hover; for
 * the current page it's shown fully expanded at rest, matching the client's
 * request that the active-page indicator look like the hover state, not a
 * bottom-border underline.
 */
function TopHoverLine({ isActive = false }: { isActive?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-center bg-blue transition-transform duration-300 ease-out ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [packagesOpen, setPackagesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ease-out ${
        scrolled ? "shadow-[0_4px_16px_-4px_rgba(2,40,67,0.18)]" : "shadow-none"
      }`}
    >
      <div
        className={`mx-auto flex max-w-300 items-center justify-between px-5 transition-[padding] duration-300 ease-out sm:px-8 lg:px-15 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Mega Celebrations"
            className={`w-auto transition-[height] duration-300 ease-out ${scrolled ? "h-16" : "h-20"}`}
            width={261}
            height={98}
          />
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {primaryNav.map((link) =>
              link.label === "Packages" ? (
                <div
                  key={link.to}
                  className="group relative"
                  onMouseEnter={() => setPackagesOpen(true)}
                  onMouseLeave={() => setPackagesOpen(false)}
                >
                  <RouterNavLink to={link.to} className={NAV_LINK_BASE}>
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <TopHoverLine isActive={isActive} />
                      </>
                    )}
                  </RouterNavLink>
                  {packagesOpen ? (
                    <div className="absolute left-1/2 top-full w-56 -translate-x-1/2 bg-blue py-2 shadow-lift">
                      {PACKAGES_DROPDOWN.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <RouterNavLink key={link.to} to={link.to} className={NAV_LINK_BASE}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <TopHoverLine isActive={isActive} />
                    </>
                  )}
                </RouterNavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button kind="link" to="/plan-a-party" className="font-semibold!" size="md">
                Plan A Party
              </Button>
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-navy lg:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-border bg-white px-5 py-4 lg:hidden">
          {primaryNav.map((link) => (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `py-3 text-base font-semibold ${isActive ? "text-blue" : "text-ui-gray"}`}
            >
              {link.label}
            </RouterNavLink>
          ))}
          {PACKAGES_DROPDOWN.map((item) => (
            <RouterNavLink key={item.to} to={item.to} className="py-2 pl-4 text-sm font-semibold text-ui-gray">
              {item.label}
            </RouterNavLink>
          ))}
          <Link to="/plan-a-party" className="mt-2 bg-pink px-6 py-3 text-center font-bold uppercase text-white">
            Plan A Party
          </Link>
        </nav>
      ) : null}
    </header>
  )
}
