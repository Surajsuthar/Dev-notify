import { useQuery } from "@tanstack/react-query";

interface GithubResponse {
  stargazers_count: number;
}

export const useGithub = () => {
  const { data, isLoading, error } = useQuery<GithubResponse>({
    queryKey: ["github-star"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/repos/Surajsuthar/dev-notify`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch repository data");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  if (data?.stargazers_count && data.stargazers_count < 1000) {
    return {
      stargazers_count: data?.stargazers_count ?? 0,
      isLoading,
      error,
    };
  }

  return {
    stargazers_count: data?.stargazers_count
      ? roundUpFormat(data?.stargazers_count)
      : 0,
    isLoading,
    error,
  };
};

const roundUpFormat = (count: number) => {
  if (count < 1000) return count.toString();
  return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
};
