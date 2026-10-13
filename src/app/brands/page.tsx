import React from 'react';
import { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Brands, Coming Soon // ZenithDistrict',
  description:
    'We are building brands with a purpose. Our first ventures are taking shape, and this is only the beginning.',
  path: '/brands',
});

export default function BrandsPage() {
  return (
    <ComingSoon
      divisionCode="Z-02"
      divisionTitle="Consumer Brands"
      sector="DISTRICT SECTOR NE"
      title="Brands, Coming Soon."
      description="We are building brands with a purpose. Our first ventures are taking shape, and this is only the beginning."
      statusLabel="UNDER DEVELOPMENT"
      homeHref="/"
      liveProductsHref="/#live-products"
    />
  );
}
