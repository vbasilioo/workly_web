'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserMinus, DollarSign } from 'lucide-react'

const stats = [
  {
    title: 'Total de Funcionários',
    value: '120',
    icon: Users,
    description: '+5 no último mês'
  },
  {
    title: 'Funcionários Ativos',
    value: '98',
    icon: UserCheck,
    description: '82% do total'
  },
  {
    title: 'Funcionários Inativos',
    value: '22',
    icon: UserMinus,
    description: '18% do total'
  },
  {
    title: 'Custo Mensal',
    value: 'R$ 450.000',
    icon: DollarSign,
    description: '+2% que mês passado'
  }
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral dos seus funcionários e custos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Aqui podemos adicionar mais seções como gráficos, tabelas, etc. */}
    </div>
  )
} 