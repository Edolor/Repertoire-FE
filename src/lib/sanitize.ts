import { BaseProjectProps } from "@/types/Project.types";
import { AboutProps } from "@/types/About.types";

// Some image URLs come back as `http://` (mixed content under our HTTPS +
// strict CSP). Rewrite every incoming media URL to https.
export const https = (url?: string): string =>
  typeof url === "string" ? url.replace(/^http:\/\//i, "https://") : "";

export function sanitizeProject(p: BaseProjectProps): BaseProjectProps {
  return {
    ...p,
    thumbnail: https(p.thumbnail),
    images: p.images?.map(https),
    other_projects: p.other_projects?.map(sanitizeProject),
  };
}

export function sanitizeAbout(a: AboutProps): AboutProps {
  const fixBanner = <T extends { banner: string }>(x: T): T => ({
    ...x,
    banner: https(x.banner),
  });
  return {
    experiences: a.experiences ?? [],
    education: a.education ?? [],
    awards: (a.awards ?? []).map(fixBanner),
    certifications: (a.certifications ?? []).map(fixBanner),
  };
}
