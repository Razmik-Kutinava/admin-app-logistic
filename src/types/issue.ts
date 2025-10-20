export const IssueType = {
  NO_SHOW: 'NO_SHOW',
  BAD_ADDRESS: 'BAD_ADDRESS',
  TRAFFIC: 'TRAFFIC',
  ACCESS_DENIED: 'ACCESS_DENIED',
  PARKING_ISSUE: 'PARKING_ISSUE',
  CLIENT_DELAY: 'CLIENT_DELAY',
  OTHER: 'OTHER'
} as const;

export type IssueType = typeof IssueType[keyof typeof IssueType];

export interface Issue {
  id: string;
  stop_id?: string;
  driver_id: string;
  issue_type: IssueType;
  description: string;
  lat: number;
  lon: number;
  photo_url?: string;
  ts: string;
  resolved_at?: string;
  created_at: string;
}

export interface IssueWithDetails extends Issue {
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  stop?: {
    id: string;
    address: string;
    client_id: string;
  };
}

// Localization for issue types (Russian)
export const IssueTypeLabels: Record<IssueType, string> = {
  [IssueType.NO_SHOW]: 'Клиент не на месте',
  [IssueType.BAD_ADDRESS]: 'Неверный адрес',
  [IssueType.TRAFFIC]: 'Пробки',
  [IssueType.ACCESS_DENIED]: 'Нет доступа',
  [IssueType.PARKING_ISSUE]: 'Проблема с парковкой',
  [IssueType.CLIENT_DELAY]: 'Задержка клиента',
  [IssueType.OTHER]: 'Другое'
};


