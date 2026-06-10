// src/components/landing/HeroSection/index.tsx
import GridMotion from './GridMotion'
import HeroContent from './HeroContent'

// Education-themed image grid — replace with real EduLearn assets later
const GRID_ITEMS = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80', // graduation
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', // study desk
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80', // laptop learning
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', // books
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80', // classroom
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80', // writing
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80', // notes
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', // coffee + study
  'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&q=80', // online learning
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80', // whiteboard
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80', // stack of books
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80', // study group
  'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80', // digital learning
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', // lecture
  'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400&q=80', // coding
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80', // technology
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80', // team work
  'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80', // mentor
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80', // collaboration
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80', // pen + paper
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', // portrait study
  'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400&q=80', // tablet learning
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=80', // research
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&q=80', // math
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80', // library
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80', // writing
  'https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=400&q=80', // globe education
  'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80', // tech education
]

export default function HeroSection() {
  return (
    // Position relative — GridMotion fills this, content layers on top
    <section className="relative h-screen w-full">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <GridMotion items={GRID_ITEMS} gradientColor="#002D3D" />
      </div>

      {/* Content layer — centered over the grid */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <HeroContent />
      </div>
    </section>
  )
}