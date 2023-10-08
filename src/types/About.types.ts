export type BaseExperienceProps = {
    start_date: string
    end_date?: string
    institution: string
    location: string
    about: string
}

export type BaseHonourProps = {
    banner: string;
    title: string;
    about: string;
    sub_about?: string;
    issue_date?: string;
    certification_no?: string;
}

export type AboutProps = {
    experiences: BaseExperienceProps[]
    awards: BaseHonourProps[]
    education: BaseExperienceProps[]
    certifications: BaseHonourProps[]
}