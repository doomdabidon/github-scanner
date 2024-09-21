import { GraphQLError } from 'graphql';

export const validateToken = (token?: string): void => {
    if (!token) {
        throw new GraphQLError('Forbidden', {
            extensions: {
              code: 'FORBIDDEN',
              http: {
                status: 403,
              },
            },
        });
    }
};
