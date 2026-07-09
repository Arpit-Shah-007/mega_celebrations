import { Link } from "react-router-dom"
import { footerNav, businessInfo } from "@/data/nav"
import { Container } from "@/components/ui/Container"
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons"
import { PlaceholderPhoto } from "@/components/ui/PlaceholderPhoto"
import logo from "@/assets/brand/mega-celebrations-logo.png"

const INSTAGRAM_PREVIEW_PHOTOS = [
  { seed: "ig-preview-1", src: "/media/gallery/red-pink-balloon-columns-6th-birthday.jpg" },
  { seed: "ig-preview-2", src: "/media/gallery/luxury-estate-outdoor-dinner-black-white-florals.jpg" },
  { seed: "ig-preview-3", src: "/media/gallery/mermaid-sleepover-teepees-lavender-teal.jpg" },
  { seed: "ig-preview-4", src: "/media/gallery/spa-party-pink-mirror-stations-relax-sign.jpg" },
]

export function Footer() {
  return (
    <footer className="bg-white" style={{ fontFamily: '"Aptos", "Lato", "Helvetica Neue", Arial, sans-serif' }}>
      <Container className="grid gap-10 border-t border-border py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/">
            <img src={logo} alt="Mega Celebrations" className="h-23.25 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-ui-gray">{businessInfo.serviceArea}</p>
          <p className="mt-5 text-sm text-ui-gray">
            Text {businessInfo.phone} or{" "}
            <a href={businessInfo.consultationCallUrl} target="_blank" rel="noreferrer" className="text-blue hover:underline">
              Click Here to Schedule a Consultation Call
            </a>
          </p>
          <p className="mt-5 text-sm">
            <a href={`mailto:${businessInfo.email}`} className="text-blue hover:underline">
              {businessInfo.email}
            </a>
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={businessInfo.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Mega Celebrations on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pink text-white transition hover:bg-pink-dark"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={businessInfo.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Mega Celebrations on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pink text-white transition hover:bg-pink-dark"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[19px] font-extrabold uppercase tracking-wide text-navy">Quick Links</h3>
          <ul className="mt-4">
            {footerNav.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="inline-block text-sm text-ui-gray transition hover:text-blue">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[19px] font-extrabold uppercase tracking-wide text-navy">Our Sister Company</h3>
          <p className="mt-4 text-sm leading-relaxed text-ui-gray">{businessInfo.sisterCompany.blurb}</p>
          <a
            href={businessInfo.sisterCompany.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-pink hover:underline"
          >
            Visit Website &rarr;
          </a>
        </div>

        <div>
          <h3 className="text-[19px] font-extrabold uppercase tracking-wide text-navy">From Instagram</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
            {INSTAGRAM_PREVIEW_PHOTOS.map((photo) => (
              <a
                key={photo.seed}
                href={businessInfo.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="View Mega Celebrations on Instagram"
              >
                <PlaceholderPhoto
                  seed={photo.seed}
                  src={photo.src}
                  alt="Recent Mega Celebrations Instagram post"
                  className="h-28 w-28 transition-opacity hover:opacity-80"
                />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-border py-5">
        <Container>
          <p className="text-center text-sm leading-relaxed text-ui-gray">
            Copyright &copy; 2026 - Mega Celebrations. All Rights Reserved. Website Design by CodeWithAppy.
          </p>
        </Container>
      </div>
    </footer>
  )
}
