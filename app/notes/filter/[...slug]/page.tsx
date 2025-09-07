import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes, getCategories } from "@/lib/api";
import NotesClient from "./Notes.client";

export const dynamicParams = false;
export const revalidate = 900;

export const generateStaticParams = async () => {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: [category] }));
};

type NotesPageProps = {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function NotesFilter({ params }: NotesPageProps) {
  const queryClient = new QueryClient();
  const categories = await getCategories();
  const { slug } = params;
  const category = slug[0] === "All" ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, category }],
    queryFn: () => fetchNotes("", 1, 12, category),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient categories={categories} category={category} />
    </HydrationBoundary>
  );
}