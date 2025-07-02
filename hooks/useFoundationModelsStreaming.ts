import ExpoFoundationModelsModule, {
  StreamingCancelled,
  StreamingChunk,
  StreamingError,
  StreamingSession,
} from "@/modules/expo-foundation-models";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFoundationModelsStreaming() {
  const [content, setContent] = useState("");
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);

  const subscriptionsRef = useRef<any[]>([]);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Set up event listeners
    const chunkSub = ExpoFoundationModelsModule.addListener(
      "onStreamingChunk",
      (event: StreamingChunk) => {
        // Only process events for our session
        if (event.sessionId !== sessionIdRef.current) return;

        if (event.isComplete) {
          setSession(null);
          setLoading(false);
          sessionIdRef.current = null;
        } else {
          setContent(event.content);
          setTokenCount(event.tokenCount);
        }
      }
    );

    const errorSub = ExpoFoundationModelsModule.addListener(
      "onStreamingError",
      (event: StreamingError) => {
        if (event.sessionId !== sessionIdRef.current) return;

        setError(event.error);
        setSession(null);
        setLoading(false);
        sessionIdRef.current = null;
      }
    );

    const cancelSub = ExpoFoundationModelsModule.addListener(
      "onStreamingCancelled",
      (event: StreamingCancelled) => {
        if (event.sessionId !== sessionIdRef.current) return;

        setSession(null);
        setLoading(false);
        sessionIdRef.current = null;
      }
    );

    subscriptionsRef.current = [chunkSub, errorSub, cancelSub];

    return () => {
      // Clean up subscriptions
      subscriptionsRef.current.forEach((sub) => sub.remove());

      // Cancel any active session on unmount
      if (sessionIdRef.current) {
        ExpoFoundationModelsModule.cancelStreamingSession(
          sessionIdRef.current
        ).catch(console.error);
      }
    };
  }, []);

  const startStreaming = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    // Cancel any existing session
    if (sessionIdRef.current) {
      await cancelStreaming();
    }

    try {
      setLoading(true);
      setError(null);
      setContent("");
      setTokenCount(0);

      const newSession = await ExpoFoundationModelsModule.startStreamingSession(
        {
          prompt: prompt.trim(),
        }
      );

      if ("error" in newSession && newSession.error) {
        setError(newSession.error);
        setLoading(false);
      } else {
        setSession(newSession);
        sessionIdRef.current = newSession.sessionId;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start streaming"
      );
      setLoading(false);
    }
  }, []);

  const cancelStreaming = useCallback(async () => {
    if (sessionIdRef.current) {
      try {
        await ExpoFoundationModelsModule.cancelStreamingSession(
          sessionIdRef.current
        );
        sessionIdRef.current = null;
      } catch (err) {
        console.error("Failed to cancel streaming:", err);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setContent("");
    setTokenCount(0);
    setError(null);
    setSession(null);
    sessionIdRef.current = null;
  }, []);

  return {
    content,
    session,
    loading,
    error,
    tokenCount,
    startStreaming,
    cancelStreaming,
    reset,
  };
}
