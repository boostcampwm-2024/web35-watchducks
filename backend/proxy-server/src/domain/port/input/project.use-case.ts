export interface ProjectUseCase {
    resolveTargetUrl(host: string, url: string, protocol: string): Promise<string>;
}
