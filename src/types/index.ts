export interface TokenInput {
    token: string;
}

export interface GithubGetInput extends TokenInput {
    endpoint: string
}

export interface GetFileInput extends TokenInput {
    link: string
}

export interface RepositoryDetailInput {
    owner: string;
    name: string;
}

export interface RepositoryDetailWithTokenInput extends TokenInput, RepositoryDetailInput {
}

export interface RepositoryFilesMetaInput extends TokenInput {
    owner: string;
    name: string;
    path?: string; 
}

export interface Responce<T> {
    success: boolean;
    reason?: string;
    data?: T
}

export interface RepositoryListResponce {
    name: string;
    size: number;
    owner: String;
}

export interface RepositoryDetailsResponce {
    name: string;
    size: number;
    owner: String;
    private: boolean;
    numberOfFiles: number;
    ymlFileContent: string | null;
    activeWebhooks: string[];
}

export interface GithubMetaFileInfo {
    name: string;
    path: string;
    type: GithubItemTypes.dir | GithubItemTypes.file | string;
    download_url: string | null;
}

export enum GithubItemTypes {
    file = 'file',
    dir = 'dir'
} 

export interface HooksResponce {
    name: string
} 

export interface GithubRepoMetaInfo {
    numberOfFiles: number;
    ymlFileContent: string | null
}
