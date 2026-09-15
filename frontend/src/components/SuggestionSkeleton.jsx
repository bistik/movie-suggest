const PLACEHOLDER = "rounded bg-neutral-700/50 animate-pulse";

function SkeletonCard() {
  return (
    <div className="flex w-56 flex-col">
      <div className={`mb-3 aspect-[185/278] w-56 ${PLACEHOLDER}`} />
      <div className={`h-5 w-44 ${PLACEHOLDER}`} />
      <div className={`mt-2 h-4 w-full ${PLACEHOLDER}`} />
      <div className={`mt-1 h-4 w-48 ${PLACEHOLDER}`} />
      <div className={`mt-3 h-3 w-24 ${PLACEHOLDER}`} />
      <div className={`mt-2 h-3 w-28 ${PLACEHOLDER}`} />
      <div className={`mt-2 h-3 w-40 ${PLACEHOLDER}`} />
    </div>
  );
}

export default function SuggestionSkeleton({ count = 6 }) {
  return (
    <div className="mx-auto mt-10 grid w-fit grid-cols-3 gap-x-4 gap-y-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
