// Reexport the native module. On web, it will be resolved to ExpoFoundationModelsModule.web.ts
// and on native platforms to ExpoFoundationModelsModule.ts
export * from "./src/ExpoFoundationModels.types";
export { default } from "./src/ExpoFoundationModelsModule";
export { default as ExpoFoundationModelsView } from "./src/ExpoFoundationModelsView";
