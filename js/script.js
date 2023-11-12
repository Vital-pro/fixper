let burger = document.querySelector('.menu__icon ');
let menu = document.querySelector('.menu');
const body = document.body;
const linksNav = menu.querySelectorAll('.menu__link');

if (menu && burger && linksNav)
  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
    burger.classList.toggle('active');
    body.classList.toggle('lock');

    linksNav.forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        burger.classList.remove('active');
        body.classList.remove('lock');
      });
    });
  });

// ----Color-Theme-----------
const themeSelect = document.getElementById('themes-select');

// сохраним последнюю текущую тему (в будущем получим в браузере из localStorage)
// let lastSelectedTheme = localStorage.getItem('app_theme') || 'normal';

// При самом первом запуске setTheme() проверим, какая схему в localStorage сейчас
setTheme(lastSelectedTheme);

// при изменении select-a обработчик события - это onThemeSelectHandler
themeSelect.addEventListener('change', onThemeSelectHandler);

// эта функция обработчик изменения select-a
function onThemeSelectHandler(e) {
  let selectedTheme = themeSelect.value;

  const isConfirmed = confirm(
    `Are you sure you want to change to a ${selectedTheme} theme?`
  );
  if (!isConfirmed) {
    themeSelect.value = lastSelectedTheme;
    return;
  }
  setTheme(selectedTheme);
  lastSelectedTheme = selectedTheme;
  // запишем выбранную тему в LocalStorage
  localStorage.setItem('app_theme', selectedTheme);
}

themeSelect.value = lastSelectedTheme;

// эта функция будет устанавливать theme (т.к. тема может приходить с сервера)
function setTheme(name) {
  body.classList.remove('light', 'dark', 'normal');
  body.classList.add(name);
}

// ---Filter dropdown--------
const filter = document.querySelector('.filter');

if (filter) {
  const items = filter.querySelectorAll('.block-filter');

  items.forEach((item) =>
    item.addEventListener('click', (e) => {
      item.querySelector('.block-filter__dropdown').classList.toggle('active');
      item.querySelector('.block-filter__icon').classList.toggle('active');

      if (e.target.classList.contains('block-filter__item')) {
        item.querySelector('.block-filter__value').textContent =
          e.target.textContent;
      }
    })
  );
}

// --Swiper------------
const popularSlider = new Swiper('.popular-slider', {
  spaceBetween: 20,
  slidesPerView: 1,
  loop: true,
  //? Navigation arrows
  navigation: {
    nextEl: '.popular-slider-next',
    prevEl: '.popular-slider-prev',
  },
  breakpoints: {
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
    },
    660: {
      slidesPerView: 2,
    },
  },
});

const reviewsSlider = new Swiper('.slider-reviews', {
  spaceBetween: 20,
  slidesPerView: 1,
  autoHeight: true,
  // loop: true,
  //? Navigation arrows
  navigation: {
    nextEl: '.slider-reviews-next',
    prevEl: '.slider-reviews-prev',
  },
});

// ------Gallery---
const galleryItems = document.querySelectorAll('.gallery__item');

if (galleryItems.length > 0) {
  galleryItems.forEach((item) => {
    new Swiper(item, {
      slidesPerView: 1,
      autoplay: {
        delay: 1500,
      },
      effect: 'fade',
    });
  });
}

// -----Scroll smooth----------
// Найдем все ссылки у которых атрибуты href начинаются с #
const links = document.querySelectorAll('a[href*="#"]');
// const menuActive = document.querySelector('.menu .active');

links.forEach((link) =>
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const blockId = link.getAttribute('href').substring(1);

    document.getElementById(blockId).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // menuActive.classList.remove('.active')
  })
);

// ---Header shadow-----------
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY;

  if (scrollPos > 80) {
    header.classList.add('shadow');
  } else {
    header.classList.remove('shadow');
  }
});

// ---Modal--сделаем одной -универсальной- функцией----------------

// Создадим ОБЪЕКТ, завернем туда функцию modalControllerю Это для того, чтобы в будущем было удобно сохранить scrollPosition (это временное хранение значения позиции скролла). Он будет содержать два метода: disabledScroll() и enabledScroll().
// вместо стейта сохраним состояние scroll-а в объекте с двумя методами - scrollPosition: 0,
const scrollController = {
  scrollPosition: 0,
  scrollBar: window.innerWidth - document.body.offsetWidth,

  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px;
    `;

    document.querySelector('.header').style.paddingRight =
      this.scrollBar + 'px';
    document.documentElement.style.scrollBehavior = 'unset';
  },

  enabledScroll() {
    document.body.classList.remove('lock');
    document.body.style.cssText = '';
    window.scroll({ top: scrollController.scrollPosition });
    document.querySelector('.header').style.paddingRight = '';
    document.documentElement.style.scrollBehavior = '';
  },
};

const modalController = ({ modalW, btnOpen, btnClose }) => {
  const openModalBtns = document.querySelectorAll(btnOpen);
  const modal = document.querySelector(modalW);
  const modalBtn = document.querySelector('.modal__btn');
  const closeModalBtn = document.querySelector(btnClose);

  // это еще один способ найти ширину scroll
  // let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  const closeModal = (event) => {
    //? мешает вводу в инпуты формы
    // event.preventDefault();
    const target = event.target;

    if (
      target === modal ||
      (btnClose && target.closest(btnClose)) ||
      event.code === 'Escape'
    ) {
      modal.classList.remove('open');
      scrollController.enabledScroll();

      window.removeEventListener('keydown', closeModal);
    }
  };

  const openModal = (event) => {
    event.preventDefault();
    modal.classList.add('open');
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  modal.addEventListener('click', closeModal);
};

modalController({
  modalW: '.modal',
  btnOpen: '.register',
  btnClose: '.modal__close',
});
