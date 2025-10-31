"use client";

import { DottedSeperator } from "@/components/DottedSeperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GraphWrapper } from "./GraphWrapper";
import { GraphHeading } from "./GraphHeading";
import { VolumeHistoryGraph } from "./VolumeHistoryGraph";
import { GroupedTransactionGraph } from "./GroupedTransactionGraph";

export const GraphCarousel = () => {
  return (
    <Card className="lg:w-[50%] w-full text-center lg:text-left">
      <CardHeader>
        <CardTitle className="text-lg text-base-content">
          Account Insights
        </CardTitle>
      </CardHeader>
      <DottedSeperator className="px-6" color="silver" />
      <CardContent className="px-6">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <GraphHeading heading="Volume History" />
              <GraphWrapper>
                <VolumeHistoryGraph />
              </GraphWrapper>
            </CarouselItem>
            <CarouselItem>
              <GraphHeading heading="Expenses Distribution" />
              <GraphWrapper>
                <GroupedTransactionGraph />
              </GraphWrapper>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
};
