import { HomeHero } from './hero/HomeHero';
import { CommunityEcosystemSection } from './sections/CommunityEcosystemSection';
import { DeployAgentSection } from './sections/DeployAgentSection';
import { FourPillarsSection } from './sections/FourPillarsSection';
import { LivingWorldSection } from './sections/LivingWorldSection';
import { RoadmapSection } from './sections/RoadmapSection';

export function Home() {
  return (
    <>
      <HomeHero />
      <FourPillarsSection />
      <LivingWorldSection />
      <DeployAgentSection />
      <RoadmapSection />
      <CommunityEcosystemSection />
    </>
  );
}
