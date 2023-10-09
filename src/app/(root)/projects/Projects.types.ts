import { BaseProjectProps } from "@/types/Project.types";

export type ServerResponse = {
    count: number
    next: string | null
    previous: string | null
    results: BaseProjectProps[]
}