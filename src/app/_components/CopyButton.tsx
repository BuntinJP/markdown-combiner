'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Check } from 'lucide-react';

interface CopyButtonProps {
  copyText: string;
  title: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copyText, title }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('コピーに失敗しました: ', err);
      });
  };

  return (
    <div className='mt-4 flex items-center'>
      <Button
        onClick={handleCopy}
        className='flex items-center bg-blue-600 hover:bg-blue-500 text-white'
      >
        {copied ? (
          <>
            <Check className='w-5 h-5 mr-2' />
            コピー完了！
          </>
        ) : (
          <>
            <Clipboard className='w-5 h-5 mr-2' />
            {''}{title}
          </>
        )}
      </Button>
    </div>
  );
};

export default CopyButton;
