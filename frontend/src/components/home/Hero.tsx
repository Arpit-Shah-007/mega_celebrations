import { motion } from "framer-motion"
import { MEDIA_BASE_URL } from "@/lib/media"

/** Full-bleed video hero: centered script phrase over the main heading, with a readable paragraph below. */
export function Hero() {
  return (
    <section className="relative flex h-108 items-center overflow-hidden sm:h-148">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${MEDIA_BASE_URL}/media/Home_Banner_Video.mp4`}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-200 select-none px-6 text-center"
      >
        <h1 className="text-[34px] tracking-[0.3px] font-normal leading-[1.2] text-white sm:text-[64px]">
          <strong className="block font-script font-normal text-[30px] sm:text-[57px]">Make Your Event</strong>
          <span>a Mega Celebration</span>
        </h1>
        <p className="mx-auto mt-5.5 max-w-170 text-base font-normal tracking-[0.2px] leading-relaxed text-white sm:text-[20px]">
          Mega Celebrations is New Jersey&apos;s glamping, picnic and sleepover specialists. Transform your event into an
          luxury, extraordinary experience. We take the stress and hassle out of planning your Pinterest worthy event.
        </p>
      </motion.div>
    </section>
  )
}
