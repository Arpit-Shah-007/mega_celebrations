import { PageHero } from "@/components/ui/PageHero"
import { ChooseAPackageSection } from "@/components/packages/ChooseAPackageSection"

export function PackagesPage() {
  return (
    <>
      <PageHero title="Packages" />
      <ChooseAPackageSection />
    </>
  )
}
