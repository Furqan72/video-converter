/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      coxs: '375px',
      xs: '425px',
      sm: '576px',
      comd: '650px',
      md: '768px',
      colg: '850px',
      lg: '992px',
      coxl: '1050px',
      xl: '1200px',
      co2xl: '1320px',
      '2xl': '1440px',
      '3xl': '1660px',
      '4xl': '1800px',
      max: '2000px',
      // max-width breakpoints
      maxcosm: { max: '424.5px' },
      maxsm: { max: '575.5px' },
      maxcomd: { max: '649.5px' },
      maxmd: { max: '767.5px' },
      maxlg: { max: '991.5px' },
      maxxl: { max: '1199.5px' },
      // min and max width breakpoints
      'sm-to-lg': { min: '576px', max: '992px' },
    },
    extend: {
      fontSize: {
        '15px': '15px',
      },
    },
  },
  plugins: [],
};
