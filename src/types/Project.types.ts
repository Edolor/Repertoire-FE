export type BaseProjectProps = {
    url: string,
    thumbnail: string,
    description: string,
    created: boolean,
    title: string,
    tags?: Array<string>,
    client: string,
    domain: string,
    type: string,
    role: string,
    live_url?: string,
    figma_url?: string,
    github_url?: string
    tools?: Array<string>,
    other_projects?: Array<BaseProjectProps>
}