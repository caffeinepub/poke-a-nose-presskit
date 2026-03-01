import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Content } from '../backend';

// ─── Content ────────────────────────────────────────────────────────────────

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
  });
}

// ─── Password verification ───────────────────────────────────────────────────

export function useVerifyPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (password: string): Promise<boolean> => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyPassword(password);
    },
  });
}

// ─── Content mutations ───────────────────────────────────────────────────────

export function useUpdateAbout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateAbout(text);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateFeatures() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (features: string[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFeatures(features);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateGameDetails() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ genre, platforms, releaseDate }: { genre: string; platforms: string; releaseDate: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateGameDetails(genre, platforms, releaseDate);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateInstagram() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInstagram(link);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateYoutubeLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateYoutubeLink(link);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateDeveloperWebsite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateDeveloperWebsite(link);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdatePressEmail() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updatePressEmail(email);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateBodyTextColor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (colorHex: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateBodyTextColor(colorHex);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useEnablePasswordProtection() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.enablePasswordProtection(password);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useDisablePasswordProtection() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.disablePasswordProtection();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUpdateIframeSrc() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (src: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateIframeSrc(src);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}
