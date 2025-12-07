// FIX: Made the `web` property optional to align with the GroundingChunk type from the @google/genai SDK.
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}
