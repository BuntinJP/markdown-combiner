import React from 'react';
import Link from 'next/link';
import { getJsonFiles } from '../utils/github';
import type { CloudImageInfoWithCalculatedUrl } from '../types';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CopyButton from './CopyButton';

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = Number.parseFloat((bytes / k ** i).toFixed(dm));
  return `${size} ${sizes[i]}`;
};

const ImageGallery = async () => {
  let source: CloudImageInfoWithCalculatedUrl[] = [];

  try {
    const files = await getJsonFiles();
    if (files.length === 0) {
      throw new Error('JSONファイルが見つかりません');
    }
    source = files;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error('予期しないエラーが発生しました');
    }
    source = [];
  }

  if (source.length === 0) {
    return;
  }

  return source.length === 0 ? (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-gray-400 text-xl'>利用可能なデータがありません。</p>
    </div>
  ) : (
    <div className='px-4 py-8 max-w-7xl mx-auto'>
      <Card className='mb-8 bg-gray-800 border border-gray-700 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-white text-2xl'>目次</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='m-0 pl-4 list-disc space-y-2'>
            {source.map((file) => (
              <li key={file.publicId}>
                <Link
                  href={`#${file.publicId}`}
                  className='text-base sm:text-lg text-blue-400 hover:text-blue-300 no-underline hover:underline transition-colors duration-200 break-words'
                >
                  {file.publicId}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {source.map((file) => {
          const copyText = `![${file.publicId}](${file.calculatedUrl})`;

          return (
            <Card
              key={file.publicId}
              id={file.publicId}
              className='bg-gray-800 border border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300'
            >
              <CardHeader className='p-4'>
                <CardTitle className='break-all text-white text-lg font-semibold'>
                  {file.publicId}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='w-full h-48 overflow-hidden rounded-lg mb-4'>
                  <img
                    src={file.calculatedUrl}
                    alt={file.publicId}
                    className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-300'
                    loading='lazy'
                  />
                </div>

                <div className='space-y-2 text-gray-300 text-sm'>
                  <p className='break-words'>
                    <strong className='text-white'>URL:</strong>{' '}
                    <a
                      href={file.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-400 hover:underline break-words'
                    >
                      {file.url}
                    </a>
                  </p>
                  <p className='break-words'>
                    <strong className='text-white'>生成URL:</strong>{' '}
                    <a
                      href={file.secureUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-400 hover:underline break-words'
                    >
                      {file.calculatedUrl}
                    </a>
                  </p>
                  <p>
                    <strong className='text-white'>幅:</strong> {file.width}px
                  </p>
                  <p>
                    <strong className='text-white'>高さ:</strong> {file.height}px
                  </p>
                  <p>
                    <strong className='text-white'>フォーマット:</strong> {file.format}
                  </p>
                  <p>
                    <strong className='text-white'>サイズ:</strong> {formatBytes(file.bytes)}
                  </p>
                  <p>
                    <strong className='text-white'>作成日時:</strong>{' '}
                    {new Date(file.createdAt).toLocaleString()}
                  </p>
                </div>

                <CopyButton copyText={copyText} publicId={file.publicId} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;
