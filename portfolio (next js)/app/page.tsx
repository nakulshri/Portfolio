import Approach from "@/Components/Approach";


import Experience from "@/Components/Experience";
import Footer from "@/Components/Footer";
import Hero from "@/Components/Hero";
import RecentProjects from "@/Components/RecentProjects";
import { FloatingNav } from "@/Components/ui/navbar";
import { navItems } from "@/data";
import dynamic from "next/dynamic";
export default function Home() {
  const Grid = dynamic(() => import("@/Components/Grid"), {
    ssr: false,
  });
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
       
        <Experience />
        <Approach />
        <Footer />
      </div>
    </main>
  );
}