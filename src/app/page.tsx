import { Suspense } from 'react';
import { Markdown } from './_components/Markdown';

export default function Home() {
  return (
    <main>
      <h1 className='text-center text-5xl font-bold my-4'>Image Data</h1>
      <div className='mx-2 lg:mx-auto lg:w-[992px]'>
        <Suspense fallback={<h1 className='text-center'>Loading...</h1>}>
          <Markdown />
        </Suspense>
      </div>
    </main>
  );
}
