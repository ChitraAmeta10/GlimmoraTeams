import { MeshBackground } from "@/components/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MeshBackground variant="warm" className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-6xl flex justify-center py-6">
        {children}
      </div>
    </MeshBackground>
  );
}
