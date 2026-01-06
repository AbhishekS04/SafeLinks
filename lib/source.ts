
import { loader } from "fumadocs-core/source";
import * as fmdx from "fumadocs-mdx";
import { docs, meta } from "@/.source/server";

const createMDXSource = (fmdx as any).createMDXSource;

export const source = loader({
    baseUrl: "/docs",
    source: createMDXSource(docs, meta),
});
