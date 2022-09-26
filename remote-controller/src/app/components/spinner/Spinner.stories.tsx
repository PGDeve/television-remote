import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Remote } from "../remote/Remote";

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

const SpinnerWithRemoteTemplate: ComponentStory<any> = (args) => (
  <>
    <Spinner />
    <div className="w-screen h-screen flex items-center justify-center bg-slate-300 overflow-hidden">
      <Remote {...args}></Remote>
    </div>
  </>
);
export const SpinnerWithRemote = SpinnerWithRemoteTemplate.bind({});
SpinnerWithRemote.args = {
  code: "000",
  goPrevious: () => {},
  goNext: () => {},
};
