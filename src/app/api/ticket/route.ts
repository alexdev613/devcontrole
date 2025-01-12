import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

// http://localhost:3000/api/ticket

// Vamos usar o verbo da rota PATCH, que atualiza apenas um item do banco, se fosse PUT atualizava todos os itens

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, {status: 401 })
  }

  const { id } = await request.json();

  const findTicket = await prismaClient.ticket.findFirst({
    where: {
      id: id as string
    }
  })

  // Verificação para caso o front mande um id que não foi localizado no banco de dados do usuário (por algum motivo) a operação é barrada
  if (!findTicket) {
    return NextResponse.json({ error: "Failed update ticket"}, { status: 400 })
  }

  // Se o id do ticket/chamado enviado existir para o usuário, então a operação continua com o try catch abaixo:
  try {
    // Para atualizar o chamado/ticket:
    await prismaClient.ticket.update({
      where: {
        id: id as string,
      },
      data: {
        status: "FECHADO"
      }
    })

    return NextResponse.json({ message: "CHAMADO ATUALIZADO COM SUCESSO!"})

  } catch(err) {
    return NextResponse.json({ error: "Failed update ticket" }, { status: 400 })
  }
  // console.log(findTicket);
  // return NextResponse.json({ message: "Teste chamada."});

}
