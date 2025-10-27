import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the schools listing page
    router.replace('/showSchools');
  }, [router]);

  return null;
}