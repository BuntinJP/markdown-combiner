import { Suspense } from 'react';
import { Markdown } from './_components/Markdown';

export default function Home() {
  return (
    <main>
      <h1>Image Data</h1>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Markdown />
      </Suspense>
    </main>
  );
}
