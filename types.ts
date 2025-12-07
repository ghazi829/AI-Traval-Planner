
// FIX: Made uri and title optional to match the type from the @google/genai SDK.
export interface GroundingChunk {
  web: {
    uri?: string;
    title?: string;
  };
}
