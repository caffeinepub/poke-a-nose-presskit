import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Content, GameDetails } from '../backend';

// ── Read Hooks ────────────────────────────────────────────────────────────────

export function useGetContent() {
  const { actor, isFetching } = useActor();

  return useQuery<Content>({
    queryKey: ['content'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getContent();
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
    retry: 3,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetPasswordProtectionStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['passwordProtectionStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPasswordProtectionStatus();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetAboutText() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['aboutText'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAboutText();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetFeatures() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['features'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeatures();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetGameDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<GameDetails>({
    queryKey: ['gameDetails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getGameDetails();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetInstagramLink() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['instagramLink'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInstagramLink();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetYoutubeLink() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['youtubeLink'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getYoutubeLink();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetDeveloperWebsite() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['developerWebsite'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDeveloperWebsite();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetPressEmail() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['pressEmail'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPressEmail();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useGetBodyTextColor() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['bodyTextColor'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBodyTextColor();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

// ── Mutation Hooks ────────────────────────────────────────────────────────────

export function useUpdateAbout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateAbout(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['aboutText'] });
    },
  });
}

export function useUpdateFeatures() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFeatures: string[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFeatures(newFeatures);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}

export function useUpdateGameDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ genre, platforms, releaseDate }: { genre: string; platforms: string; releaseDate: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateGameDetails(genre, platforms, releaseDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['gameDetails'] });
    },
  });
}

export function useUpdateInstagram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInstagram(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['instagramLink'] });
    },
  });
}

export function useUpdateYoutubeLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateYoutubeLink(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['youtubeLink'] });
    },
  });
}

export function useUpdateDeveloperWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateDeveloperWebsite(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['developerWebsite'] });
    },
  });
}

export function useUpdatePressEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updatePressEmail(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['pressEmail'] });
    },
  });
}

export function useUpdateBodyTextColor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (colorHex: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateBodyTextColor(colorHex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['bodyTextColor'] });
    },
  });
}

export function useEnablePasswordProtection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.enablePasswordProtection(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['passwordProtectionStatus'] });
    },
  });
}

export function useDisablePasswordProtection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_: undefined) => {
      if (!actor) throw new Error('Actor not available');
      await actor.disablePasswordProtection();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['passwordProtectionStatus'] });
    },
  });
}
