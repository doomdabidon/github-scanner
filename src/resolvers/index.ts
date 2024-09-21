import { getRepositoryDetails, getRepositoryList } from '../services/repository';
import { RepositoryDetailInput } from '../types'

export const resolvers = {
  Query: {
    RepositoryList: async (_: any, __: any, { token }: { token?: string }) => {
      return getRepositoryList(token!);
    },
    RepositoryDetails: async (_: any, { input }: { input: RepositoryDetailInput }, { token }: { token?: string }) => {
      return getRepositoryDetails({ token: token!, ...input });
    }
  }
};
