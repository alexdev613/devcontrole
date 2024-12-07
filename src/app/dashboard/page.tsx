import { Container } from "@/components/container"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // Se não tem uma session, ou não tiver os dados do usuário numa session redireciona o usuário pra home
  if (!session || !session.user) {
    redirect("/")
  }

  console.log(session);

  return (
    <Container>
      <h1>Página dashboard</h1>
    </Container>
  )
}