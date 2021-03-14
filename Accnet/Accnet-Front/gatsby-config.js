module.exports = {
  siteMetadata: {
    title: `AccNet Online`,
    description: `Do your Income Tax Return with a simple and easy to use system of AccNet Online.`,
    author: `@AccNet`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    "gatsby-plugin-sass",
    `gatsby-plugin-less`,
    "gatsby-plugin-webpack-bundle-analyser-v2",
    "gatsby-plugin-remove-serviceworker",
    "gatsby-plugin-react-helmet",
    `gatsby-plugin-webpack-size`,
    "gatsby-plugin-root-import",
    "gatsby-plugin-no-sourcemaps",
    "gatsby-plugin-typescript",
    "gatsby-plugin-sass",
    "gatsby-plugin-typescript-checker",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `AccNet`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: "./src/assets/images/image/icon/fav.png"
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // CommonMark mode (default: true)
        commonmark: true,
        // Footnotes mode (default: true)
        footnotes: true,
        // Pedantic mode (default: true)
        pedantic: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [],
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-59P3T9D",
  
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
  
        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },
      },
    }
  ],
}
