import React from 'react';
import { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Labs, Coming Soon // ZenithDistrict',
  description:
    'A space for experiments, ideas, and digital products. New things are in the works.',
  path: '/labs',
});

export default function LabsPage() {
  return (
    <ComingSoon
      divisionCode="Z-04"
      divisionTitle="Labs & Experiments"
      sector="DISTRICT SECTOR SE"
      title="Labs, Coming Soon."
      description="A space for experiments, ideas, and digital products. New things are in the works."
      statusLabel="UNDER DEVELOPMENT"
      homeHref="/"
      liveProductsHref="/#live-products"
    />
  );
}
