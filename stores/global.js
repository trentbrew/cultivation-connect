import ranges from '@/data/ranges';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    window: {
      title: '',
      context: '',
    },
    cache: {
      avatar: '',
      cycles: [],
      plants: [],
      zones: [],
      rooms: [],
      tasks: [],
      sensors: [],
      cultivars: [],
      notifications: [],
    },
    constants: {
      ranges,
    },
    csv: {
      done: false,
      active: false,
      cancelled: false,
      importing: false,
      uploaded: false,
      entryCount: 0,
      data: null,
    },
    ui: {
      currentItem: null,
      details: {
        context: '',
        active: false,
      },
      toast: {
        type: '',
        message: '',
        active: false,
      },
      collections: {
        active: true,
      },
      sidebar: {
        active: true,
      },
      drawer: {
        context: '',
      },
    },
    settings: {
      appearance: {
        theme: 'garden',
      },
      localization: {
        language: 'en',
        units: 'imperial', // metric, imperial (check with Matt)
        clock: '12h', // 12h, 24h
        currency: 'usd', // usd, eur, gbp
      },
      notifications: {
        email: true,
        native: false,
      },
      integrations: {
        // ...
      },
    },
  }),
  getters: {
    getCsvStatus: state => state.csv,
    getCache: state => key => state.cache[key],
    getDetailsContext: state => state.ui.details.context,
    getCurrentItem: state => state.ui.currentItem,
    getDrawerContext: state => state.ui.drawer.context,
    getTitle: state => state.window.title,
    getContext: state => state.window.context,
    getTheme: state => state.settings.appearance.theme,
    getNotifications: state => state.cache.notifications,
    getToast: state => state.ui.toast,
    getAvatarUrl: state => state.cache.avatar,
    getCollectionsState: state => state.ui.collections.active,
    getRange: state => name => {
      return state.constants.ranges.find(range => range.name == name);
    },
  },
  actions: {
    cancelCsvUpload() {
      this.csv.done = false;
      this.csv.cancelled = true;
      this.csv.uploaded = false;
      this.csv.importing = false;
      this.csv.entryCount = 0;
      this.csv.active = false;
    },
    beginCsvImport() {
      this.csv.cancelled = false;
      this.csv.done = false;
      this.csv.active = true;
      this.csv.importing = true;
      this.csv.uploaded = false;
    },
    handleCsvUploaded(data) {
      if (this.csv.cancelled) return;
      this.csv.done = false;
      this.csv.uploaded = true;
      this.csv.active = true;
      this.csv.importing = false;
      this.csv.entryCount = data[0][0].entries.length;
      this.csv.data = data;
    },
    completeCsvImport() {
      if (this.csv.cancelled) return;
      this.csv.done = true;
      this.csv.active = false;
      this.csv.importing = false;
      this.csv.uploaded = false;
    },
    updateCache(key, data) {
      this.cache[key] = data;
    },
    closeDetails(context) {
      this.ui.details.active = false;
      this.ui.details.context = null;
    },
    openDetails(context) {
      this.ui.details.active = true;
      this.ui.details.context = context;
    },
    setDetails(id) {
      this.ui.details.active = true;
      this.ui.details.context = id;
    },
    setCurrentItem(name) {
      this.ui.currentItem = name;
    },
    setDrawerContext(context) {
      this.ui.drawer.context = context;
    },
    toggleCollections() {
      this.ui.collections.active = !this.ui.collections.active;
    },
    dismissNotification(id) {
      this.notifications = this.cache.notifications.filter(
        notification => notification.id !== id
      );
    },
    pushNotification(notification) {
      this.cache.notifications.push(notification);
    },
    clearNotifications() {
      this.cache.notifications = [];
    },
    setContext(context) {
      this.window.context = context;
    },
    setTitle(title) {
      this.window.title = title;
    },
    setTheme(theme) {
      this.settings.appearance.theme = theme;
    },
    toast(type, message, duration) {
      this.ui.toast = {
        type,
        message,
        active: true,
      };
      setTimeout(() => {
        this.ui.toast.active = false;
      }, duration || 3000);
    },
  },
});
