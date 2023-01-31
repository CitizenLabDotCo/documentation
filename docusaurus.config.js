/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Development Portal',
  tagline: '',
  url: 'https://developers.citizenlab.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'CititzenLab', // Usually your GitHub org/user name.
  projectName: 'CitizenLab', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'CitizenLab',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/',
          activeBasePath: '/',
          label: 'Docs',
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
              label: 'CitizenLab',
              to: 'https://www.citizenlab.co',
            },
            {
              label: 'Blog',
              to: 'https://www.citizenlab.co/blog',
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
      copyright: `Copyright © ${new Date().getFullYear()} CitizenLab`,
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
  ],
};
