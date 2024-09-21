import axios from 'axios';

import * as githubClient from '../clients/github';
import { TokenInput, RepositoryDetailWithTokenInput, GetFileInput, RepositoryFilesMetaInput, GithubMetaFileInfo } from '../types';


export const getRepositories = async ({ token }: TokenInput): Promise<any[]> => {
  const response = await githubClient.get({ token, endpoint: 'user/repos?visibility=all' });
  return response.data;
}

 export const getRepositoryDetails = async ({ owner, name, token }: RepositoryDetailWithTokenInput) => {
   const response = await githubClient.get({ token, endpoint: `repos/${owner}/${name}`});
   return response.data;
}

export const getRepositoryFilesMeta = async ({ owner, name, token, path }: RepositoryFilesMetaInput): Promise<GithubMetaFileInfo[]> => {
  const response = await githubClient.get({ token, endpoint: `repos/${owner}/${name}/contents${path ? `/${path}` : ''}` });
  return response.data;
}

export const getActiveWebhooks = async ({ owner, name, token }: RepositoryDetailWithTokenInput): Promise<any[]> => {
  const response = await githubClient.get({ token, endpoint: `repos/${owner}/${name}/hooks` });
  return response.data;
}

export const getRepositoryFile = async ({ token, link }: GetFileInput): Promise<string | null> => {
  const response = await axios.get(link, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}
