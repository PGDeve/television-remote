import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Remote as AppRemote } from "./Remote";

export default {
  title: "Remote",
  component: AppRemote,
} as ComponentMeta<typeof AppRemote>;

const Template: ComponentStory<typeof AppRemote> = (args) => (
  <AppRemote {...args} />
);

export const Remote = Template.bind({});
Remote.args = {
  code: "000",
  goPrevious: () => {},
  goNext: () => {},
};
