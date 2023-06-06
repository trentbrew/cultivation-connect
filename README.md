<b>Cultivation Connect</b> is a framework for monitoring and managing crop growth through predictive insights, data visualization, and tools for controlling various environmental factors that impact your crops.

<br/>

# 💾 Installation

1. Clone the repository

- `git clone <https://github.com/cultivationconnect/cc-frontend>`

2. Install dependencies

- `npm install`

3. Run locally

- `npm run dev`

<br/>

# 📂 Supporting Files

[Crop Steering Framework](https://docs.google.com/spreadsheets/d/1UrczPzwDfpn8adnigQRyj91C---KBomb/edit#gid=1646154042)

- This file is a table that outlines a cultivation framework for growing crops. It is designed to steer the growth of crops through different stages of growth. The framework is divided into growth stages, and each stage has a set of metrics, sensors, ranges, and scores that are used to monitor and adjust the environment for the crops.
- The growth stages mentioned in the chart are: propagation, early vegetative, late vegetative, flower week 1-3, flower week 4-6, ripening week 7-8, flush, and harvest. The legend explains that the metrics listed in the chart are unique to each stage.
- The metrics listed for each growth stage include: daytime air temperature, nighttime air temperature, daytime relative humidity, nighttime relative humidity, vapor pressure deficit (VPD), and solar/PPFD. The table lists the ideal ranges for each metric and assigns a score to each range. The scores range from 0 to 3, with 3 being the ideal range for each metric.
- This data lives on the backend and can be found in the PocketBase table called ranges.

[New User Intake Form](https://docs.google.com/spreadsheets/d/1Xv88-DMgduCKjuhtsI2eKdPf0c98DC0cPz0JifbU4PA/edit#gid=0)

- This file outlines the onboarding process for new users. The data collected during this step is integral for providing accurate insights for the user’s specific situation.
- The onboarding intake form can be found in ~/pages/intake.vue.

<br/>

# 🌐 Resources

- <a href="https://cultivationconnect.com/" target="_blank">Official Website</a><br/>
- <a href="https://cultivationconnect.vercel.app/" target="_blank">Live App (Staging)</a><br/>
- <a href="https://app.cultivationconnect.com/" target="_blank">Live App (Production)</a><br/>

## Frontend

### Frameworks
  - <a href="https://vuejs.org/guide/introduction.html" target="_blank">Vue 3</a>
  - <a href="https://nuxt.com/docs/getting-started/introduction" target="_blank">Nuxt 3</a>
  - <a href="https://tailwindcss.com/docs" target="_blank">Tailwind CSS</a>
### 3rd Party APIs
  - <a href="https://iconic.rest/" target="_blank">Iconic API</a>
### Data Visualization
  - <a href="https://echarts.apache.org/examples/en/index.html" target="_blank">Apache ECharts</a>

## Backend

### Database
  - <a href="https://cultivationconnect.fly.io/_/" target="blank">PocketBase (DB Instance)</a>
  - <a href="https://pocketbase.io/docs/" target="_blank">PocketBase (Docs)</a>
### File Storage
  - <a href="https://s3.console.aws.amazon.com/s3/buckets/cultivation-connect-temp?region=us-east-1&tab=objects" target="_blank">AWS S3</a>
### Email Server
  - <a href="https://app.brevo.com/" target="_blank">Brevo</a>
### Hosting
  - <a href="https://vercel.com/trent-brew/cultivation-connect" target="_blank">Vercel</a>
  - <a href="https://fly.io/apps/cultivationconnect" target="_blank">Fly.io</a>
