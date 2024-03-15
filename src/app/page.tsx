import { Markdown } from './_components/Markdown';

export default function Home() {
  return (
    <main>
      <h1 className='text-center text-5xl font-bold my-4'>Image Data</h1>
      <div className='mx-0 my-0 sm:mx-4 sm:my-4 lg:mx-auto lg:w-[992px]'>
        <Markdown />
      </div>
    </main>
  );
}
