import { create } from "zustand";
import { defaultSpec, PlaceholderSpec } from "./schema";

type BuilderState = {
  lastSpec: PlaceholderSpec;
  setLastSpec: (spec: PlaceholderSpec) => void;
};

export const useBuilderStore = create<BuilderState>((set) => ({
  lastSpec: defaultSpec,
  setLastSpec: (spec) => set({ lastSpec: spec })
}));
