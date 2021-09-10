module.exports = {
  register () {
    this.routes = [
      {
        path: '/stacking-report',
        name: 'stacking-report',
        component: 'Home'
      }
    ]

    this.menuItems = [
      {
        routeName: 'stacking-report',
        title: 'Stacking Reward Report'
      }
    ]
  },

  getComponentPaths () {
    return this.routes.reduce((all, route) => {
      return {
        ...all,
        [route.component]: `pages/${route.component}.js`
      }
    }, {})
  },

  getRoutes () {
    return this.routes
  },

  getMenuItems () {
    return this.menuItems
  }
}
