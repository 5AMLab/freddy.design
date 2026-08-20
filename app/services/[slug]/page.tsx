import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService, serviceCaseStudies } from "@/lib/services";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { serviceSchema, serviceBreadcrumbSchema } from "@/lib/schema";
import ServiceDetail from "@/components/v2/ServiceDetail";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Services" };

  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "website",
      title: service.title,
      description: service.metaDescription,
      url: `${SITE_URL}/services/${service.slug}`,
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const cases = serviceCaseStudies(service);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={serviceBreadcrumbSchema(service)} />
      <ServiceDetail service={service} cases={cases} />
    </>
  );
}
