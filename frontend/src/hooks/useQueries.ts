import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Content, GameDetails } from '../backend';

// ── Content ──────────────────────────────────────────────────────────────────

export function useContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Content>({
    queryKey: ['content'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContent();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
    retry: 2,
  });
}

// ── Admin check ───────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60_000,
    retry: 1,
  });
}

// ── Update About ──────────────────────────────────────────────────────────────

export function useUpdateAbout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAbout(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update Features ───────────────────────────────────────────────────────────

export function useUpdateFeatures() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (features: string[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeatures(features);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update Game Details ───────────────────────────────────────────────────────

export function useUpdateGameDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: GameDetails) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGameDetails(details.genre, details.platforms, details.releaseDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update Instagram ──────────────────────────────────────────────────────────

export function useUpdateInstagram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInstagram(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update YouTube Link ───────────────────────────────────────────────────────

export function useUpdateYoutubeLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateYoutubeLink(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update Developer Website ──────────────────────────────────────────────────

export function useUpdateDeveloperWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDeveloperWebsite(link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update Press Email ────────────────────────────────────────────────────────

export function useUpdatePressEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePressEmail(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Update Body Text Color ────────────────────────────────────────────────────

export function useUpdateBodyTextColor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (colorHex: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBodyTextColor(colorHex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

// ── Password Protection ───────────────────────────────────────────────────────

export function useEnablePasswordProtection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enablePasswordProtection(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useDisablePasswordProtection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.disablePasswordProtection();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useVerifyPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyPassword(password);
    },
  });
}

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string; principal: import('@dfinity/principal').Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
