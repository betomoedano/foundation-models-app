import ExpoFoundationModelsModule, {
  StreamingError,
  StreamingCancelled,
  StructuredStreamingChunk,
  StructuredStreamingSession,
  Product,
} from "@/modules/expo-foundation-models";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFoundationModelsStructuredStreaming() {
  const [data, setData] = useState<Product | null>(null);
  const [session, setSession] = useState<StructuredStreamingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPartial, setIsPartial] = useState(false);

  const subscriptionsRef = useRef<any[]>([]);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Set up event listeners for structured streaming
    const chunkSub = ExpoFoundationModelsModule.addListener(
      "onStructuredStreamingChunk",
      (event: StructuredStreamingChunk) => {
        // Only process events for our session
        if (event.sessionId !== sessionIdRef.current) return;

        if (event.isComplete) {
          setSession(null);
          setLoading(false);
          setIsPartial(false);
          sessionIdRef.current = null;
        } else {
          setData(event.data);
          setIsPartial(event.isPartial);
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
        setIsPartial(false);
        sessionIdRef.current = null;
      }
    );

    const cancelSub = ExpoFoundationModelsModule.addListener(
      "onStreamingCancelled",
      (event: StreamingCancelled) => {
        if (event.sessionId !== sessionIdRef.current) return;

        setSession(null);
        setLoading(false);
        setIsPartial(false);
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

  const cancelStreaming = useCallback(async () => {
    if (sessionIdRef.current) {
      try {
        await ExpoFoundationModelsModule.cancelStreamingSession(
          sessionIdRef.current
        );
        sessionIdRef.current = null;
      } catch (err) {
        console.error("Failed to cancel structured streaming:", err);
      }
    }
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
      setData(null);
      setIsPartial(false);

      const newSession = await ExpoFoundationModelsModule.startStructuredStreamingSession(
        {
          prompt: prompt.trim(),
        }
      );

      if ("error" in newSession && newSession.error) {
        setError(newSession.error);
        setLoading(false);
      } else {
        setSession(newSession as StructuredStreamingSession);
        sessionIdRef.current = newSession.sessionId;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start structured streaming"
      );
      setLoading(false);
    }
  }, [cancelStreaming]);

  const reset = useCallback(() => {
    setData(null);
    setIsPartial(false);
    setError(null);
    setSession(null);
    sessionIdRef.current = null;
  }, []);

  return {
    data,
    session,
    loading,
    error,
    isPartial,
    startStreaming,
    cancelStreaming,
    reset,
  };
}