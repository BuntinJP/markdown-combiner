'use client';

import { getHTMLFiles } from '../utils/github';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import type { FileInfo } from '../types';

import { Card } from './Card';
import { Loading } from './Loading';

export const ImageSamples = () => {
  const [source, setSource] = useState<FileInfo[] | undefined>(undefined);
  useEffect(() => {
    const fetchSource = async () => {
      try {
        const files = await getHTMLFiles();
        console.log('images files');
        console.log(files);
        if (files.length === 0) {
          throw new Error('No markdown files found');
        }
        setSource(files);
      } catch (e: any) {
        setSource([{ path: 'Error', content: e.message }]);
        console.error(e);
      }
    };
    fetchSource();
  }, []);

  if (!source) {
    return (
      <div className='flex item-center justify-center mt-20'>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {source[0].path === 'Error' ? (
        <div className='flex flex-col gap-4 my-4'>
          {source.map((file, idx) => {
            return (
              <Card key={idx} className='znc'>
                <h1 id={file.path}>{file.path}</h1>
                <div dangerouslySetInnerHTML={{ __html: file.content }} />
              </Card>
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col gap-4 my-4'>
          {source.map((file, idx) => {
            return (
              <Card key={idx} className='znc'>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                <div dangerouslySetInnerHTML={{ __html: file.content }} />
                <a href={file.url ?? 'https://www.xlog.systems'}>{file.path}</a>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};
