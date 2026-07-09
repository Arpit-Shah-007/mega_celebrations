import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"
import { PageHero } from "@/components/ui/PageHero"
import { AccordionItem } from "@/components/ui/Accordion"
import { faqs, faqCategories } from "@/data/faqs"
import { revealVariants, revealViewport } from "@/lib/animation"

export function FaqsPage() {
  return (
    <>
      <PageHero variant="navy" title="FAQs" />

      <section
        className="bg-white bg-cover bg-center bg-no-repeat pb-16 pt-8 sm:pb-20 sm:pt-10"
        style={{ backgroundImage: "url(/media/gray-bg-shapes.png)" }}
      >
        <Container>
          <div className="mx-auto max-w-5xl space-y-14">
            {faqCategories.map((category) => {
              const items = faqs.filter((faq) => faq.category === category)
              if (items.length === 0) return null

              return (
                <motion.div
                  key={category}
                  initial="hidden"
                  whileInView="visible"
                  viewport={revealViewport}
                  variants={revealVariants["bottom-to-top"]}
                >
                  <h2 className="text-center text-2xl text-navy">{category}</h2>
                  <div className="mt-6">
                    {items.map((item) => (
                      <AccordionItem key={item.question} question={item.question} answer={item.answer} />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}
