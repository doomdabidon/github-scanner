import axios from 'axios';

import { GITHUB_API_BASE_URL } from '../constants';

export const get = async ({ token, endpoint }: { token: string; endpoint: string }): Promise<any> => {
    try {
      const response = await axios.get(`${GITHUB_API_BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (response.status !== 200) {
        throw new Error(`${endpoint} request has failed`)
      }
  
      return response;
    } catch (error) {
      throw new Error(`${endpoint} request has failed with error: ${(error as Error).message}`)
    }
}
