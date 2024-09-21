import {
    RepositoryDetailsResponce,
    RepositoryListResponce,
    HooksResponce
} from '../types';

export const trasformDetailsObject = (
    { details, webHooks, file, numberOfFiles }:
    { details: Record<string, any>; webHooks: HooksResponce[]; file: string | null; numberOfFiles: number }
): RepositoryDetailsResponce => {
    const hooksNames = (webHooks ?? []).map((hook) => hook.name);

    return {
      name: details.name,
      size: details.size,
      owner: details.owner.login,
      private: details.private,
      numberOfFiles,
      ymlFileContent: JSON.stringify(file),
      activeWebhooks: hooksNames,
    };
}

export const trasformListObjects = ({ details }: { details: Record<string, any>; }): RepositoryListResponce => {
    return {
      name: details.name,
      size: details.size,
      owner: details.owner.login,
    };
}