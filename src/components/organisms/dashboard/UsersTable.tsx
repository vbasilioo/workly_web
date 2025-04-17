/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { User } from '@/lib/types';
import { format } from 'date-fns';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-400 hover:to-blue-400">
            <TableHead className="text-white font-semibold">Nome</TableHead>
            <TableHead className="text-white font-semibold">Email</TableHead>
            <TableHead className="text-white font-semibold">Perfil</TableHead>
            <TableHead className="text-white font-semibold">Data de Cadastro</TableHead>
            <TableHead className="text-white font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id} className="hover:bg-sky-50">
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 italic hover:text-blue-600 hover:underline cursor-pointer">
                  {user.email}
                </span>
              </TableCell>
              <TableCell className="capitalize">
                {user.role === 'administrator' ? (
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    Administrador
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    Usuário
                  </span>
                )}
              </TableCell>
              <TableCell>
                {user.createdAt
                  ? format(new Date(user.createdAt), 'dd/MM/yyyy')
                  : 'N/A'}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sky-50 hover:text-sky-500"
                  onClick={() => onEdit(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-100 hover:text-red-600"
                  onClick={() => onDelete(user)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 