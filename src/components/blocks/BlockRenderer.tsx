import React from 'react';
import AnimatedSection from '../animations/AnimatedSection';

import HeroSliderBlock from './HeroSliderBlock';
import PageHeroBlock from './PageHeroBlock';
import SplitHeroBlock from './SplitHeroBlock';
import VideoHeroBlock from './VideoHeroBlock';
import TwoColumnStoryBlock from './TwoColumnStoryBlock';
import ThreeColumnCardsBlock from './ThreeColumnCardsBlock';
import BlockquoteHighlightBlock from './BlockquoteHighlightBlock';
import CapabilitiesGridBlock from './CapabilitiesGridBlock';
import ModularFrameworkBlock from './ModularFrameworkBlock';
import ProductCatalogBlock from './ProductCatalogBlock';
import FeatureComparisonBlock from './FeatureComparisonBlock';
import ProcessStepsBlock from './ProcessStepsBlock';
import StatsCounterBlock from './StatsCounterBlock';
import ClientLogosBlock from './ClientLogosBlock';
import TestimonialsCarouselBlock from './TestimonialsCarouselBlock';
import PortfolioGridBlock from './PortfolioGridBlock';
import FaqAccordionBlock from './FaqAccordionBlock';
import PricingMatrixBlock from './PricingMatrixBlock';
import CtaBannerBlock from './CtaBannerBlock';
import RichTextBlock from './RichTextBlock';
import ContactFormBlock from './ContactFormBlock';

export interface BlockItem {
  id: string;
  blockType: string;
  orderIndex: number;
  contentJson: string;
  isVisible: boolean;
  animationType?: string | null;
  animationDuration?: string | null;
  animationDelay?: number | null;
}

interface BlockRendererProps {
  blocks: BlockItem[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  const visibleBlocks = blocks
    .filter((b) => b.isVisible !== false)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <>
      {visibleBlocks.map((block) => {
        let content: any = {};
        try {
          content = JSON.parse(block.contentJson);
        } catch (e) {
          console.error(`Failed to parse contentJson for block ${block.id}`, e);
          return null;
        }

        let renderedBlock: React.ReactNode = null;

        switch (block.blockType) {
          case 'HeroSliderBlock':
            renderedBlock = <HeroSliderBlock content={content} />;
            break;
          case 'PageHeroBlock':
            renderedBlock = <PageHeroBlock content={content} />;
            break;
          case 'SplitHeroBlock':
            renderedBlock = <SplitHeroBlock content={content} />;
            break;
          case 'VideoHeroBlock':
            renderedBlock = <VideoHeroBlock content={content} />;
            break;
          case 'TwoColumnStoryBlock':
            renderedBlock = <TwoColumnStoryBlock content={content} />;
            break;
          case 'ThreeColumnCardsBlock':
            renderedBlock = <ThreeColumnCardsBlock content={content} />;
            break;
          case 'BlockquoteHighlightBlock':
            renderedBlock = <BlockquoteHighlightBlock content={content} />;
            break;
          case 'CapabilitiesGridBlock':
            renderedBlock = <CapabilitiesGridBlock content={content} />;
            break;
          case 'ModularFrameworkBlock':
            renderedBlock = <ModularFrameworkBlock content={content} />;
            break;
          case 'ProductCatalogBlock':
            renderedBlock = <ProductCatalogBlock content={content} />;
            break;
          case 'FeatureComparisonBlock':
            renderedBlock = <FeatureComparisonBlock content={content} />;
            break;
          case 'ProcessStepsBlock':
            renderedBlock = <ProcessStepsBlock content={content} />;
            break;
          case 'StatsCounterBlock':
            renderedBlock = <StatsCounterBlock content={content} />;
            break;
          case 'ClientLogosBlock':
            renderedBlock = <ClientLogosBlock content={content} />;
            break;
          case 'TestimonialsCarouselBlock':
            renderedBlock = <TestimonialsCarouselBlock content={content} />;
            break;
          case 'PortfolioGridBlock':
            renderedBlock = <PortfolioGridBlock content={content} />;
            break;
          case 'FaqAccordionBlock':
            renderedBlock = <FaqAccordionBlock content={content} />;
            break;
          case 'PricingMatrixBlock':
            renderedBlock = <PricingMatrixBlock content={content} />;
            break;
          case 'CtaBannerBlock':
            renderedBlock = <CtaBannerBlock content={content} />;
            break;
          case 'RichTextBlock':
            renderedBlock = <RichTextBlock content={content} />;
            break;
          case 'ContactFormBlock':
            renderedBlock = <ContactFormBlock content={content} />;
            break;
          default:
            console.warn(`Unknown block type: ${block.blockType}`);
            return null;
        }

        return (
          <AnimatedSection
            key={block.id}
            id={`section-${block.id}`}
            animationType={block.animationType || 'fade-in'}
            animationDuration={block.animationDuration || 'normal'}
            animationDelay={block.animationDelay || 0}
          >
            {renderedBlock}
          </AnimatedSection>
        );
      })}
    </>
  );
}
