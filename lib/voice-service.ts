import { useStore } from './store';
import { VoiceRoom, RoomParticipant } from './types';

/**
 * Voice service for managing voice room interactions
 * MVP: Mock functions that update state (no real WebRTC)
 */

export const voiceService = {
  /**
   * Join a voice room
   */
  joinRoom: (roomId: string, userId: number, userName: string, userAvatar: string): void => {
    const store = useStore.getState();
    store.joinRoom(roomId, userId, userName, userAvatar);
  },

  /**
   * Leave a voice room
   */
  leaveRoom: (roomId: string, userId: number): void => {
    const store = useStore.getState();
    store.leaveRoom(roomId, userId);
  },

  /**
   * Get current participants in a room
   */
  getRoomParticipants: (roomId: string): RoomParticipant[] => {
    const store = useStore.getState();
    const room = store.activeRooms.find(r => r.roomId === roomId);
    return room?.participants || [];
  },

  /**
   * Toggle mute state for current user
   */
  toggleMute: (roomId: string, userId: number): void => {
    const store = useStore.getState();
    store.toggleParticipantMute(roomId, userId);
  },

  /**
   * Update speaking state (mock - simulates someone talking)
   */
  setSpeaking: (roomId: string, userId: number, isSpeaking: boolean): void => {
    const store = useStore.getState();
    store.updateParticipantSpeaking(roomId, userId, isSpeaking);
  },

  /**
   * Mock function to simulate random speaking events
   */
  simulateSpeaking: (roomId: string, interval: number = 3000): () => void => {
    const store = useStore.getState();
    const room = store.activeRooms.find(r => r.roomId === roomId);
    if (!room) return () => {};

    const participants = room.participants.filter(p => !p.isMuted && !p.isModerator);
    if (participants.length === 0) return () => {};

    let currentSpeaker: number | null = null;

    const intervalId = setInterval(() => {
      // Stop current speaker
      if (currentSpeaker !== null) {
        voiceService.setSpeaking(roomId, currentSpeaker, false);
      }

      // Pick a random participant to speak
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      if (randomParticipant) {
        currentSpeaker = randomParticipant.userId;
        voiceService.setSpeaking(roomId, randomParticipant.userId, true);

        // Stop speaking after a random duration
        setTimeout(() => {
          if (currentSpeaker === randomParticipant.userId) {
            voiceService.setSpeaking(roomId, randomParticipant.userId, false);
            currentSpeaker = null;
          }
        }, 2000 + Math.random() * 3000);
      }
    }, interval);

    // Return cleanup function
    return () => {
      clearInterval(intervalId);
      if (currentSpeaker !== null) {
        voiceService.setSpeaking(roomId, currentSpeaker, false);
      }
    };
  },
};

