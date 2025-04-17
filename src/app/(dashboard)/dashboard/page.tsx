'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { Users, UserCheck, UserMinus, DollarSign, TrendingUp, LineChart, PieChart, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const { employees } = useEmployees()

  const stats = employees
    ? [
      {
        title: 'Total de Funcionários',
        value: employees.length,
        icon: Users,
        description: '+5 no último mês',
        trend: 'up',
        color: 'blue'
      },
      {
        title: 'Funcionários Ativos',
        value: employees.filter((e) => e.isActive).length,
        icon: UserCheck,
        description: '82% do total',
        trend: 'up',
        color: 'green'
      },
      {
        title: 'Funcionários Inativos',
        value: employees.filter((e) => !e.isActive).length,
        icon: UserMinus,
        description: '18% do total',
        trend: 'neutral',
        color: 'amber'
      },
      {
        title: 'Custo Mensal',
        value: 'R$ 450.000',
        icon: DollarSign,
        description: '+2% que mês passado',
        trend: 'up',
        color: 'purple'
      },
    ]
    : [];

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const bgColor = {
              blue: 'bg-blue-50 border-blue-200',
              green: 'bg-green-50 border-green-200',
              amber: 'bg-amber-50 border-amber-200',
              purple: 'bg-purple-50 border-purple-200',
            }[stat.color];

            const iconBg = {
              blue: 'bg-blue-500',
              green: 'bg-green-500',
              amber: 'bg-amber-500',
              purple: 'bg-purple-500',
            }[stat.color];

            const trendColor = {
              up: 'text-green-600',
              down: 'text-red-600',
              neutral: 'text-gray-600',
            }[stat.trend];

            return (
              <Card key={stat.title} className={`border rounded-xl shadow-md hover:shadow-lg transition-all ${bgColor}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${iconBg} text-white`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className={`text-sm flex items-center gap-1 ${trendColor}`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1 border rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Atividades Mensais</CardTitle>
                <LineChart className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500">Acompanhamento mensal de atividades</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de atividades aqui</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 border rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Distribuição por Departamento</CardTitle>
                <PieChart className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500">Funcionários por departamento</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de distribuição aqui</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 mb-8">
          <Card className="border rounded-xl shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Funcionários em Destaque</CardTitle>
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500">Top funcionários do mês</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Tabela de destaques aqui</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 