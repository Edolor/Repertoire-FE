import { describe, it, expect } from "vitest";
import { PERSON, EXPERTISE, FAQ } from "@/content/site";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  abs,
  graph,
  breadcrumbNode,
  faqNode,
  profilePageNode,
  articleNode,
  personNode,
  websiteNode,
} from "@/lib/seo";

describe("abs", () => {
  it("defaults to the site origin root", () => {
    expect(abs()).toBe(`${SITE_URL}/`);
    expect(abs("/")).toBe(`${SITE_URL}/`);
  });

  it("prefixes a site-relative path with SITE_URL", () => {
    expect(abs("/writing")).toBe(`${SITE_URL}/writing`);
    expect(abs("/about")).toBe(`${SITE_URL}/about`);
  });

  it("passes through absolute http(s) URLs unchanged", () => {
    expect(abs("http://example.com/x")).toBe("http://example.com/x");
    expect(abs("https://other.test/path")).toBe("https://other.test/path");
  });
});

describe("graph", () => {
  it("wraps nodes in a schema.org @context + @graph document", () => {
    const a = { "@type": "A" };
    const b = { "@type": "B" };
    const doc = graph(a, b);
    expect(doc["@context"]).toBe("https://schema.org");
    expect(doc["@graph"]).toEqual([a, b]);
  });

  it("preserves node identity and order, and supports an empty graph", () => {
    const a = { "@type": "A" };
    expect(graph(a)["@graph"][0]).toBe(a);
    expect(graph()["@graph"]).toEqual([]);
  });
});

describe("breadcrumbNode", () => {
  it("positions entries 1..n with abs item URLs", () => {
    const trail = [
      { name: "Home", path: "/" },
      { name: "Writing", path: "/writing" },
      { name: "Post", path: "/writing/post" },
    ];
    const node = breadcrumbNode(trail);
    expect(node["@type"]).toBe("BreadcrumbList");
    expect(node.itemListElement).toHaveLength(3);
    node.itemListElement.forEach((el, i) => {
      expect(el["@type"]).toBe("ListItem");
      expect(el.position).toBe(i + 1);
      expect(el.name).toBe(trail[i].name);
      expect(el.item).toBe(abs(trail[i].path));
    });
  });

  it("produces an empty list for an empty trail", () => {
    expect(breadcrumbNode([]).itemListElement).toEqual([]);
  });
});

describe("faqNode", () => {
  it("maps every FAQ entry to a Question with an acceptedAnswer", () => {
    const node = faqNode();
    expect(node["@type"]).toBe("FAQPage");
    expect(node["@id"]).toBe(`${SITE_URL}/#faq`);
    expect(node.mainEntity).toHaveLength(FAQ.length);
    node.mainEntity.forEach((q, i) => {
      expect(q["@type"]).toBe("Question");
      expect(q.name).toBe(FAQ[i].q);
      expect(q.acceptedAnswer).toEqual({
        "@type": "Answer",
        text: FAQ[i].a,
      });
    });
  });
});

describe("profilePageNode", () => {
  it("builds a ProfilePage anchored to the path with person/site refs", () => {
    const node = profilePageNode("/about");
    expect(node["@type"]).toBe("ProfilePage");
    expect(node["@id"]).toBe(`${abs("/about")}#profilepage`);
    expect(node.url).toBe(abs("/about"));
    expect(node.name).toBe(`${PERSON.name}: about`);
    expect(node.isPartOf).toEqual({ "@id": `${SITE_URL}/#website` });
    expect(node.about).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(node.mainEntity).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(() => new Date(node.dateModified).toISOString()).not.toThrow();
    expect(node.dateModified).toBe(new Date(node.dateModified).toISOString());
  });
});

describe("articleNode", () => {
  const base = {
    title: "My Title",
    description: "A description.",
    path: "/writing/x",
  };

  it("defaults @type to Article and sets core fields off the path", () => {
    const node = articleNode(base);
    expect(node["@type"]).toBe("Article");
    expect(node.headline).toBe("My Title");
    expect(node.name).toBe("My Title");
    expect(node.description).toBe("A description.");
    expect(node.url).toBe(abs("/writing/x"));
    expect(node.mainEntityOfPage).toBe(abs("/writing/x"));
    expect(node.image).toBe(abs("/writing/x/opengraph-image"));
    expect(node.inLanguage).toBe("en");
    expect(node.author).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(node.publisher).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(node.isPartOf).toEqual({ "@id": `${SITE_URL}/#website` });
  });

  it("honors an explicit type override", () => {
    expect(articleNode({ ...base, type: "TechArticle" })["@type"]).toBe(
      "TechArticle",
    );
  });

  it("omits conditional fields when not provided", () => {
    const node = articleNode(base);
    expect(node).not.toHaveProperty("abstract");
    expect(node).not.toHaveProperty("articleSection");
    expect(node).not.toHaveProperty("datePublished");
    expect(node).not.toHaveProperty("dateModified");
    expect(node).not.toHaveProperty("wordCount");
    expect(node).not.toHaveProperty("keywords");
  });

  it("includes conditional fields when provided", () => {
    const node = articleNode({
      ...base,
      section: "Engineering",
      abstract: "Short abstract.",
      datePublished: "2026-01-01",
      dateModified: "2026-02-01",
      wordCount: 1200,
      keywords: ["mcp", "agents"],
    });
    expect(node.articleSection).toBe("Engineering");
    expect(node.abstract).toBe("Short abstract.");
    expect(node.datePublished).toBe("2026-01-01");
    expect(node.dateModified).toBe("2026-02-01");
    expect(node.wordCount).toBe(1200);
    expect(node.keywords).toBe("mcp, agents");
  });

  it("omits keywords for an empty array, and wordCount for zero (falsy guard)", () => {
    const node = articleNode({ ...base, keywords: [], wordCount: 0 });
    expect(node).not.toHaveProperty("keywords");
    expect(node).not.toHaveProperty("wordCount");
  });
});

describe("personNode", () => {
  it("has a stable @id and the expected identity keys", () => {
    expect(personNode["@type"]).toBe("Person");
    expect(personNode["@id"]).toBe(`${SITE_URL}/#person`);
    expect(personNode.name).toBe(PERSON.name);
    expect(personNode.url).toBe(SITE_URL);
    expect(personNode.image).toBe(abs("/opengraph-image"));
    expect(personNode.jobTitle).toBe(PERSON.role);
    expect(personNode.description).toBe(PERSON.outcome);
    expect(personNode.email).toBe(`mailto:${PERSON.email}`);
    expect(personNode.sameAs).toEqual([
      PERSON.github,
      PERSON.linkedin,
      PERSON.twitter,
    ]);
  });

  it("knowsAbout includes every expertise key plus the curated extras", () => {
    for (const e of EXPERTISE) {
      expect(personNode.knowsAbout).toContain(e.k);
    }
    expect(personNode.knowsAbout).toContain("Model Context Protocol");
    expect(personNode.knowsAbout).toContain("TypeScript");
  });

  it("carries awards and degree credentials", () => {
    expect(personNode.award.length).toBeGreaterThan(0);
    expect(personNode.hasCredential).toHaveLength(2);
    for (const c of personNode.hasCredential) {
      expect(c["@type"]).toBe("EducationalOccupationalCredential");
      expect(c.credentialCategory).toBe("degree");
    }
  });
});

describe("websiteNode", () => {
  it("has a stable @id and references the person as publisher", () => {
    expect(websiteNode["@type"]).toBe("WebSite");
    expect(websiteNode["@id"]).toBe(`${SITE_URL}/#website`);
    expect(websiteNode.url).toBe(SITE_URL);
    expect(websiteNode.name).toBe(SITE_NAME);
    expect(websiteNode.description).toBe(SITE_DESCRIPTION);
    expect(websiteNode.inLanguage).toBe("en");
    expect(websiteNode.publisher).toEqual({ "@id": `${SITE_URL}/#person` });
  });
});
