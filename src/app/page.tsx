import { Markdown } from './_components/Markdown';
import { ImageSamples } from './_components/ImageSamples';

export default function Home() {
  return (
    <main>
      <h1 className='text-center text-5xl font-bold my-4'>Image Data</h1>
      <div className='grid grid-cols-3'>
        <div className='col-span-2 p-4'>
          <Markdown />
        </div>
        <div className='col-span-1 p-4 flex flex-col gap-10'>
          <ImageSamples />
        </div>
      </div>
    </main>
  );
}
