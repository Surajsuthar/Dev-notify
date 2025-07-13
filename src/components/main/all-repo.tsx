import { RepoCard } from "./repo-card";

export const AllRepo = () => {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(10)].map((_, index) => (
            <RepoCard key={index} />
          ))}
        </div>
      </div>
    </main>
  );
};
