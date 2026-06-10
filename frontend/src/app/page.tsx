// src/app/page.tsx
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeatureSection'
import EduAIShowcase from '@/components/landing/EduAiShowCase'
import StatsSection from '@/components/landing/StatsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CTASection from '@/components/landing/CTASection'


export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <EduAIShowcase />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      {/* Next sections plug in here */}
    </main>
  )
}