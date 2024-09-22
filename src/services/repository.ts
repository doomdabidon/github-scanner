import * as githubApi from '../api/github';

import {
  errorResponceWrapper,
  Semaphore,
  transformRepositoryDetails,
  transformRepositoryListItem
} from '../utils';
import {
  Responce,
  RepositoryFilesMetaInput,
  RepositoryDetailWithTokenInput,
  RepositoryDetailsResponce,
  RepositoryListResponce,
  GithubMetaFileInfo,
  GithubItemTypes
} from '../types';

import { FILE_EXTENTION_TO_FOUND } from '../constants';

const semaphore = new Semaphore();

export const getRepositoryDetails = async (input: RepositoryDetailWithTokenInput): Promise<Responce<RepositoryDetailsResponce>> => {
  let reliseLock;
  try {
    const repositorieDetail = await githubApi.getRepositoryDetails(input);

    reliseLock = await semaphore.aquireLock();
    const repositoryFiles = await createRepositoryFloatFilesArray(input);
    reliseLock();

    const ymlFileContent = await getFirstEligibleFileContent(
      { items: repositoryFiles, token: input.token, fileExtension: FILE_EXTENTION_TO_FOUND }
    );
    const webHooks = await githubApi.getActiveWebhooks(input);
    const numberOfFiles = repositoryFiles.length;
    const data = transformRepositoryDetails({ details: repositorieDetail, file: ymlFileContent, numberOfFiles, webHooks });

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
   const projectedData = repositoriesList.map((repo) => transformRepositoryListItem(repo))

   return {
     success: true,
     data: projectedData,
   }
 } catch (error) {
   return errorResponceWrapper(error as Error);
 }
}

const createRepositoryFloatFilesArray = async (requestParams: RepositoryFilesMetaInput): Promise<GithubMetaFileInfo[]> => {
  const repositoryArray: GithubMetaFileInfo[] = [];
  const repositoryFilesMeta = await githubApi.getRepositoryFilesMeta(requestParams);

  if (repositoryFilesMeta.length === 0) {
    return [];
  }

  for (const item of repositoryFilesMeta) {
    if (item.type === GithubItemTypes.file) {
      repositoryArray.push(item);
    } else if (item.type === GithubItemTypes.dir) {
      const internalScanResponce = await createRepositoryFloatFilesArray({ ...requestParams, path: item.path });
      repositoryArray.push(...internalScanResponce);
    }
  }

  return repositoryArray;
}

const getFirstEligibleFileContent = async ({items, token, fileExtension}: { items: GithubMetaFileInfo[]; fileExtension: string; token: string }): Promise<string | null> => {
  const targetFile = items.find((item) => isFileHasEligibleExtansion(item, fileExtension));
  if (!targetFile) {
    return null;
  }

  const fileContent = await githubApi.getRepositoryFile({ token, link: targetFile.download_url! });

  return JSON.stringify(fileContent);
};

const isFileHasEligibleExtansion = (item: GithubMetaFileInfo, fileExtension: string) => {
  return item.name.endsWith(fileExtension) && item.type === GithubItemTypes.file && item.download_url;
}
