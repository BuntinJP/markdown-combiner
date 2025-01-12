import { ImageGallery } from './_components/ImageGallery';

export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main className='min-h-screen'>
      <h1 className='text-center text-5xl font-bold my-4'>Image Data</h1>
      <ImageGallery />
    </main>
  );
}
