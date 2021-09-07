import ProfileView from './view/profile-view';
import NavigationView from './view/navigation-view';
import FilterView from './view/filter-view';
import StatisticsView from './view/statistics-view';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilmsPresenter from './presenter/films-presenter';
import {FILMS_COUNT} from './const';
import {Rank, RenderPlace} from './types';
import {render} from './utils/dom-utils';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const statisticsElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_COUNT).fill(null).map((_, index) => generateFilm(index));
const allComments = films.map((film) => film.comments.map((id) => generateComment(id)));

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const navigationComponent = new NavigationView();
const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, commentsModel);

const getProfileRank = () => {
  const viewsCount = films.filter((film) => film.userDetails.alreadyWatched).length;
  let rank = '';

  Object
    .entries(Rank)
    .forEach(([, {name, range}]) => {
      if (viewsCount >= range.min && viewsCount <= range.max) {
        rank = name;
      }
    });

  return rank;
};

filmsModel.setFilms(films);
commentsModel.setAllComments(allComments);

if (films.length) {
  render(headerElement, new ProfileView(getProfileRank()));
}

render(mainElement, navigationComponent, RenderPlace.AFTER_BEGIN);
render(navigationComponent, new FilterView(films), RenderPlace.AFTER_BEGIN);
filmsPresenter.init();
render(statisticsElement, new StatisticsView(films.length));
