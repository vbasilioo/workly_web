import { Settings } from "../types";

export const mockSettings: Settings[] = [
  {
    id: "setting-001",
    key: "company_name",
    value: "Workly LTDA",
    group: "company",
    description: "Nome da empresa",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-002",
    key: "company_logo",
    value: "https://example.com/logo.png",
    group: "company",
    description: "URL do logotipo da empresa",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-003",
    key: "company_phone",
    value: "(11) 3456-7890",
    group: "company",
    description: "Número de telefone da empresa",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-004",
    key: "support_email",
    value: "suporte@workly.com",
    group: "support",
    description: "Email de suporte técnico",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-005",
    key: "notification_email",
    value: "notificacoes@workly.com",
    group: "notifications",
    description: "Email para envio de notificações",
    isPublic: false,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-006",
    key: "smtp_host",
    value: "smtp.example.com",
    group: "email",
    description: "Servidor SMTP para envio de emails",
    isPublic: false,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-007",
    key: "smtp_port",
    value: 587,
    group: "email",
    description: "Porta do servidor SMTP",
    isPublic: false,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-008",
    key: "smtp_username",
    value: "user@example.com",
    group: "email",
    description: "Usuário do servidor SMTP",
    isPublic: false,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-009",
    key: "smtp_password",
    value: "********",
    group: "email",
    description: "Senha do servidor SMTP",
    isPublic: false,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-010",
    key: "allowed_file_types",
    value: ["jpg", "png", "pdf", "docx"],
    group: "files",
    description: "Tipos de arquivos permitidos para upload",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-011",
    key: "max_file_size",
    value: 5242880,
    group: "files",
    description: "Tamanho máximo de arquivo para upload (em bytes)",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "setting-012",
    key: "maintenance_mode",
    value: false,
    group: "system",
    description: "Sistema em modo de manutenção",
    isPublic: true,
    isActive: true,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z"
  }
]; 