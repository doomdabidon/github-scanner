import * as githubApi from '../api/github';

import { errorResponceWrapper, Simaphore, trasformDetailsObject, trasformListObjects } from '../utils';
import {
  Responce,
  RepositoryFilesMetaInput,
  RepositoryDetailWithTokenInput,
  RepositoryDetailsResponce,
  RepositoryListResponce,
  GithubMetaFileInfo,
  GithubRepoMetaInfo,
  GithubItemTypes
} from '../types';

import { FILE_EXTENTION_TO_FOUND } from '../constants';

const simaphore = new Simaphore();

export const getRepositoryDetails = async (input: RepositoryDetailWithTokenInput): Promise<Responce<RepositoryDetailsResponce>> => {
  let reliseLock;
  try {
     const repositorieDetail = await githubApi.getRepositoryDetails(input);

     reliseLock = await simaphore.aquireLock();
     const { numberOfFiles, ymlFileContent } = await getRepositoryMetaInfo(input);
     reliseLock();
     const webHooks = await githubApi.getActiveWebhooks(input);
     const data = trasformDetailsObject({ details: repositorieDetail, file: ymlFileContent, numberOfFiles, webHooks });

   return {
     success: true,
     data,
   }
  } catch (error) {
   reliseLock && reliseLock();
   return errorResponceWrapper(error as Error);
  }
}

export const getRepositoryList = async (token: string): Promise<Responce<RepositoryListResponce[]>> => {
 try {
   const repositoriesList = await githubApi.getRepositories({ token });
   const projectedData = repositoriesList.map((repo) => trasformListObjects(repo))

   return {
     success: true,
     data: projectedData,
   }
 } catch (error) {
   return errorResponceWrapper(error as Error);
 }
}

const getRepositoryMetaInfo = async (requestParams: RepositoryFilesMetaInput, isYamlFileFound = false): Promise<GithubRepoMetaInfo> => {
  let numberOfFiles = 0;
  let ymlFileContent = null;

  const repositoryFilesMeta = await githubApi.getRepositoryFilesMeta(requestParams);
  if (repositoryFilesMeta.length === 0) {
    return { numberOfFiles, ymlFileContent };
  }

  for (const item of repositoryFilesMeta) {
    if (item.type === GithubItemTypes.file) {
      numberOfFiles += 1;
      if (isYamlFileFound || !isFileHasTargetExtansion(item, FILE_EXTENTION_TO_FOUND)) {
        continue;
      }

      ymlFileContent = await githubApi.getRepositoryFile({ token: requestParams.token, link: item.download_url! });
      isYamlFileFound = true;
    } else if (item.type === GithubItemTypes.dir) {
      const internalScanResponce = await getRepositoryMetaInfo({ ...requestParams, path: item.path }, isYamlFileFound);

      numberOfFiles += internalScanResponce.numberOfFiles;
      if (isYamlFileFound || !internalScanResponce.ymlFileContent) {
        continue;
      }

      isYamlFileFound = true;
      ymlFileContent = internalScanResponce.ymlFileContent;
    }
  }

  return { numberOfFiles, ymlFileContent };
}

const isFileHasTargetExtansion = (item: GithubMetaFileInfo, fileExtension: string) => {
  return item.name.endsWith(fileExtension) && item.download_url;
}
