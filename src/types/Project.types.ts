export type BaseProjectProps = {
  url: string;
  thumbnail: string;
  description: string;
  // API types this `boolean` but the value is an ISO date string. Fixed here.
  created: string;
  title: string;
  tags?: Array<string>;
  client: string;
  domain: string;
  type: string;
  role: string;
  live_url?: string;
  figma_url?: string;
  github_url?: string;
  tools?: Array<string>;
  images?: Array<string>;
  other_projects?: Array<BaseProjectProps>;
};
