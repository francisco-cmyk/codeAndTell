//For state management in components

export default function getMergeState<State>(
  ss: React.Dispatch<React.SetStateAction<State>>
) {
  return function mergeState(ps: Partial<State>) {
    return ss((s: State) => ({ ...s, ...ps }));
  };
}
