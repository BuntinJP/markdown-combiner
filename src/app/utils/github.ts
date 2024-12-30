// src/app/utils/github.ts

import { Octokit } from '@octokit/rest';
import type { CloudImageInfoWithCalculatedUrl } from '../types';

const client = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const getData = async (): Promise<CloudImageInfoWithCalculatedUrl[]> => {
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER as string;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO as string;
  const path = 'image-data.json';
  const files: CloudImageInfoWithCalculatedUrl[] = [];
  const content = await client.rest.repos.getContent({ owner, repo, path });
  const data = content.data;
  if (!('content' in data && data.content)) {
    return [];
  }
  const infos: CloudImageInfoWithCalculatedUrl[] = JSON.parse(
    Buffer.from(data.content, 'base64').toString(),
  );
  return infos;
};
