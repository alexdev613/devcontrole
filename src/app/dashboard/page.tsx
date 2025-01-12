import { Container } from "@/components/container"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from "next/link";
import { TicketItem } from "./components/ticket";

import prismaClient from '@/lib/prisma'; // Para termos acesso ao nosso ORM Prisma e ao nosso banco de dados

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // Se não tem uma session, ou não tiver os dados do usuário numa session redireciona o usuário pra home
  if (!session || !session.user) {
    redirect("/")
  }

  // console.log(session);

  const tickets = await prismaClient.ticket.findMany({
    where: {
      userId: session.user.id,
      status: "ABERTO"
    },
    include: {
      customer: true,
    }
  })

  console.log(tickets);

  return (
    <Container>
      <main className="mt-9 mb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Chamados</h1>
          <Link href="/dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">
            Abrir chamado
          </Link>
        </div>
        <table className="min-w-full my-2">
          <thead>
            <tr>
              <th className="font-medium text-left pl-1">CLIENTE</th>
              <th className="font-medium text-left hidden sm:block">DATA CADASTRADA</th>
              <th className="font-medium text-left">STATUS</th>
              <th className="font-medium text-left">#</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                customer={ticket.customer}
              />
            ))}

          </tbody>
        </table>
        {tickets.length === 0 && (
          <h1 className="px-2 text-gray-600">Nenhum ticket/chamado aberto foi encontrado...</h1>
        )}

      </main>
    </Container>
  )
}