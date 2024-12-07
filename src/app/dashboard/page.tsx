import { Container } from "@/components/container"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // Se não tem uma session, ou não tiver os dados do usuário numa session redireciona o usuário pra home
  if (!session || !session.user) {
    redirect("/")
  }

  console.log(session);

  return (
    <Container>
      <main className="mt-9 mb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Chamados</h1>
          <Link href="/dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">
            Abrir chamado
          </Link>
        </div>
      </main>
    </Container>
  )
}