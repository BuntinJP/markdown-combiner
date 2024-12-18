// src/app/utils/github.ts

import { Octokit } from '@octokit/rest';
import type { CloudImageInfoWithCalculatedUrl } from '../types';

const client = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

const getFileContent = async (path: string): Promise<string | undefined> => {
  const response = await client.rest.repos.getContent({
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO ?? '',
    path,
  });
  const entry = response.data;

  if (Array.isArray(entry)) {
    const buffers = entry.map((c) => {
      if ('content' in c && c.content) {
        return Buffer.from(c.content, 'base64');
      }
      return Buffer.alloc(0);
    });
    return Buffer.concat(buffers).toString();
  }
  if ('content' in entry && entry.content) {
    return Buffer.from(entry.content, 'base64').toString();
  }

  return undefined;
};

const fetchFilesFromGitHub = async (
  basePath: string,
  extension: string,
): Promise<CloudImageInfoWithCalculatedUrl[]> => {
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER as string;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO as string;

  const getRemoteFiles = async (path: string): Promise<CloudImageInfoWithCalculatedUrl[]> => {
    const files: CloudImageInfoWithCalculatedUrl[] = [];
    const response = await client.rest.repos.getContent({ owner, repo, path });
    const entries = response.data;

    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.type === 'file' && entry.name.endsWith(extension)) {
          const content = (await getFileContent(entry.path)) ?? '';
          try {
            const jsonData: CloudImageInfoWithCalculatedUrl = JSON.parse(content);
            files.push(jsonData);
          } catch (parseError) {
            console.error(`Error parsing JSON for file ${entry.path}:`, parseError);
          }
        } else if (entry.type === 'dir') {
          files.push(...(await getRemoteFiles(`${path}/${entry.name}`)));
        }
      }
    }
    return files;
  };

  const allFiles = await getRemoteFiles(basePath);
  return allFiles;
};

export const getJsonFiles = async (): Promise<CloudImageInfoWithCalculatedUrl[]> => {
  try {
    const basePath = process.env.NEXT_PUBLIC_GITHUB_DATA_PATH as string; // 例: 'data'
    return await fetchFilesFromGitHub(basePath, '.json');
  } catch (error) {
    console.error('Error fetching JSON files:', error);
    return [];
  }
};
