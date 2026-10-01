import { EventMarquee } from "@/components/event-marquee";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Layouts } from "@/components/layouts";
import { Privacy } from "@/components/privacy";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <EventMarquee />
        <HowItWorks />
        <Layouts />
        <Features />
        <Privacy />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}