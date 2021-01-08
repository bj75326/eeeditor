const theme = localStorage.getItem('theme') || 'light';

document.documentElement.dataset['theme'] = theme;
