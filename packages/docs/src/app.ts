const html = document.documentElement;

const theme = localStorage.getItem('theme') || 'light';

html.dataset['theme'] = theme;

const direction = localStorage.getItem('direction') || 'ltr';

html.dataset['direction'] = direction;
if (direction === 'rtl') {
  html.classList.remove('ltr');
  html.classList.add('rtl');
} else {
  html.classList.remove('rtl');
  html.classList.add('ltr');
}

const locale = localStorage.getItem('umi_locale');

html.lang = locale ? locale.slice(0, 2) : 'en';
