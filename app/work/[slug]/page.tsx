import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  projects,
  getProject,
  imageSrc,
  PROJECT_TYPE_LABEL,
} from "@/lib/work";
import WorkDetail from "@/components/v2/WorkDetail";
import JsonLd from "@/components/JsonLd";
import { caseStudySchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Work" };

  // The root template appends " — Studio Kavea", so the title here is just
  // the work itself. Client stays in it: "Renminbi Takes Centre Stage" alone
  // says nothing about who it was for.
  const title = `${project.title} — ${project.client}`;

  // Non-commissioned work is labelled in the description too, not just on the
  // page. A search result is the one surface where a concept piece is most
  // likely to be mistaken for a client engagement, because none of the
  // on-page framing travels with it.
  const description =
    project.projectType === "commissioned"
      ? project.summary
      : `${PROJECT_TYPE_LABEL[project.projectType]} concept work. ${project.summary}`;

  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/work/${project.slug}`,
      images: [{ url: imageSrc(project.images[0]) }],
    },
  };
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/* CreativeWork carries NO client/sponsor for non-commissioned work —
          see caseStudySchema. Breadcrumbs: Home → Work → this project. */}
      <JsonLd data={caseStudySchema(project)} />
      <JsonLd data={breadcrumbSchema(project)} />
      <WorkDetail project={project} next={next} />
    </>
  );
}
