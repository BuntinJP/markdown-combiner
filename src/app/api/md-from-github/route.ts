import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { FileInfo } from '@/app/types';

export const GET = async () => {
  const client = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const getFileContent = async (path: string): Promise<string | undefined> => {
    const response = await client.repos.getContent({
      owner: process.env.GITHUB_OWNER as string,
      repo: process.env.GITHUB_REPO as string,
      path,
    });
    const entry = response.data;

    if (Array.isArray(entry)) {
      const buffers = entry.map((c) => {
        if (c.content) {
          return Buffer.from(c.content, 'base64');
        } else {
          return Buffer.alloc(0);
        }
      });
      return Buffer.concat(buffers).toString();
    } else if (typeof entry === 'object' && 'content' in entry && entry.content) {
      return Buffer.from(entry.content, 'base64').toString();
    }

    return undefined;
  };

  const getFiles = async (path: string) => {
    const files: FileInfo[] = [];
    const response = await client.rest.repos.getContent({
      owner: process.env.GITHUB_OWNER as string,
      repo: process.env.GITHUB_REPO as string,
      path,
    });
    const entries = response.data;
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.type === 'file' && entry.name.endsWith('.md')) {
          if (entry.name === 'template.md') continue;
          files.push({ path: entry.path, content: (await getFileContent(entry.path)) ?? '' });
        } else if (entry.type === 'dir') {
          files.push(...(await getFiles(`${path}/${entry.name}`)));
        }
      }
    }
    return files;
  };

  try {
    const files = (await getFiles(process.env.GITHUB_PATH as string)).map((file) => {
      return {
        path: file.path.replace((process.env.GITHUB_PATH as string) + '/', ''),
        content: file.content,
      };
    });
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.error();
  }
};