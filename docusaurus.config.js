/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Development Portal',
  tagline: '',
  url: 'https://developers.citizenlab.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'Go Vocal', // Usually your GitHub org/user name.
  projectName: 'Go Vocal', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'Go Vocal',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/',
          activeBasePath: '/guides',
          label: 'Guides',
          position: 'left',
        },
        {
          to: '/api',
          activeBasePath: '/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/CitizenLabDotCo/citizenlab-oss',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Info',
          items: [
            {
              label: 'Go Vocal',
              to: 'https://www.govocal.com',
            },
            {
              label: 'Blog',
              to: 'https://www.govocal.com/blog',
            },
            {
              label: 'Development portal',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github discussions',
              href: 'https://github.com/CitizenLabDotCo/citizenlab-oss/discussions',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/citizenlabco',
            },
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Go Vocal`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/CitizenLabDotCo/documentation/edit/master',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            spec: 'https://developers.citizenlab.co/api-docs/ee/public_api/master/open_api.json',
            // Use this in development instead
            // spec: '../citizenlab/back/doc/public_api/open_api.json',
            route: '/api/',
          },
        ]
      },
    ],
  ],
};
