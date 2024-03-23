'use client';

import { useEffect, useState } from 'react';
import markdownHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import Link from 'next/link';
import { Card } from './Card';
import { FileInfo } from '../types';

export const Markdown = () => {
  const [source, setSource] = useState<FileInfo[] | undefined>(undefined);
  useEffect(() => {
    const fetchSource = async () => {
      try {
        const res = await fetch('/api/md-from-github', { cache: 'no-store' });
        setSource((await res.json()) as FileInfo[]);
      } catch (e: any) {
        setSource([{ path: 'Error', content: e.message }]);
        console.error(e);
      }
    };
    fetchSource();
  }, []);

  if (!source) {
    return <h1 className='text-center'>Loading...</h1>;
  }

  return (
    <div className='[overflow-wrap:anywhere]'>
      {/* toc */}
      {source[0].path !== 'Error' && (
        <Card className='flex flex-col gap-1 mx-2 sm:mx-0 my-4 rounded-lg shadow-sm'>
          <h2 className='my-2 sm:my-2'>Table of contents</h2>
          <ul className='m-0'>
            {source.map((file, idx) => (
              <li key={idx}>
                <Link
                  href={`#${file.path}`}
                  className='text-lg sm:text-2xl text-blue-600 hover:text-blue-400 no-underline hover:underline'
                >
                  {file.path}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {/* content */}
      {source[0].path === 'Error' ? (
        <div className='flex flex-col gap-4'>
          {source.map((file, idx) => {
            const html = markdownHtml('```\n' + file.content + '\n```');
            return (
              <Card key={idx} className='znc'>
                <h1 id={file.path}>{file.path}</h1>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </Card>
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {source.map((file, idx) => {
            const html = markdownHtml(file.content);
            return (
              <Card key={idx} className='znc'>
                <h1 id={file.path}>{file.path}</h1>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
