'use strict';

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const dotContainer = document.querySelector('.dots');
const modal = document.querySelector('.modal');
const nav = document.querySelector('.nav');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const slides = document.querySelectorAll('.slide');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal)); // adiciona event listeners a múltiplos botões ao mesmo tempo

/* for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal); */

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/* btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // window.scrollTo( // 1ª maneira de pular até certa parte da página
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({ // 2ª maneira
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({
    // 3ª maneira
    behavior: 'smooth',
  });
}); */

/* document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log('test');
    const id = this.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); */

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // usando event delegation
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabs.forEach((tab) => tab.addEventListener('click', () => console.log('test'))); // má prática

tabsContainer.addEventListener('click', function (e) {
  // const btnClicked = e.target;
  // const btnClicked = e.target.parentElement;
  const btnClicked = e.target.closest('.operations__tab');
  // console.log(btnClicked);
  if (!btnClicked) return; // "guard clause" que serve para evitar erros ao clicar em nada (não nos botões)
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach((content) =>
    content.classList.remove('operations__content--active')
  );
  btnClicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${btnClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach((el) => {
      // if (el !== link) el.style.opacity = opacity;
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = opacity;
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
nav.addEventListener('mouseover', handleHover.bind(0.5));

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });
nav.addEventListener('mouseout', handleHover.bind(1));

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // calcula a altura dinamicamente
});

headerObserver.observe(header);

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return; // outro guard clause
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src; // substitui "src" por "data-src"
  // entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // remove o efeito blur assim que carrega 100%
  });
  observer.unobserve(entry.target);
};

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // faz as imagens carregarem mais rápido
});

imgTargets.forEach((img) => imgObserver.observe(img));

/* const slider = document.querySelector('.slider');
slider.style.transform = 'scale(0.4) translateX(-800px)';
slider.style.overflow = 'visible'; */

// slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
// goToSlide(0);

const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
// createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach((dot) => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
// activateDot(0);

let curSlide = 0;
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// btnRight.addEventListener('click', function () {
//   if (curSlide === maxSlide - 1) {
//     curSlide = 0;
//   } else {
//     curSlide++;
//   }
//   goToSlide(curSlide);
//   /*   slides.forEach(
//       (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
//     ); */
// });

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // console.log('dot test');
    // const slide = e.target.dataset.slide;
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
