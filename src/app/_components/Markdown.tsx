'use client';

import { useEffect, useState } from 'react';
import 'zenn-content-css';
import Link from 'next/link';
import { getJsonFiles } from '../utils/github';
import type { CloudImageInfoWithCalculatedUrl } from '../types';

// shadcn/uiから必要なコンポーネントをインポート
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@radix-ui/react-progress'; // 既存の依存関係を利用
import { Button } from '@/components/ui/button';

// lucide-reactからアイコンをインポート
import { Clipboard, Check } from 'lucide-react';
const Loading = () => {
  return (
    <div role='status' className='flex justify-center items-center h-48'>
      <Progress className='w-1/2' />
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

export const Markdown = () => {
  const [source, setSource] = useState<CloudImageInfoWithCalculatedUrl[] | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const files = await getJsonFiles();
        if (files.length === 0) {
          throw new Error('No JSON files found');
        }
        setSource(files);
      } catch (e: any) {
        console.error(e);
        setSource([]);
      }
    };
    fetchSource();
  }, []);

  const handleCopy = (copyText: string, id: string) => {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000); // 2秒後にコピー状態をリセット
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  if (source === undefined) {
    // Loading state
    return (
      <div className='flex items-center justify-center mt-20'>
        <Loading />
      </div>
    );
  }

  if (source.length === 0) {
    // Error or no data state
    return (
      <div className='text-center mt-20'>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className='[overflow-wrap:anywhere] mx-4 my-8'>
      {/* Table of contents部分 */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='m-0 pl-4 list-disc'>
            {source.map((file) => (
              <li key={file.publicId}>
                <Link
                  href={`#${file.publicId}`}
                  className='text-base sm:text-lg text-blue-600 hover:text-blue-400 no-underline hover:underline'
                >
                  {file.publicId}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* コンテンツ一覧をグリッドで並べる */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {source.map((file) => {
          const copyText = `![${file.publicId}](${file.calculatedUrl})`;

          return (
            <Card key={file.publicId} id={file.publicId} className='overflow-hidden min-w-[10cm]'>
              <CardHeader>
                <CardTitle className='break-all'>{file.publicId}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 画像のサンプル表示 */}
                <img src={file.calculatedUrl} alt={file.publicId} className='w-full h-auto mb-4' />

                {/* データの表示 */}
                <div className='space-y-2'>
                  <p>
                    <strong>URL:</strong>{' '}
                    <a
                      href={file.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {file.url}
                    </a>
                  </p>
                  <p>
                    <strong>Secure URL:</strong>{' '}
                    <a
                      href={file.secureUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {file.secureUrl}
                    </a>
                  </p>
                  <p>
                    <strong>Width:</strong> {file.width}px
                  </p>
                  <p>
                    <strong>Height:</strong> {file.height}px
                  </p>
                  <p>
                    <strong>Format:</strong> {file.format}
                  </p>
                  <p>
                    <strong>Bytes:</strong> {file.bytes}
                  </p>
                  <p>
                    <strong>Created At:</strong> {new Date(file.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* コピー機能 */}
                <div className='mt-4 flex items-center'>
                  <Button
                    onClick={() => handleCopy(copyText, file.publicId)}
                    className='flex items-center'
                  >
                    {copiedId === file.publicId ? (
                      <>
                        <Check className='w-5 h-5 mr-2' />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard className='w-5 h-5 mr-2' />
                        Copy Markdown
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
