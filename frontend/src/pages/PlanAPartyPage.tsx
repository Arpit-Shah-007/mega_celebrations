import { HowToBookSection } from "@/components/home/HowToBookSection"
import { ChooseAPackageSection } from "@/components/packages/ChooseAPackageSection"

export function PlanAPartyPage() {
  return (
    <>
      <HowToBookSection showFaqsCta={false} />
      <ChooseAPackageSection />
    </>
  )
}
