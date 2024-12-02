export interface ProjectQueryInterface {
    existsByDomain(domain: string): Promise<boolean>;
    getClientIpByDomain(domain:string): Promise<string>;
}
