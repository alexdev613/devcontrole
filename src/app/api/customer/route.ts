import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismaClient from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerEmail = searchParams.get("email");

  // validar customerEmail como string para impedir erro no TypeScript, se customerEmail não existir ou for uma
  // string vazia ou não encotrar o que foi passado no parâmetro, um erro not found é retornado e a função para
  if (!customerEmail || customerEmail === "") {
    return NextResponse.json({ error: "Customer not found" }, { status: 400 })
  }

  // Se o parâmetro foi preenchido, a função tentará buscar no banco de dados o email recebido no parâmetro
  try {
    const customer = await prismaClient.customer.findFirst({
      where: {
        email: customerEmail,
      }
    })

    // Quando a requisição der certo, receberá objeto customer:
    return NextResponse.json(customer);

  } catch(err) {
    return NextResponse.json({ error: "Customer not found" }, { status: 400 })
  }

  return NextResponse.json({ message: "RECEBIDO" });
}

// Rotas: http://localhost:3000/api/customer

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "Failed delete customer"}, {status: 400});
  }

  // Para impedir o usuário de deletar um cliente que tem um ticket/chamado aberto atrelado:
  const findTicket = await prismaClient.ticket.findFirst({
    where: {
      customerId: userId
    }
  })

  if (findTicket) {
    return NextResponse.json({ error: "Failed delete customer" }, { status: 400 });
  }

  try {
    await prismaClient.customer.delete({
      where: {
        id: userId as string
      }
    })

    return NextResponse.json({ message: "Cliente deletado com sucesso!"});

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed delete customer" }, {status: 400 })
  }

}

// Rota para cadastrar um cliente
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized"}, {status: 401});
  }

    const { name, email, phone, address, userId } = await request.json();

    try {
      await prismaClient.customer.create({
        data: {
          name,
          phone,
          email,
          address: address ? address : "",
          userId: userId // pois esse cliente tem que pertencer a um usuário.
        }
      })

      return NextResponse.json({ message: "Cliente cadastrado com sucesso!"});

    } catch (err) {
      return NextResponse.json({ error: "Failed create new customer" }, { status: 400 })
    }
}
