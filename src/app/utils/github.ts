// src/app/utils/github.ts

import { Octokit } from '@octokit/rest';
import type { FileInfo } from '../types';

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

// 指定拡張子のファイルを再帰的に取得
const fetchFilesFromGitHub = async (basePath: string, extension: string): Promise<FileInfo[]> => {
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER as string;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO as string;

  const getRemoteFiles = async (path: string): Promise<FileInfo[]> => {
    const files: FileInfo[] = [];
    const response = await client.rest.repos.getContent({ owner, repo, path });
    const entries = response.data;

    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.type === 'file' && entry.name.endsWith(extension)) {
          if (extension === '.md' && entry.name === 'template.md') continue;
          files.push({
            path: entry.path,
            content: (await getFileContent(entry.path)) ?? '',
          });
        } else if (entry.type === 'dir') {
          files.push(...(await getRemoteFiles(`${path}/${entry.name}`)));
        }
      }
    }
    return files;
  };

  const allFiles = await getRemoteFiles(basePath);
  // ベースパスを除去
  return allFiles.map((file) => ({
    path: file.path.replace(`${basePath}/`, ''),
    content: file.content,
  }));
};

// Markdownファイル取得
export const getMarkdownFiles = async (): Promise<FileInfo[]> => {
  try {
    const basePath = process.env.NEXT_PUBLIC_GITHUB_DOCS_PATH as string;
    return await fetchFilesFromGitHub(basePath, '.md');
  } catch (error) {
    return [];
  }
};

// HTMLファイル取得
export const getHTMLFiles = async (): Promise<(FileInfo & { url: string })[]> => {
  try {
    const basePath = process.env.NEXT_PUBLIC_GITHUB_HTML_PATH as string;
    const files = await fetchFilesFromGitHub(basePath, '.html');
    return files.map((file) => ({
      ...file,
      url: `https://github.com/BuntinJP/xlog-images/blob/main/${basePath}/${file.path}`,
    }));
  } catch (error) {
    return [];
  }
};
