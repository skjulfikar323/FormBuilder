import { LandingNavbar } from '../components/LandingNavbar.jsx'
import { Hero } from '../components/Hero.jsx'
import { ProductPreview } from '../components/ProductPreview.jsx'
import { ComparisonSection } from '../components/ComparisonSection.jsx'
import { FeatureHighlight } from '../components/FeatureHighlight.jsx'
import { EmbedSection } from '../components/EmbedSection.jsx'
import { PlatformStrip } from '../components/PlatformStrip.jsx'
import { RealTimeResults } from '../components/RealTimeResults.jsx'
import { FeatureGrid } from '../components/FeatureGrid.jsx'
import { LovedBy } from '../components/LovedBy.jsx'
import { FinalCTA } from '../components/FinalCTA.jsx'
import { LandingFooter } from '../components/LandingFooter.jsx'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <LandingNavbar />
      <Hero />
      <ProductPreview />
      <ComparisonSection />
      <FeatureHighlight />
      <EmbedSection />
      <PlatformStrip />
      <RealTimeResults />
      <FeatureGrid />
      <LovedBy />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
