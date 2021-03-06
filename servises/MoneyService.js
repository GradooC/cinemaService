import ApplicationService from './ApplicationService';

export default class extends ApplicationService {
  createPrice(cinemaHallId, value) {
    const cinemaHall = this.repositories.CinemaHall.find(cinemaHallId);
    const price = new this.entities.Price(cinemaHall, value);
    const errors = this.validate(price);
    if (!errors) {
      this.repositories.Price.save(price);
    }
    return [price, errors];
  }

  createFilmScreening(filmId, cinemaHallId, time) {
    const film = this.repositories.Film.find(filmId);
    const cinemaHall = this.repositories.CinemaHall.find(cinemaHallId);
    const price = this.repositories.Price.findBy({ cinemaHall });
    const cost = price.calculateFor(time);
    const screening = new this.entities.FilmScreening(film, cinemaHall, time, cost);

    const errors = this.validate(screening);
    if (!errors) {
      this.repositories.FilmScreening.save(screening);
    }
    return [screening, errors];
  }

  refundTicket(ticketId) {
    // BEGIN (write your solution here)
    const ticket = this.repositories.FilmScreeningTicket.find(ticketId);
    if (ticket.is('active')) {
      ticket.refund();
      const capitalTransaction = new this.entities.CapitalTransaction(ticket, 'loss');
      this.repositories.CapitalTransaction.save(capitalTransaction);
    }
    return ticket.is('returned');
    // END
  }

  buyTicket(userId, filmScreeningId, place) {
    const user = this.repositories.User.find(userId);
    const screening = this.repositories.FilmScreening.find(filmScreeningId);

    const ticket = new this.entities.FilmScreeningTicket(screening, user, place);
    const errors = this.validate(ticket);
    if (errors) {
      return [ticket, errors];
    }

    const capitalTransaction = new this.entities.CapitalTransaction(ticket, 'income');
    this.validate(capitalTransaction, { exception: true });

    this.repositories.FilmScreeningTicket.save(ticket);
    this.repositories.CapitalTransaction.save(capitalTransaction);

    return [ticket, errors];
  }
}