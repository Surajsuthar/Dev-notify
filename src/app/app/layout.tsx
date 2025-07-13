import { UsernameProvider } from "@/components/main/number-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      <UsernameProvider>{children}</UsernameProvider>
    </div>
  );
}
