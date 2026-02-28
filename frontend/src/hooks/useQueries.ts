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
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.verifyPassword(password);
      if (result.__kind__ === 'err') throw new Error(result.err);
      return result.ok;
    },
  });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function useInitializeAdmin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.initializeAdmin();
      if (result.__kind__ === 'err') throw new Error(result.err);
      return true;
    },
  });
}

export function useVerifyAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ __kind__: 'ok'; ok: boolean } | { __kind__: 'err'; err: string }>({
    queryKey: ['verifyAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ─── Content mutations ───────────────────────────────────────────────────────

export function useUpdateAbout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not available');
      const r = await actor.updateAbout(text);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.updateFeatures(features);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.updateGameDetails(genre, platforms, releaseDate);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.updateInstagram(link);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.updateDeveloperWebsite(link);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.updatePressEmail(email);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.updateBodyTextColor(colorHex);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.enablePasswordProtection(password);
      if (r.__kind__ === 'err') throw new Error(r.err);
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
      const r = await actor.disablePasswordProtection();
      if (r.__kind__ === 'err') throw new Error(r.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content'] }),
  });
}
