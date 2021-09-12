module.exports = {
  register () {
    this.routes = [
      {
        path: '/staking-report',
        name: 'staking-report',
        component: 'Home'
      }
    ]

    this.menuItems = [
      {
        routeName: 'staking-report',
        title: 'Staking Reward Report'
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
