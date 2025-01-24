import Feed from "../components/custom-ui/Feed";
import useGetPosts from "../hooks/useGetPosts";

export default function AllPosts() {
  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  return (
    <div className='w-full '>
      <Feed isLoading={isLoadingPosts} posts={posts} />
    </div>
  );
}
