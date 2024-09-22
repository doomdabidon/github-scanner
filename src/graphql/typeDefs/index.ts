export const typeDefs = `#graphql
  type RepositoryType {
    name: String
    size: Int
    owner: String
  }

  type RepositoryDetailType {
    name: String
    size: Int
    owner: String
    private: Boolean
    numberOfFiles: Int
    ymlFileContent: String
    activeWebhooks: [String!]
  
  }

  type RepositoryResponce {
    success: Boolean!
    reason: String
    data: [RepositoryType!]
  }

  type RepositoryDetailsResponce {
    success: Boolean!
    reason: String
    data: RepositoryDetailType
  }

  input RepositoryDetailsInput {
    name: String!
    owner: String!
  }

  type Query {
    RepositoryList: RepositoryResponce!
    RepositoryDetails(input: RepositoryDetailsInput!): RepositoryDetailsResponce!
  }
`;