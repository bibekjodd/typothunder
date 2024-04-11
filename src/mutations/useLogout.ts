import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useGameStore } from '@/store/useGameStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onMutate() {
      const { clearGame, switchMode } = useGameStore.getState();
      queryClient.setQueryData(['profile'], null);
      clearGame();
      switchMode({ isMultiplayer: false });
      queryClient.setQueryData(['track'], null);
      if (location.search) router.replace('/');
    }
  });
};

const logout = async () => {
  try {
    return axios.get(`${backend_url}/api/logout`, { withCredentials: true });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
