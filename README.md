<b>Cultivation Connect</b> is a framework for monitoring and managing crop growth through predictive insights, data visualization, and tools for controlling various environmental factors that impact your crops.

# Installation

1. Clone the repository

- `git clone <https://github.com/trentbrew/cultivation-connect>`

2. Install dependencies

- `npm install`

3. Run locally

- `npm run dev`

# Supporting Files

[Crop Steering Framework](https://docs.google.com/spreadsheets/d/1UrczPzwDfpn8adnigQRyj91C---KBomb/edit#gid=1646154042)

- This file is a table that outlines a cultivation framework for growing crops. It is designed to steer the growth of crops through different stages of growth. The framework is divided into growth stages, and each stage has a set of metrics, sensors, ranges, and scores that are used to monitor and adjust the environment for the crops.
- The growth stages mentioned in the chart are: propagation, early vegetative, late vegetative, flower week 1-3, flower week 4-6, ripening week 7-8, flush, and harvest. The legend explains that the metrics listed in the chart are unique to each stage.
- The metrics listed for each growth stage include: daytime air temperature, nighttime air temperature, daytime relative humidity, nighttime relative humidity, vapor pressure deficit (VPD), and solar/PPFD. The table lists the ideal ranges for each metric and assigns a score to each range. The scores range from 0 to 3, with 3 being the ideal range for each metric.
- This data lives on the backend and can be found in the PocketBase table called ranges.

[New User Intake Form](https://docs.google.com/spreadsheets/d/1Xv88-DMgduCKjuhtsI2eKdPf0c98DC0cPz0JifbU4PA/edit#gid=0)

- This file outlines the onboarding process for new users. The data collected during this step is integral for providing accurate insights for the user’s specific situation.
- The onboarding intake form can be found in ~/pages/intake.vue.

# Resources

- ***[Official Website](https://cultivationconnect.com/)***
- [Vue 3 Docs](https://v3.vuejs.org/)
- [Nuxt 3 Docs](https://v3.nuxtjs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PocketBase Docs](https://docs.pocketbase.io/)
- [Iconic API](https://iconic.rest/)
