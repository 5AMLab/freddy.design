import type { Metadata } from "next";
import { projects } from "@/lib/work";
import WorkIndex from "@/components/v2/WorkIndex";

export const metadata: Metadata = {
  title: "Work — freddy.design",
  description:
    "Selected design work — annual reports, investor decks, brand systems, campaigns and packaging.",
};

export default function WorkPage() {
  return <WorkIndex projects={projects} />;
}
