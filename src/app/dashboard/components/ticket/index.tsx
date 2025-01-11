import { FiFile, FiCheckSquare } from "react-icons/fi";
import { TicketProps } from "@/utils/ticket.type";
import { CustomerProps } from "@/utils/customer.type";

interface TicketItemProps {
  ticket: TicketProps;
  customer: CustomerProps | null; // Pode ser null, pois pode ser que não haja um customer por algum motivo
}

export function TicketItem({ customer, ticket }: TicketItemProps) {
  return (
    <>
      <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300">
        <td className="text-left pl-1">
          {customer?.name}
        </td>
        <td className="text-left hidden sm:table-cell">
          {ticket.created_at?.toLocaleDateString("pt-br")}
        </td>
        <td className="text-left">
          <span className="bg-green-500 px-2 py-1 rounded">{ticket.status}</span>
        </td>
        <td className="text-left">
          <button className="mr-2">
            <FiCheckSquare size={24} color="#131313" />
          </button>
          <button>
            <FiFile size={24} color="#3b82f6" />
          </button>
        </td>
      </tr>
    </>
  )
}
