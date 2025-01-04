import { Container } from '@/components/container'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { CardCustomer } from './components/card';
import prismaClient from '@/lib/prisma';

export default async function Customer() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const customers = await prismaClient.customer.findMany({
    where: {
      userId: session.user.id
    }
  })

  console.log(customers);

  return (
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Meus Clientes</h1>
          <Link href="/dashboard/customer/new" className='bg-blue-500 text-white px-4 py-1 rounded'>
            Novo cliente
          </Link>
        </div>

        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3'>
          {customers.map( customer => (
            <CardCustomer
              key={customer.id}
              customer={customer}
            />
          ))}
        </section>

        {customers.length === 0 && (
          <h1 className='font-medium text-lg'>Você ainda não possui cliente</h1>
        )}
      </main>
    </Container>
  )
}
