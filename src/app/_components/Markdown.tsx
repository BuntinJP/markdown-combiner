import { MDXRemote } from 'next-mdx-remote/rsc';
import { FileInfo } from '../types';

export const Markdown = async () => {
  const res = await fetch(`${process.env.URL}/api/md-from-github`, {
    cache: 'no-store',
  });
  const source: FileInfo[] = await res.json();

  return (
    <div>
      <div className='flex flex-col divide-y divide-gray-200'>
        {source.map((file) => (
          <div key={file.path}>
            <h1>{file.path}</h1>
            <MDXRemote source={file.content} />
          </div>
        ))}
      </div>
    </div>
  );
};
