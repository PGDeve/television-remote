import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Spinner } from "./Spinner";

export default {
  title: "Spinner",
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

export const LoadingSpinner: ComponentStory<any> = () => <Spinner />;

export const LoadingSpinnerOnBlack: ComponentStory<any> = () => (
  <div className="bg-black w-screen h-screen">
    <Spinner />
  </div>
);
