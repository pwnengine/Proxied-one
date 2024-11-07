import { useQuery } from "@tanstack/react-query"

export interface i_user {
  id: number;
  username: string;
}

export const useUserQuery = (queryfn: () => Promise<i_user>): { user: i_user | undefined, loading: boolean, error: boolean, refetch: () => void } => {
  const { data, isLoading, isError, refetch } = useQuery<i_user, Error>({
    queryKey: [''],
    queryFn: queryfn,
  });

  return {
    user: data,
    loading: isLoading,
    error: isError,
    refetch: () => { refetch() },
  };
}