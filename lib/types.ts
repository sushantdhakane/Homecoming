export type Kind = "place" | "artist" | "movie";
export type Match = { name: string; address?: string; tags?: string[]; shared?: string[]; affinity?: number | null; jev?: number | null };
export type Pair = { from: { name: string; kind: Kind; tags?: string[] }; matches: Match[] };
export type Result = { error?: string; mode?: string; pairs: Pair[]; guide?: { intro: string; first_week: string[] } };
export const KIND_LABEL: Record<Kind, string> = { place: "place", artist: "artist", movie: "film" };
