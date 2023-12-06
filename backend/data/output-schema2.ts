interface RootObject {
  ticket_types: RootObjectTicket_types;}
interface RootObjectTicket_types {
  items: RootObjectTicket_typesItem[];}
interface RootObjectTicket_typesItem {
  id: number;
  workflow: number;
  name: string;
}
  cards: RootObjectCards;
interface RootObjectCards {
  items: RootObjectCardsItem[];
interface RootObjectCardsItem {
  title: string;
  fields: RootObjectCardsItemFields;
interface RootObjectCardsItemFields {
  items: RootObjectCardsItemFieldsItem[];
interface RootObjectCardsItemFieldsItem {
  name: string;
  label: string;
  value: string;
}
}
}
}
  ticket_workflows: RootObjectTicket_workflows;
interface RootObjectTicket_workflows {
  items: RootObjectTicket_workflowsItem[];
interface RootObjectTicket_workflowsItem {
  id: number;
  name: string;
}
}
  tickets: RootObjectTickets;
interface RootObjectTickets {
  items: RootObjectTicketsItem[];
interface RootObjectTicketsItem {
  id: number;
  type: number;
  status: string;
  description: string;
}
}
}
