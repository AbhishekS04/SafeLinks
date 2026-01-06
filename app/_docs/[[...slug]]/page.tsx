
import { source } from "@/lib/source";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: { slug?: string[] };
}) {
    const page = source.getPage(params.slug);

    if (!page) notFound();

    const MDX = (page.data as any).default as React.ComponentType<any>;

    return (
        <DocsPage toc={(page.data as any).toc}>
            <DocsBody>
                <h1>{page.data.title}</h1>
                <MDX />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}
