import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#0f2965ff', 
          surface: '#002081ff',    
          primary: '#032558ff',    
          secondary: '#424242', 
          accent: '#051530ff',
          error: '#FF5252',
          info: '#0c078fff',
          success: '#4CAF50',
          warning: '#FFC107',
          onBackground: '#FFFFFF',
          onSurface: '#FFFFFF',
        },
      },
    },
  },
})
