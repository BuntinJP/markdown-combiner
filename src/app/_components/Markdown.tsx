import { MDXRemote } from 'next-mdx-remote/rsc';
import { FileInfo } from '../types';
import 'zenn-content-css';
import Link from 'next/link';
import { Card } from './Card';

export const Markdown = async () => {
  const res = await fetch(`${process.env.SITE_URL}/api/md-from-github`, {
    cache: 'no-store',
  });
  const source: FileInfo[] = await res.json();

  return (
    <div className='[overflow-wrap:anywhere]'>
      {/* toc */}
      <Card className='flex flex-col gap-1 my-4'>
        <h2 className='my-2 sm:my-2'>Table of content</h2>
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
      {/* content */}
      <div className='flex flex-col gap-4'>
        {source.map((file, idx) => (
          <Card key={idx} className='znc'>
            <h1 id={file.path}>{file.path}</h1>
            <MDXRemote source={file.content} />
          </Card>
        ))}
      </div>
    </div>
  );
};
