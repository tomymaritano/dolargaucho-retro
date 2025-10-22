/**
 * useFeatureVotes Hook
 *
 * Manages feature voting state with optimistic updates
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface VoteData {
  featureId: string;
  votes: number;
  hasVoted: boolean;
}

interface UseFeatureVotesReturn {
  votes: Map<string, number>;
  userVotes: Set<string>;
  isLoading: boolean;
  error: string | null;
  toggleVote: (featureId: string) => Promise<void>;
}

export function useFeatureVotes(): UseFeatureVotesReturn {
  const { user } = useAuth();
  const [votes, setVotes] = useState<Map<string, number>>(new Map());
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial votes
  useEffect(() => {
    async function fetchVotes() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/roadmap/votes');
        const data = await response.json();

        if (data.success && data.data) {
          const votesMap = new Map<string, number>();
          const userVotesSet = new Set<string>();

          data.data.forEach((voteData: VoteData) => {
            votesMap.set(voteData.featureId, voteData.votes);
            if (voteData.hasVoted) {
              userVotesSet.add(voteData.featureId);
            }
          });

          setVotes(votesMap);
          setUserVotes(userVotesSet);
        }
      } catch (err) {
        console.error('[useFeatureVotes] Error fetching votes:', err);
        setError('Error al cargar votos');
      } finally {
        setIsLoading(false);
      }
    }

    fetchVotes();
  }, [user]);

  // Toggle vote for a feature
  const toggleVote = async (featureId: string) => {
    if (!user) {
      setError('Debes iniciar sesión para votar');
      return;
    }

    const hasVoted = userVotes.has(featureId);
    const currentVotes = votes.get(featureId) || 0;

    // Optimistic update
    const newVotes = new Map(votes);
    const newUserVotes = new Set(userVotes);

    if (hasVoted) {
      // Remove vote optimistically
      newVotes.set(featureId, Math.max(0, currentVotes - 1));
      newUserVotes.delete(featureId);
    } else {
      // Add vote optimistically
      newVotes.set(featureId, currentVotes + 1);
      newUserVotes.add(featureId);
    }

    setVotes(newVotes);
    setUserVotes(newUserVotes);

    try {
      const method = hasVoted ? 'DELETE' : 'POST';
      const response = await fetch('/api/roadmap/vote', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Update with real data from server
      if (typeof data.votes === 'number') {
        const updatedVotes = new Map(votes);
        updatedVotes.set(featureId, data.votes);
        setVotes(updatedVotes);
      }
    } catch (err) {
      console.error('[useFeatureVotes] Error toggling vote:', err);

      // Revert optimistic update on error
      setVotes(new Map(votes));
      setUserVotes(new Set(userVotes));

      setError(err instanceof Error ? err.message : 'Error al votar');
    }
  };

  return {
    votes,
    userVotes,
    isLoading,
    error,
    toggleVote,
  };
}
