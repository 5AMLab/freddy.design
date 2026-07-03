import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/work";
import WorkDetail from "@/components/v2/WorkDetail";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Work — freddy.design" };
  return {
    title: `${project.title} — ${project.client} · freddy.design`,
    description: project.summary,
  };
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return <WorkDetail project={project} next={next} />;
}
