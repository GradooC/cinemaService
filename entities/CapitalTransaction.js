import uuid from 'uuid-js'; // eslint-disable-line
import ApplicationEntity from './ApplicationEntity';

export default class CapitalTransaction extends ApplicationEntity {
  static types = ['income', 'loss'];

  static constraints = {
    ticket: {
      presence: true,
    },
    cost: {
      presence: true,
      numericality: true,
    },
    type: {
      presence: true,
      inclusion: CapitalTransaction.types,
    },
  };

  constructor(ticket, type) {
    super();
    this.id = uuid.create().hex;
    this.ticket = ticket;
    this.type = type;
    this.cost = type === 'income' ? ticket.cost : - ticket.cost;
    this.createdAt = new Date();
  }
}