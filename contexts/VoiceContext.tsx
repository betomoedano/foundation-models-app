import * as Speech from "expo-speech";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Voice {
  identifier: string;
  name: string;
  language: string;
  quality: Speech.VoiceQuality;
}

interface VoiceContextType {
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: (voice: Voice | null) => void;
  speak: (text: string, voice?: Voice | null) => void;
  stop: () => void;
  isSpeaking: boolean;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    const availableVoices = await Speech.getAvailableVoicesAsync();
    setVoices(availableVoices);
  };

  const speak = (text: string, voice?: Voice | null) => {
    const options: Speech.SpeechOptions = {};
    const voiceToUse = voice !== undefined ? voice : selectedVoice;
    if (voiceToUse) {
      options.voice = voiceToUse.identifier;
    }
    options.onDone = () => setIsSpeaking(false);
    options.onStopped = () => setIsSpeaking(false);
    options.onStart = () => setIsSpeaking(true);
    
    Speech.speak(text, options);
  };

  const stop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <VoiceContext.Provider
      value={{
        voices,
        selectedVoice,
        setSelectedVoice,
        speak,
        stop,
        isSpeaking,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}