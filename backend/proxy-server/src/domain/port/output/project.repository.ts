export interface ProjectRepository {
    findIpByDomain(domain: string): Promise<string>;
}
