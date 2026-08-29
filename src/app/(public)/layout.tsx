import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSiteSettings } from '@/actions/settings';
import { getMenuByLocation } from '@/actions/menus';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const headerMenu = await getMenuByLocation('header-main');

  return (
    <>
      <Header
        siteLogo={settings.site_logo || '/images/logo.png'}
        menuItems={headerMenu?.items || []}
      />
      <main>{children}</main>
      <Footer
        siteName={settings.site_name}
        tagline={settings.site_tagline}
        phone={settings.contact_phone}
        email={settings.contact_email}
        hours={settings.contact_hours}
        address={settings.contact_address}
        socialLinkedin={settings.social_linkedin}
        socialInstagram={settings.social_instagram}
        socialYoutube={settings.social_youtube}
      />
    </>
  );
}
