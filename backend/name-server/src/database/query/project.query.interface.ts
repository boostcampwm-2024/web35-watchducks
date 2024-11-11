export interface ProjectQueryInterface {
    existsByDomain(domain: string): Promise<boolean>;
}
